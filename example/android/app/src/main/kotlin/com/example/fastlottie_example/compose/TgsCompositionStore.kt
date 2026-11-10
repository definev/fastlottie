package com.example.fastlottie_example.compose

import android.content.res.AssetManager
import com.airbnb.lottie.LottieComposition
import com.airbnb.lottie.LottieCompositionFactory
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.CoroutineStart
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.async
import kotlinx.coroutines.cancel
import kotlinx.coroutines.ensureActive
import kotlinx.coroutines.sync.Semaphore
import kotlinx.coroutines.sync.withPermit
import kotlinx.coroutines.withContext
import java.util.LinkedHashMap

/** Activity-owned, main-thread-confined cache; asset IO and parsing run on IO. */
internal class TgsCompositionStore(private val assets: AssetManager) : AutoCloseable {
    private class Entry(val asset: String) {
        lateinit var job: Deferred<LottieComposition>
        var users = 0
        var started = false
        var sourceBytes = 0
    }

    class Lease(val composition: Deferred<LottieComposition>, private val onRelease: () -> Unit) {
        private var released = false
        fun release() {
            if (released) return
            released = true
            onRelease()
        }
    }

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private val worker = Semaphore(1)
    private val entries = LinkedHashMap<String, Entry>(16, .75f, true)
    private var sourceBytes = 0
    private var cached = 0
    private var closed = false

    suspend fun catalog(): List<String> = withContext(Dispatchers.IO) {
        val root = "flutter_assets/assets/tgs"
        val packs = assets.list(root).orEmpty().associateWith { pack ->
            assets.list("$root/$pack").orEmpty().map { "$root/$pack/$it" }
        }
        interleaveTgsPacks(packs)
    }

    fun acquire(asset: String): Lease {
        check(!closed)
        val entry = entries[asset] ?: Entry(asset).also { next ->
            entries[asset] = next
            next.job = scope.async(start = CoroutineStart.LAZY) {
                try {
                    val parsed = worker.withPermit {
                        ensureActive()
                        next.started = true
                        withContext(Dispatchers.IO) { parse(asset) }
                    }
                    next.sourceBytes = parsed.second
                    sourceBytes += parsed.second
                    cached++
                    trim()
                    parsed.first
                } catch (error: Throwable) {
                    if (entries[asset] === next) entries.remove(asset)
                    throw error
                }
            }
        }
        entry.users++
        entry.job.start()
        return Lease(entry.job) {
            entry.users--
            if (!closed && entry.users == 0 && !entry.started) {
                entry.job.cancel(CancellationException("TGS cell left viewport"))
                if (entries[asset] === entry) entries.remove(asset)
            }
            if (!closed) trim()
        }
    }

    private fun parse(asset: String): Pair<LottieComposition, Int> =
        openTgsJson(assets.open(asset)).use { input ->
            // Null key avoids duplicate global caching; parse directly from bytes.
            val result = LottieCompositionFactory.fromJsonInputStreamSync(input, null, false)
            val composition = result.value ?: throw (result.exception ?: IllegalArgumentException(asset))
            // Consume to EOF to check the gzip CRC and full inflated-size limit.
            val buffer = ByteArray(8192)
            while (input.read(buffer) != -1) { /* drain */ }
            composition to input.bytesRead
        }

    private fun trim() {
        if (cached <= 128 && sourceBytes <= 32 * 1024 * 1024) return
        val iterator = entries.entries.iterator()
        while (iterator.hasNext() && (cached > 128 || sourceBytes > 32 * 1024 * 1024)) {
            val entry = iterator.next().value
            if (entry.users > 0 || entry.sourceBytes == 0) continue
            iterator.remove()
            sourceBytes -= entry.sourceBytes
            cached--
        }
    }

    override fun close() {
        closed = true
        scope.cancel()
        entries.clear()
        sourceBytes = 0
        cached = 0
    }
}

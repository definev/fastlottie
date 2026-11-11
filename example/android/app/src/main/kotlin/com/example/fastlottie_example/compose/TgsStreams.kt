package com.example.fastlottie_example.compose

import java.io.FilterInputStream
import java.io.IOException
import java.io.InputStream
import java.io.PushbackInputStream
import java.util.zip.GZIPInputStream

internal const val MAX_TGS_JSON_BYTES = 16 * 1024 * 1024

internal fun interleaveTgsPacks(packs: Map<String, List<String>>): List<String> {
    val sorted = packs.toSortedMap()
        .filterKeys { !it.startsWith("Topics-") && it != "NotoEmoji" }
        .values.map { files -> files.filter { it.endsWith(".tgs") }.sorted() }
    return buildList {
        for (row in 0 until (sorted.maxOfOrNull { it.size } ?: 0)) {
            for (pack in sorted) pack.getOrNull(row)?.let { add(it) }
        }
    }
}

internal fun openTgsJson(
    input: InputStream,
    maximumBytes: Int = MAX_TGS_JSON_BYTES,
): BoundedTgsStream {
    require(maximumBytes > 0)
    val source = PushbackInputStream(input.buffered(), 2)
    try {
        val a = source.read()
        val b = source.read()
        if (b != -1) source.unread(b)
        if (a != -1) source.unread(a)
        val decoded = if (a == 0x1f && b == 0x8b) GZIPInputStream(source) else source
        return BoundedTgsStream(decoded, maximumBytes)
    } catch (error: Throwable) {
        source.close()
        throw error
    }
}

internal class BoundedTgsStream(input: InputStream, private val maximumBytes: Int) :
    FilterInputStream(input) {
    var bytesRead: Int = 0
        private set

    private fun account(count: Int) {
        if (count <= 0) return
        if (count > maximumBytes - bytesRead) throw IOException("TGS JSON exceeds $maximumBytes bytes")
        bytesRead += count
    }

    override fun read(): Int = `in`.read().also { if (it != -1) account(1) }

    override fun read(buffer: ByteArray, offset: Int, length: Int): Int =
        `in`.read(buffer, offset, length).also { account(it) }

    override fun skip(count: Long): Long {
        if (count <= 0) return 0
        val buffer = ByteArray(minOf(count, 8192).toInt())
        var skipped = 0L
        while (skipped < count) {
            val read = read(buffer, 0, minOf(buffer.size.toLong(), count - skipped).toInt())
            if (read == -1) break
            skipped += read
        }
        return skipped
    }
}

package com.example.fastlottie_example.compose

import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import java.io.IOException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import org.junit.Assert.*
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class TgsCompositionStoreTest {
    @Test fun parsesAll94BundledStickersWithNativeLottie() = runBlocking {
        val assets = InstrumentationRegistry.getInstrumentation().targetContext.assets
        val store = withContext(Dispatchers.Main) { TgsCompositionStore(assets) }
        try {
            val paths = store.catalog()
            assertEquals(94, paths.size)
            assertEquals(94, paths.toSet().size)
            assertEquals(4, paths.take(4).map { it.substringBeforeLast('/') }.toSet().size)
            for (path in paths) {
                val lease = withContext(Dispatchers.Main) { store.acquire(path) }
                val composition = lease.composition.await()
                assertTrue(path, composition.bounds.width() > 0)
                assertTrue(path, composition.bounds.height() > 0)
                assertTrue(path, composition.durationFrames > 0)
                withContext(Dispatchers.Main) { lease.release() }
            }
        } finally {
            withContext(Dispatchers.Main) { store.close() }
        }
    }

    @Test fun coalescesLeasesAndRecoversFromAssetFailure() = runBlocking {
        val assets = InstrumentationRegistry.getInstrumentation().targetContext.assets
        val store = withContext(Dispatchers.Main) { TgsCompositionStore(assets) }
        try {
            val missing = withContext(Dispatchers.Main) { store.acquire("flutter_assets/missing.tgs") }
            try {
                missing.composition.await()
                fail("Missing asset should fail")
            } catch (expected: IOException) {
                // A failed request must release the one parsing permit.
            } finally {
                withContext(Dispatchers.Main) { missing.release() }
            }
            val path = store.catalog().first()
            val (a, b) = withContext(Dispatchers.Main) { store.acquire(path) to store.acquire(path) }
            assertSame(a.composition, b.composition)
            val parsed = a.composition.await()
            withContext(Dispatchers.Main) { a.release() }
            assertSame(parsed, b.composition.await())
            withContext(Dispatchers.Main) { b.release() }
            val cached = withContext(Dispatchers.Main) { store.acquire(path) }
            assertSame(parsed, cached.composition.await())
            withContext(Dispatchers.Main) { cached.release() }
        } finally {
            withContext(Dispatchers.Main) { store.close() }
        }
    }
}

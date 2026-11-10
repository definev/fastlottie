package com.example.fastlottie_example.compose

import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.IOException
import java.util.zip.GZIPOutputStream
import org.junit.Assert.*
import org.junit.Test

class TgsStreamsTest {
    private fun gzip(bytes: ByteArray) = ByteArrayOutputStream().apply {
        GZIPOutputStream(this).use { it.write(bytes) }
    }.toByteArray()

    @Test fun catalogSortsPacksAndInterleavesUnequalRows() {
        assertEquals(
            listOf("a/1.tgs", "b/1.tgs", "a/2.tgs"),
            interleaveTgsPacks(mapOf("b" to listOf("b/1.tgs"), "a" to listOf("a/2.tgs", "a/1.tgs", "ignore.json"))),
        )
    }

    @Test fun rawAndGzipBytesDecodeWithoutDependingOnExtension() {
        val json = "{\"w\":512}".toByteArray()
        for (bytes in listOf(json, gzip(json))) {
            openTgsJson(ByteArrayInputStream(bytes)).use { input ->
                assertArrayEquals(json, input.readBytes())
                assertEquals(json.size, input.bytesRead)
            }
        }
    }

    @Test fun inflatedBudgetAppliesToBulkReadsAndSkip() {
        for (bytes in listOf(ByteArray(256), gzip(ByteArray(256)))) {
            assertThrows(IOException::class.java) {
                openTgsJson(ByteArrayInputStream(bytes), 32).use { it.readBytes() }
            }
            assertThrows(IOException::class.java) {
                openTgsJson(ByteArrayInputStream(bytes), 32).use { it.skip(256) }
            }
        }
    }

    @Test fun corruptGzipTrailerIsRejected() {
        val bytes = gzip("{}".toByteArray())
        bytes[bytes.size - 8] = (bytes[bytes.size - 8].toInt() xor 1).toByte()
        assertThrows(IOException::class.java) {
            openTgsJson(ByteArrayInputStream(bytes)).use { it.readBytes() }
        }
    }

    @Test fun allBundledStickersInflateInTheSameCatalogOrder() {
        val root = File(checkNotNull(System.getProperty("fastlottie.assets")), "tgs")
        val catalog = interleaveTgsPacks(root.listFiles()!!.filter { it.isDirectory }.associate { pack ->
            pack.name to pack.listFiles()!!.map { it.path }
        })
        assertEquals(94, catalog.size)
        assertEquals(94, catalog.toSet().size)
        assertEquals(4, catalog.take(4).map { File(it).parent }.toSet().size)
        for (path in catalog) {
            openTgsJson(File(path).inputStream()).use { input ->
                val bytes = input.readBytes()
                assertTrue(path, bytes.isNotEmpty())
                assertEquals(bytes.size, input.bytesRead)
            }
        }
    }
}

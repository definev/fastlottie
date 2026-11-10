package com.example.fastlottie_example.compose

import android.animation.ValueAnimator
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.airbnb.lottie.LottieComposition
import com.airbnb.lottie.compose.LottieAnimation
import com.airbnb.lottie.compose.LottieConstants
import com.airbnb.lottie.compose.animateLottieCompositionAsState
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.awaitCancellation

/** Native entry point: opening this Activity does not create a FlutterEngine. */
class ComposeTgsActivity : ComponentActivity() {
    private lateinit var store: TgsCompositionStore
    private var playing by mutableStateOf(false)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        store = TgsCompositionStore(applicationContext.assets)
        setContent { MaterialTheme { ComposeTgsGallery(store, playing) } }
    }

    override fun onResume() {
        super.onResume()
        playing = if (Build.VERSION.SDK_INT >= 26) ValueAnimator.areAnimatorsEnabled() else
            Settings.Global.getFloat(contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) > 0f
    }

    override fun onPause() {
        playing = false
        super.onPause()
    }

    override fun onDestroy() {
        store.close()
        super.onDestroy()
    }
}

@Composable
private fun ComposeTgsGallery(store: TgsCompositionStore, playing: Boolean) {
    val catalog by produceState<Result<List<String>>?>(null, store) {
        value = try {
            Result.success(store.catalog())
        } catch (cancelled: CancellationException) {
            throw cancelled
        } catch (error: Exception) {
            Log.e("ComposeTgs", "Cannot load TGS catalog", error)
            Result.failure(error)
        }
    }
    Surface(modifier = Modifier.fillMaxSize(), color = Color(0xfffdf7ff)) {
        Column(Modifier.fillMaxSize().windowInsetsPadding(WindowInsets.safeDrawing)) {
            Box(Modifier.fillMaxWidth().height(48.dp), contentAlignment = Alignment.Center) {
                Text("lottie-compose", fontSize = 20.sp)
            }
            val paths = catalog?.getOrNull()
            when {
                catalog?.isFailure == true -> Text("Unable to load TGS assets")
                paths == null -> Unit
                paths.isEmpty() -> Text("No .tgs assets found")
                else -> LazyVerticalGrid(
                    columns = GridCells.Fixed(4),
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    // Keep ceil(itemCount / 4) arithmetic within Int range.
                    items(count = Int.MAX_VALUE - 3, key = { it }, contentType = { "tgs" }) { index ->
                        ComposeSticker(store, paths[index % paths.size], playing)
                    }
                }
            }
        }
    }
}

private data class StickerModel(val composition: LottieComposition? = null, val failed: Boolean = false)

@Composable
private fun ComposeSticker(store: TgsCompositionStore, asset: String, playing: Boolean) {
    val model by produceState(StickerModel(), store, asset) {
        val lease = store.acquire(asset)
        try {
            value = StickerModel(composition = lease.composition.await())
            awaitCancellation()
        } catch (cancelled: CancellationException) {
            throw cancelled
        } catch (error: Exception) {
            Log.e("ComposeTgs", "Cannot decode $asset", error)
            value = StickerModel(failed = true)
            awaitCancellation()
        } finally {
            lease.release()
        }
    }
    Box(
        Modifier.aspectRatio(1f).padding(start = 6.dp, top = 18.dp, end = 6.dp, bottom = 18.dp),
        contentAlignment = Alignment.Center,
    ) {
        val composition = model.composition
        if (composition != null) {
            val progress = animateLottieCompositionAsState(
                composition,
                isPlaying = playing,
                restartOnPlay = false,
                iterations = LottieConstants.IterateForever,
                useCompositionFrameRate = true,
            )
            // Read frame state during drawing, not in the grid's composition.
            LottieAnimation(
                composition = composition,
                progress = { progress.value },
                modifier = Modifier.fillMaxSize(),
            )
        } else if (model.failed) {
            Text("!", color = MaterialTheme.colorScheme.error)
        }
    }
}

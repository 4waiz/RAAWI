package ae.kanbanstudios.nazar

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import com.meta.wearable.dat.camera.Stream
import com.meta.wearable.dat.camera.addCamera
import com.meta.wearable.dat.camera.types.PhotoData
import com.meta.wearable.dat.camera.types.StreamConfiguration
import com.meta.wearable.dat.camera.types.VideoQuality
import com.meta.wearable.dat.core.Wearables
import com.meta.wearable.dat.core.selectors.AutoDeviceSelector
import com.meta.wearable.dat.core.session.DeviceSession
import com.meta.wearable.dat.core.session.DeviceSessionState
import java.io.ByteArrayOutputStream
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

/**
 * Glasses session following the lifecycle in Meta's CameraAccess sample (DAT 1.0.1):
 * createSession → observe state → start() → (STARTED) addCamera → stream.start() → capturePhoto().
 *
 * STATUS: scaffold — written against the official sample's API; not compiled or run on hardware
 * in the NAZAR build environment (no Android SDK there). See META_INTEGRATION.md.
 */
class GlassesSession(
    private val scope: CoroutineScope,
    private val onStatus: (String) -> Unit,
) {
  private var session: DeviceSession? = null
  private var stream: Stream? = null
  private val jobs = mutableListOf<Job>()

  fun start() {
    if (session != null) return
    Wearables.createSession(AutoDeviceSelector())
        .onSuccess { created ->
          session = created
          // Subscribe before start() so no transitions are missed (as in the official sample).
          jobs += scope.launch {
            created.state.collect { state ->
              onStatus("Session: $state")
              if (state == DeviceSessionState.STARTED) startCamera(created)
              if (state == DeviceSessionState.STOPPED) cleanup()
            }
          }
          jobs += scope.launch { created.errors.collect { onStatus("Session error: ${it.description}") } }
          created.start()
        }
        .onFailure { error, _ -> onStatus("Could not create session: ${error.description}") }
  }

  private fun startCamera(s: DeviceSession) {
    if (stream != null) return
    // NAZAR only needs occasional stills, so a low frame rate keeps battery and bandwidth down.
    s.addCamera(StreamConfiguration(videoQuality = VideoQuality.MEDIUM, frameRate = 2, compressVideo = false))
        .onSuccess { camera ->
          val added = camera.stream
          stream = added
          jobs += scope.launch { added.state.collect { onStatus("Camera stream: $it") } }
          added.start().onFailure { error, _ -> onStatus("Stream failed: ${error.description}") }
        }
        .onFailure { error, _ -> onStatus("Camera unavailable: ${error.description}") }
  }

  /** Capture one still from the glasses camera and return it as a downsized JPEG. */
  suspend fun captureJpeg(maxSize: Int = 768): ByteArray? {
    val s = stream ?: return null
    var photo: PhotoData? = null
    s.capturePhoto()
        .onSuccess { photo = it }
        .onFailure { error, _ -> onStatus("Capture failed: ${error.description}") }
    val captured = photo ?: return null
    // Decoding is CPU-bound; keep it off the main thread.
    return withContext(Dispatchers.Default) {
      val bmp: Bitmap? = when (captured) {
        is PhotoData.Bitmap -> captured.bitmap
        is PhotoData.HEIC -> {
          val buf = captured.data.duplicate()
          val bytes = ByteArray(buf.remaining()).also { buf.get(it) }
          BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
        }
      }
      bmp?.let { toJpeg(it, maxSize) }
    }
  }

  fun stop() {
    session?.stop()
  }

  private fun cleanup() {
    jobs.forEach { it.cancel() }
    jobs.clear()
    stream = null
    session = null
  }

  private fun toJpeg(src: Bitmap, maxSize: Int): ByteArray {
    val scale = minOf(1f, maxSize.toFloat() / maxOf(src.width, src.height))
    val bmp = if (scale < 1f) Bitmap.createScaledBitmap(src, (src.width * scale).toInt(), (src.height * scale).toInt(), true) else src
    return ByteArrayOutputStream().use { bmp.compress(Bitmap.CompressFormat.JPEG, 82, it); it.toByteArray() }
  }
}

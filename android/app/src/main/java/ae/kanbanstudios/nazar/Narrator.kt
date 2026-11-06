package ae.kanbanstudios.nazar

import android.content.Context
import android.media.AudioDeviceInfo
import android.media.AudioManager
import android.speech.tts.TextToSpeech
import java.util.Locale

/**
 * Spoken answers. DAT has no audio-output API: like Meta's BirdSpotter sample, NAZAR uses Android
 * TextToSpeech on the normal media route, which plays through the glasses' open-ear speakers when
 * they are the connected Bluetooth (A2DP/BLE) output.
 */
class Narrator(private val context: Context) : TextToSpeech.OnInitListener {
  private val tts = TextToSpeech(context, this)
  private var ready = false

  override fun onInit(status: Int) {
    ready = status == TextToSpeech.SUCCESS
  }

  fun glassesAudioConnected(): Boolean {
    val am = context.getSystemService(AudioManager::class.java)
    return am.getDevices(AudioManager.GET_DEVICES_OUTPUTS).any {
      it.type == AudioDeviceInfo.TYPE_BLUETOOTH_A2DP || it.type == AudioDeviceInfo.TYPE_BLUETOOTH_SCO || it.type == AudioDeviceInfo.TYPE_BLE_HEADSET
    }
  }

  fun speak(text: String, lang: String) {
    if (!ready) return
    tts.language = if (lang == "ar") Locale("ar", "AE") else Locale.UK
    tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "nazar-${System.currentTimeMillis()}")
  }

  fun shutdown() = tts.shutdown()
}

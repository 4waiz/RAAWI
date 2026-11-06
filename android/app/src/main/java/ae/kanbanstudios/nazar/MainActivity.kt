package ae.kanbanstudios.nazar

import android.Manifest
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import androidx.activity.ComponentActivity
import androidx.activity.result.contract.ActivityResultContracts.RequestMultiplePermissions
import androidx.lifecycle.lifecycleScope
import com.meta.wearable.dat.core.Wearables
import com.meta.wearable.dat.core.types.Permission
import com.meta.wearable.dat.core.types.PermissionStatus
import com.meta.wearable.dat.mockdevice.MockDeviceKit
import com.meta.wearable.dat.mockdevice.api.GlassesModel
import kotlinx.coroutines.launch

/**
 * NAZAR glasses companion (proof-of-concept scaffold).
 * Flow: register with Meta AI → start session → glasses camera stream → capture still →
 * /api/vision identifies the landmark → /api/ask answers → spoken through the glasses' audio route.
 */
class MainActivity : ComponentActivity() {
  private lateinit var log: TextView
  private lateinit var question: EditText
  private lateinit var glasses: GlassesSession
  private lateinit var narrator: Narrator
  private val api by lazy { NazarApi(BuildConfig.NAZAR_API_URL) }
  private var focusEntryId: String? = null

  private val androidPermissions = registerForActivityResult(RequestMultiplePermissions()) { granted ->
    if (granted.values.all { it }) {
      // Required before any Wearables API call.
      Wearables.initialize(this).onFailure { error, _ -> status("DAT init failed: ${error.description}") }
      status("DAT initialised")
      lifecycleScope.launch { Wearables.registrationState.collect { status("Registration: $it") } }
    } else status("Bluetooth permission denied")
  }

  private val wearablesPermission = registerForActivityResult(Wearables.RequestPermissionContract()) { result ->
    status("Glasses camera permission: ${result.getOrDefault(PermissionStatus.Denied)}")
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    narrator = Narrator(this)
    glasses = GlassesSession(lifecycleScope, ::status)
    log = TextView(this).apply { textSize = 13f }
    question = EditText(this).apply { hint = "Ask NAZAR (e.g. What is that tower?)" }
    val root = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      setPadding(32, 48, 32, 32)
      addView(TextView(context).apply { text = "NAZAR · Glasses companion (scaffold)"; textSize = 20f })
      addView(button("1. Pair simulated Ray-Ban Meta (Mock Device Kit)") { pairMock() })
      addView(button("2. Register with Meta AI app") { Wearables.startRegistration(this@MainActivity) })
      addView(button("3. Request glasses camera permission") { wearablesPermission.launch(Permission.CAMERA) })
      addView(button("4. Start glasses session") { glasses.start() })
      addView(button("5. Look: capture + identify") { lookAndIdentify() })
      addView(question)
      addView(button("6. Ask") { askNazar(question.text.toString()) })
      addView(ScrollView(context).apply { addView(log) })
    }
    setContentView(root)
    androidPermissions.launch(arrayOf(Manifest.permission.BLUETOOTH_CONNECT))
    if (!api.configured) status("Set nazar_api_url in local.properties to reach the NAZAR API.")
  }

  /** Development only: a simulated pair of glasses — no hardware required. */
  private fun pairMock() {
    val kit = MockDeviceKit.getInstance(applicationContext)
    kit.enable()
    lifecycleScope.launch {
      kit.pairGlasses(GlassesModel.RAYBAN_META).fold(
          onSuccess = { device ->
            device.powerOn()
            device.unfold()
            device.don()
            status("Mock Ray-Ban Meta paired and worn. Set a camera feed with device.services.camera.setCapturedImage(uri).")
          },
          onFailure = { error, _ -> status("Mock pairing failed: $error") },
      )
    }
  }

  private fun lookAndIdentify() = lifecycleScope.launch {
    if (!api.configured) return@launch status("API not configured")
    val jpeg = glasses.captureJpeg() ?: return@launch status("No frame — is the session/stream started?")
    status("Captured ${jpeg.size / 1024} KB; identifying…")
    runCatching { api.vision(jpeg, "en") }
        .onSuccess { v ->
          status("Vision: ${v.status} ${v.entryId ?: "none"} (${(v.confidence * 100).toInt()}%)")
          if (v.status == "confident") focusEntryId = v.entryId
        }
        .onFailure { status("Vision failed: ${it.message}") }
  }

  private fun askNazar(q: String) = lifecycleScope.launch {
    if (q.isBlank() || !api.configured) return@launch
    runCatching { api.ask(q, if (q.any { it in '؀'..'ۿ' }) "ar" else "en", focusEntryId, null, emptyList()) }
        .onSuccess { r ->
          status("NAZAR (${r.mode}): ${r.spoken}\nSources: ${r.sources.joinToString()}")
          if (!narrator.glassesAudioConnected()) status("Note: glasses audio route not detected — playing on phone.")
          narrator.speak(r.spoken, r.lang)
        }
        .onFailure { status("Ask failed: ${it.message}") }
  }

  private fun button(label: String, onClick: () -> Unit) = Button(this).apply { text = label; setOnClickListener { onClick() } }

  private fun status(msg: String) = runOnUiThread { log.append("• $msg\n") }

  override fun onDestroy() {
    glasses.stop()
    narrator.shutdown()
    super.onDestroy()
  }
}

package ae.kanbanstudios.nazar

import android.util.Base64
import java.net.HttpURLConnection
import java.net.URL
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject

/** Minimal client for the same NAZAR Worker endpoints the web app uses (/api/vision, /api/ask). */
class NazarApi(private val baseUrl: String) {
  data class Vision(val entryId: String?, val confidence: Double, val status: String)
  data class Reply(val spoken: String, val lang: String, val mode: String, val sources: List<String>)

  val configured get() = baseUrl.isNotBlank()

  suspend fun vision(jpeg: ByteArray, lang: String): Vision = withContext(Dispatchers.IO) {
    val body = JSONObject()
        .put("consent", true) // the user tapped "Ask about what I see" — explicit, per-frame consent
        .put("lang", lang)
        .put("image", JSONObject().put("mimeType", "image/jpeg").put("base64", Base64.encodeToString(jpeg, Base64.NO_WRAP)))
    val json = post("/api/vision", body)
    Vision(json.optString("entryId").ifBlank { null }?.takeIf { it != "null" }, json.optDouble("confidence", 0.0), json.optString("status"))
  }

  suspend fun ask(question: String, lang: String, focusEntryId: String?, lastQaId: String?, used: List<String>): Reply = withContext(Dispatchers.IO) {
    val ctx = JSONObject()
        .put("focusEntryId", focusEntryId ?: JSONObject.NULL)
        .put("activeEntryId", focusEntryId ?: JSONObject.NULL)
        .put("lastQaId", lastQaId ?: JSONObject.NULL)
        .put("usedQaIds", JSONArray(used))
    val json = post("/api/ask", JSONObject().put("question", question).put("lang", lang).put("context", ctx))
    val a = json.getJSONObject("answer")
    val src = a.optJSONArray("sources") ?: JSONArray()
    Reply(a.getString("spoken"), a.getString("lang"), a.getString("mode"), (0 until src.length()).map { src.getJSONObject(it).getString("title") })
  }

  private fun post(path: String, body: JSONObject): JSONObject {
    val conn = URL(baseUrl.trimEnd('/') + path).openConnection() as HttpURLConnection
    conn.requestMethod = "POST"
    conn.connectTimeout = 8000
    conn.readTimeout = 15000
    conn.doOutput = true
    conn.setRequestProperty("content-type", "application/json")
    conn.outputStream.use { it.write(body.toString().toByteArray()) }
    val text = (if (conn.responseCode in 200..299) conn.inputStream else conn.errorStream).bufferedReader().use { it.readText() }
    if (conn.responseCode !in 200..299) throw IllegalStateException("HTTP ${conn.responseCode}: $text")
    return JSONObject(text)
  }
}

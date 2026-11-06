import java.util.Properties
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
  alias(libs.plugins.android.application)
  alias(libs.plugins.jetbrains.kotlin.android)
}

val localProperties = Properties().apply {
  val f = rootDir.resolve("local.properties")
  if (f.exists()) f.inputStream().use { load(it) }
}

android {
  namespace = "ae.kanbanstudios.nazar"
  compileSdk = 36

  buildFeatures { buildConfig = true }

  defaultConfig {
    applicationId = "ae.kanbanstudios.nazar"
    minSdk = 31
    targetSdk = 36
    versionCode = 1
    versionName = "0.1.0"
    manifestPlaceholders["mwdat_application_id"] = localProperties.getProperty("mwdat_application_id", "")
    manifestPlaceholders["mwdat_client_token"] = localProperties.getProperty("mwdat_client_token", "")
    buildConfigField("String", "NAZAR_API_URL", "\"${localProperties.getProperty("nazar_api_url", "")}\"")
  }

  compileOptions {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
  }
}

kotlin { compilerOptions { jvmTarget = JvmTarget.JVM_17 } }

dependencies {
  implementation(libs.mwdat.core)
  implementation(libs.mwdat.camera)
  // Mock Device Kit: simulated Ray-Ban Meta glasses for development without hardware.
  implementation(libs.mwdat.mockdevice)
  implementation(libs.androidx.activity.ktx)
  implementation(libs.androidx.lifecycle.runtime.ktx)
  implementation(libs.kotlinx.coroutines.android)
}

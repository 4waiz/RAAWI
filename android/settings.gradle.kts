pluginManagement {
  repositories {
    google()
    mavenCentral()
    gradlePluginPortal()
  }
}

dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
  repositories {
    google()
    // Meta Wearables Device Access Toolkit (com.meta.wearable:mwdat-*) is published to Maven Central.
    mavenCentral()
  }
}

rootProject.name = "NazarGlasses"
include(":app")

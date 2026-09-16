# Building the iOS IPA with GitHub Actions

The project is an Expo React Native app. The workflow at
`.github/workflows/build-ios-ipa.yml` generates the native iOS project, installs
CocoaPods, archives it with Xcode on a macOS runner, and uploads a signed
ad hoc `.ipa` as a GitHub Actions artifact.

## Required GitHub Actions secrets

Create these repository secrets before running the workflow:

| Secret                                   | Value                                                |
| ---------------------------------------- | ---------------------------------------------------- |
| `IOS_TEAM_ID`                            | Apple Developer Team ID                              |
| `IOS_DISTRIBUTION_CERTIFICATE_BASE64`    | Base64-encoded Apple Distribution `.p12` certificate |
| `IOS_DISTRIBUTION_CERTIFICATE_PASSWORD`  | Password used when exporting the `.p12`              |
| `IOS_AD_HOC_PROVISIONING_PROFILE_BASE64` | Base64-encoded ad hoc `.mobileprovision` profile     |

The provisioning profile must match:

- Bundle ID: `com.projectistiqamah.app`
- Distribution type: Ad Hoc
- Every iPhone UDID that should be able to install the app

The certificate and provisioning profile are signing credentials. Do not
commit them to the repository or put them in `app.json`.

## Running the build

Run **Actions → Build Project Istiqamah iOS IPA → Run workflow**, or push a tag
such as `v1.0.0`. When it completes, download the
`project-istiqamah-ios` artifact.

An ad hoc IPA can be sideloaded only onto devices included in the provisioning
profile and only while the profile is valid.

## What is native already

The standalone build includes the current React Native app, AsyncStorage
persistence, haptics, and local notifications. Expo Go is not used by the
workflow.

There is no single switch that enables every iPhone capability. Features such
as Screen Time monitoring, Dynamic Island Live Activities, widgets, HealthKit,
background processing, and Home Screen controls each require their own native
API, entitlement, and often an iOS extension. They can be added incrementally
without rewriting the existing React Native screens.

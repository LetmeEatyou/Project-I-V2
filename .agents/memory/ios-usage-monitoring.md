---
name: iOS usage monitoring
description: The platform boundary for adding Screen Time data to the Expo app
---

Project Istiqamah can track tasks entirely in Expo Go, but real iOS app-usage data requires Apple’s FamilyControls and DeviceActivity APIs, a native extension/entitlement, and an App Store-capable build. Expo Go cannot provide this data.

Live countdowns rendered in the Dynamic Island likewise require an ActivityKit Live Activity in a native iOS build; the Expo Go-safe implementation should use an in-app timer plus local notification alerts.

**Why:** iOS keeps Screen Time usage behind a restricted entitlement and native APIs; a JavaScript-only fallback would be misleading.

**How to apply:** Keep task tracking and local persistence independent of usage monitoring, and treat the usage feature as an optional native module when the app is prepared for iOS publishing.
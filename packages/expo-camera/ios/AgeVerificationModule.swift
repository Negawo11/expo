// Copyright 2024-present Suuqe. All rights reserved.

import ExpoModulesCore

#if canImport(DeclaredAgeRange)
import DeclaredAgeRange
#endif

#if canImport(UIKit)
import UIKit
#endif

public final class AgeVerificationModule: Module {
  public func definition() -> ModuleDefinition {
    Name("SuuqeAgeVerification")

    Property("isAgeVerificationAvailable") { () -> Bool in
      #if canImport(DeclaredAgeRange)
      if #available(iOS 26.0, *) {
        return true
      }
      #endif
      return false
    }

    AsyncFunction("checkRegionEligibility") { () -> [String: Any] in
      #if canImport(DeclaredAgeRange)
      if #available(iOS 26.2, *) {
        let service = AgeRangeService.shared
        let eligible = try await service.isEligibleForAgeFeatures
          return [
          "isRegionRestricted": eligible
        ]
      }
      #endif
      return [
        "isRegionRestricted": false
      ]
    }

    AsyncFunction("requestAgeVerification") { (ageGate: Int) -> [String: Any] in
      #if canImport(DeclaredAgeRange)
      if #available(iOS 26.0, *) {
        return try await self.performAgeVerification(ageGate: ageGate)
      }
      #endif
      throw AgeVerificationUnavailableException()
    }
  }

  #if canImport(DeclaredAgeRange)
  @available(iOS 26.0, *)
  @MainActor
  private func performAgeVerification(ageGate: Int) async throws -> [String: Any] {
    let service = AgeRangeService.shared

    guard let window = UIApplication.shared.connectedScenes
      .compactMap({ $0 as? UIWindowScene })
      .flatMap({ $0.windows })
      .first(where: { $0.isKeyWindow }),
      let rootViewController = window.rootViewController else {
      throw AgeVerificationNoWindowException()
    }

    let classification = try await service.requestAgeRange(ageGates: ageGate, in: rootViewController)

    switch classification {
    case .sharing(let range):
      let lowerBound = range.lowerBound
      let upperBound = range.upperBound

      let isAboveAgeGate: Bool
      if let upper = upperBound {
        isAboveAgeGate = upper >= ageGate
      } else if let lower = lowerBound {
        // No upper bound (e.g., "18+"), treat as above if lower >= ageGate
        isAboveAgeGate = lower >= ageGate
      } else {
        isAboveAgeGate = false
      }

      return [
        "status": "sharing",
        "isAboveAgeGate": isAboveAgeGate,
        "lowerBound": lowerBound as Any,
        "upperBound": upperBound as Any,
        "ageGate": ageGate,
        "declaration": range.ageRangeDeclaration.debugDescription
      ]

    @unknown default:
      return [
        "status": "unavailable",
        "isAboveAgeGate": false,
        "lowerBound": NSNull(),
        "upperBound": NSNull(),
        "ageGate": ageGate,
        "declaration": NSNull()
      ]
    }
  }
  #endif
}

internal class AgeVerificationUnavailableException: Exception {
  override var reason: String {
    "Age verification is not available on this device or OS version. Requires iOS 26.0+."
  }
}

internal class AgeVerificationNoWindowException: Exception {
  override var reason: String {
    "No active window found to present the age verification prompt."
  }
}

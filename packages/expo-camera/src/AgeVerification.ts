import { requireNativeModule } from 'expo-modules-core';

/**
 * Result returned by the age verification API.
 */
export interface AgeVerificationResult {
  /**
   * The status of the age verification.
   * - `"sharing"`: The user agreed to share their age range.
   * - `"unavailable"`: The age classification could not be determined.
   */
  status: 'sharing' | 'unavailable';

  /**
   * Whether the user's declared age is at or above the requested age gate.
   */
  isAboveAgeGate: boolean;

  /**
   * The lower bound of the user's declared age range, or `null` if not available.
   */
  lowerBound: number | null;

  /**
   * The upper bound of the user's declared age range, or `null` if not available.
   * A `null` upper bound with a non-null lower bound indicates "lowerBound+" (e.g., "18+").
   */
  upperBound: number | null;

  /**
   * The age gate value that was requested.
   */
  ageGate: number;

  /**
   * Debug description of the age range declaration, or `null` if unavailable.
   */
  declaration: string | null;
}

/**
 * Result returned by the region eligibility check.
 */
export interface RegionEligibilityResult {
  /**
   * Whether the user is in a region where age verification laws apply.
   * If `true`, the app should not be used in this jurisdiction.
   */
  isRegionRestricted: boolean;
}

interface AgeVerificationNativeModule {
  isAgeVerificationAvailable: boolean;
  checkRegionEligibility(): Promise<RegionEligibilityResult>;
  requestAgeVerification(ageGate: number): Promise<AgeVerificationResult>;
}

const SuuqeAgeVerification =
  requireNativeModule<AgeVerificationNativeModule>('SuuqeAgeVerification');

/**
 * Whether the Apple Declared Age Range API is available on this device.
 * Requires iOS 26.0+.
 */
export const isAgeVerificationAvailable: boolean =
  SuuqeAgeVerification.isAgeVerificationAvailable;

/**
 * Checks whether the user is in a region where age-related laws restrict usage.
 * This should be called BEFORE requesting age verification.
 *
 * Uses Apple's `AgeRangeService.isEligibleForAgeFeatures` under the hood.
 *
 * @returns A promise resolving to a `RegionEligibilityResult`.
 *
 * @example
 * ```ts
 * const { isRegionRestricted } = await checkRegionEligibility();
 * if (isRegionRestricted) {
 *   // Show jurisdiction-blocked screen
 * }
 * ```
 *
 * @platform ios 26+
 */
export async function checkRegionEligibility(): Promise<RegionEligibilityResult> {
  return SuuqeAgeVerification.checkRegionEligibility();
}

/**
 * Presents the system age verification prompt using Apple's Declared Age Range API.
 *
 * The user will be asked to confirm their age range. The result indicates whether
 * the user's declared age meets or exceeds the specified age gate.
 *
 * @param ageGate - The minimum age to verify against (e.g., 18 for adult content).
 * @returns A promise resolving to an `AgeVerificationResult`.
 * @throws If age verification is unavailable or the user dismisses the prompt.
 *
 * @example
 * ```ts
 * import { requestAgeVerification, isAgeVerificationAvailable } from 'suuqe-camera';
 *
 * if (isAgeVerificationAvailable) {
 *   const result = await requestAgeVerification(18);
 *   if (result.isAboveAgeGate) {
 *     console.log('User is 18+');
 *   }
 * }
 * ```
 *
 * @platform ios 26+
 */
export async function requestAgeVerification(
  ageGate: number = 18
): Promise<AgeVerificationResult> {
  return SuuqeAgeVerification.requestAgeVerification(ageGate);
}

import { requireNativeModule } from 'expo-modules-core';
const SuuqeAgeVerification = requireNativeModule('SuuqeAgeVerification');
/**
 * Whether the Apple Declared Age Range API is available on this device.
 * Requires iOS 26.0+.
 */
export const isAgeVerificationAvailable = SuuqeAgeVerification.isAgeVerificationAvailable;
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
/**
 * Checks whether the user is in a region where age-related laws restrict usage.
 * This should be called BEFORE requesting age verification.
 *
 * @returns A promise resolving to a `RegionEligibilityResult`.
 * @platform ios 26+
 */
export async function checkRegionEligibility() {
    return SuuqeAgeVerification.checkRegionEligibility();
}
export async function requestAgeVerification(ageGate = 18) {
    return SuuqeAgeVerification.requestAgeVerification(ageGate);
}
//# sourceMappingURL=AgeVerification.js.map

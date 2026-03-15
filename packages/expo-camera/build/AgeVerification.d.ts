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
 * Whether the Apple Declared Age Range API is available on this device.
 * Requires iOS 26.0+.
 */
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
export declare const isAgeVerificationAvailable: boolean;
/**
 * Checks whether the user is in a region where age-related laws restrict usage.
 * @platform ios 26+
 */
export declare function checkRegionEligibility(): Promise<RegionEligibilityResult>;
/**
 * Presents the system age verification prompt using Apple's Declared Age Range API.
 *
 * @param ageGate - The minimum age to verify against (e.g., 18 for adult content).
 * @returns A promise resolving to an `AgeVerificationResult`.
 * @throws If age verification is unavailable or the user dismisses the prompt.
 *
 * @platform ios 26+
 */
export declare function requestAgeVerification(ageGate?: number): Promise<AgeVerificationResult>;
//# sourceMappingURL=AgeVerification.d.ts.map

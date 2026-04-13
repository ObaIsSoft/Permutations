/**
 * Centralized configuration for all hardcoded limits and timeouts
 *
 * This prevents magic numbers scattered throughout the codebase and allows
 * environment variable overrides for different deployment scenarios.
 */
export const LIMITS = {
    // Token/text limits
    CONTEXT_MAX_CHARS: 5000,
    URL_CONTENT_MAX_CHARS: 50000,
    // Timeouts (ms)
    URL_FETCH_TIMEOUT_MS: 30000,
    URL_QUICK_TIMEOUT_MS: 5000,
    // Animation
    DEFAULT_ANIMATION_DURATION_MS: 5000,
    // Catalog sizes
    ICON_COUNT_MAX: 5000,
    PATTERN_COUNT_MAX: 3000,
    // Security
    MAX_ASSET_SIZE_MB: 50,
};
/**
 * Get the actual limits, allowing environment variable overrides
 */
export function getLimits() {
    return {
        ...LIMITS,
        CONTEXT_MAX_CHARS: parseInt(process.env.GENOME_CONTEXT_MAX_CHARS || String(LIMITS.CONTEXT_MAX_CHARS), 10),
        URL_CONTENT_MAX_CHARS: parseInt(process.env.GENOME_URL_CONTENT_MAX_CHARS || String(LIMITS.URL_CONTENT_MAX_CHARS), 10),
        URL_FETCH_TIMEOUT_MS: parseInt(process.env.GENOME_URL_FETCH_TIMEOUT_MS || String(LIMITS.URL_FETCH_TIMEOUT_MS), 10),
        URL_QUICK_TIMEOUT_MS: parseInt(process.env.GENOME_URL_QUICK_TIMEOUT_MS || String(LIMITS.URL_QUICK_TIMEOUT_MS), 10),
        MAX_ASSET_SIZE_MB: parseInt(process.env.GENOME_MAX_ASSET_SIZE_MB || String(LIMITS.MAX_ASSET_SIZE_MB), 10),
    };
}

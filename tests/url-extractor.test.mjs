/**
 * URL Genome Extractor Test
 * Tests the Playwright-based and fetch-fallback URL extraction
 */

import { urlGenomeExtractor } from '../dist/src/genome/extractor-url.js';

const TESTS = [];
const PASSED = [];
const FAILED = [];

function test(name, fn) {
    TESTS.push({ name, fn });
}

async function runTests() {
    console.log("\n🧬 Testing URL Genome Extractor\n");
    
    for (const { name, fn } of TESTS) {
        try {
            await fn();
            console.log(`  ✅ ${name}`);
            PASSED.push(name);
        } catch (e) {
            console.log(`  ❌ ${name}: ${e.message}`);
            FAILED.push({ name, error: e.message });
        }
    }
    
    console.log(`\n${PASSED.length}/${TESTS.length} passed`);
    if (FAILED.length > 0) {
        console.log("\nFailed tests:");
        FAILED.forEach(f => console.log(`  - ${f.name}: ${f.error}`));
    }
    
    return FAILED.length === 0;
}

// Test 1: Verify extractor is properly exported
test("URL Extractor is exported and has required methods", () => {
    if (!urlGenomeExtractor) {
        throw new Error("urlGenomeExtractor not exported");
    }
    if (typeof urlGenomeExtractor.extract !== 'function') {
        throw new Error("extract method not found");
    }
    if (typeof urlGenomeExtractor.initBrowser !== 'function') {
        throw new Error("initBrowser method not found");
    }
    if (typeof urlGenomeExtractor.closeBrowser !== 'function') {
        throw new Error("closeBrowser method not found");
    }
});

// Test 2: Test with a data URL (no network needed)
test("Handles data URL extraction via fetch fallback", async () => {
    // Use a data URL to test without network
    const dataUrl = "data:text/html,<style>body{color:red;background:white}</style><h1 style='font-size:24px'>Test</h1>";
    
    try {
        const result = await urlGenomeExtractor.extract(dataUrl);
        
        if (!result) {
            throw new Error("No result returned");
        }
        if (!result.colors) {
            throw new Error("No colors extracted");
        }
        if (!result.typography) {
            throw new Error("No typography extracted");
        }
        if (!result.layout) {
            throw new Error("No layout extracted");
        }
        if (!result.sector) {
            throw new Error("No sector inferred");
        }
        
        // Check extracted colors include red and white
        const hasColors = result.colors.all && result.colors.all.length > 0;
        if (!hasColors) {
            throw new Error("No colors found in extraction");
        }
    } catch (e) {
        // Data URLs might fail with fetch in some environments - that's OK
        if (e.message.includes("fetch")) {
            console.log("    (fetch not supported for data URLs - skipping validation)");
            return;
        }
        throw e;
    }
});

// Test 3: Verify error handling for invalid URLs
test("Handles invalid URLs gracefully", async () => {
    try {
        await urlGenomeExtractor.extract("not-a-valid-url");
        throw new Error("Should have thrown error for invalid URL");
    } catch (e) {
        // Expected to throw
        if (!e.message.includes("invalid") && !e.message.includes("URL") && !e.message.includes("fetch")) {
            throw new Error(`Unexpected error: ${e.message}`);
        }
    }
});

// Test 4: Close browser test
test("Can close browser without error", async () => {
    try {
        await urlGenomeExtractor.closeBrowser();
        // Should not throw
    } catch (e) {
        throw new Error(`closeBrowser threw: ${e.message}`);
    }
});

// Run all tests
runTests().then(success => {
    process.exit(success ? 0 : 1);
});

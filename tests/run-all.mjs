/**
 * Unified Test Runner for Permutations MCP
 * Runs all test suites sequentially with comprehensive reporting
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tests = [
    { name: 'Genome', file: 'genome.test.mjs' },
    { name: 'Sequencer', file: 'sequencer.test.mjs' },
    { name: 'Production', file: 'production.test.mjs' },
    { name: 'Ecosystem/Civilization', file: 'ecosystem-civilization.test.mjs' },
    { name: 'URL Extractor', file: 'url-extractor.test.mjs' },
    { name: 'Intent/Epigenetics', file: 'intent-epigenetics.test.mjs', optional: true }
];

const results = [];
let totalPassed = 0;
let totalFailed = 0;

console.log('🧬 Permutations MCP Test Suite\n');
console.log('=' .repeat(50));

for (const test of tests) {
    console.log(`\n📦 Running ${test.name}...`);
    const startTime = Date.now();
    
    try {
        const output = execSync(`node ${join(__dirname, test.file)}`, {
            encoding: 'utf-8',
            stdio: 'pipe',
            timeout: 120000 // 2 minute timeout per test
        });
        
        const duration = Date.now() - startTime;
        console.log(output);
        console.log(`✅ ${test.name} passed (${duration}ms)`);
        
        results.push({ name: test.name, status: 'passed', duration });
        totalPassed++;
    } catch (error) {
        const duration = Date.now() - startTime;
        
        if (test.optional) {
            console.log(`⚠️  ${test.name} skipped (optional, requires LLM API)`);
            results.push({ name: test.name, status: 'skipped', duration });
        } else {
            console.log(`❌ ${test.name} failed (${duration}ms)`);
            console.log(error.stdout || error.message);
            results.push({ name: test.name, status: 'failed', duration, error: error.message });
            totalFailed++;
        }
    }
}

console.log('\n' + '='.repeat(50));
console.log('📊 Test Summary\n');

results.forEach(r => {
    const icon = r.status === 'passed' ? '✅' : r.status === 'skipped' ? '⚠️' : '❌';
    console.log(`${icon} ${r.name.padEnd(25)} ${r.status.toUpperCase()} (${r.duration}ms)`);
});

console.log('\n' + '-'.repeat(50));
console.log(`Total: ${totalPassed} passed, ${totalFailed} failed, ${results.length - totalPassed - totalFailed} skipped`);

if (totalFailed > 0) {
    console.log('\n❌ Test suite failed');
    process.exit(1);
} else {
    console.log('\n✅ All required tests passed');
    process.exit(0);
}

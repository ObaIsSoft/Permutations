/**
 * Intent Extraction & Epigenetics Verification Test
 * 
 * Uses ACTUAL LLM calls - no mocks.
 * Tests:
 * 1. Intent extraction produces statistically different trait vectors
 * 2. PDF parsing extracts text for brand context
 * 3. Image parsing extracts dominant hue for color override
 * 4. Epigenetic hue actually overrides genome primary color
 * 
 * No hardcoded colors or designs in test logic.
 */

import { SemanticTraitExtractor } from '../dist/semantic/extractor.js';
import { EpigeneticParser } from '../dist/genome/epigenetics.js';
import { GenomeSequencer } from '../dist/genome/sequencer.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEST_DIR = path.join(__dirname, 'test-assets');

console.log('\n🔬 Intent Extraction & Epigenetics Verification\n');
console.log('⚠️  This test uses ACTUAL LLM calls. No mocks.\n');

// Ensure test directory exists
if (!fs.existsSync(TEST_DIR)) {
    fs.mkdirSync(TEST_DIR, { recursive: true });
}

// Check which LLM providers are available
const providers = [];
if (process.env.GROQ_API_KEY) providers.push('groq');
if (process.env.OPENAI_API_KEY) providers.push('openai');
if (process.env.ANTHROPIC_API_KEY) providers.push('anthropic');
if (process.env.GEMINI_API_KEY) providers.push('gemini');
if (process.env.OPENROUTER_API_KEY) providers.push('openrouter');
if (process.env.HUGGINGFACE_API_KEY) providers.push('huggingface');

console.log('Available providers:', providers.length > 0 ? providers.join(', ') : 'NONE');

if (providers.length === 0) {
    console.log('\n❌ No LLM API keys found. Set one of:');
    console.log('   GROQ_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY,');
    console.log('   GEMINI_API_KEY, OPENROUTER_API_KEY, HUGGINGFACE_API_KEY');
    process.exit(1);
}

// ============== TEST 1: Intent Extraction Statistical Verification ==============
console.log('\n' + '='.repeat(60));
console.log('TEST 1: Intent Extraction Statistical Verification');
console.log('='.repeat(60));

// Test with first available provider
const testProvider = providers[0];
console.log(`Using provider: ${testProvider}\n`);

const extractor = new SemanticTraitExtractor(undefined, testProvider);

// Test intents that SHOULD produce very different trait vectors
const testCases = [
    {
        name: 'Dashboard',
        intent: 'real-time financial dashboard with trading data, charts, and portfolio metrics',
        context: 'fintech platform for professional traders requiring high-frequency data updates',
        expected: { high: ['informationDensity', 'temporalUrgency'], low: ['playfulness'] }
    },
    {
        name: 'Portfolio',
        intent: 'photography portfolio for a landscape artist showcasing nature imagery and visual stories',
        context: 'minimalist portfolio website emphasizing visual storytelling and emotional connection',
        expected: { high: ['visualEmphasis'], low: ['informationDensity', 'temporalUrgency'] }
    },
    {
        name: 'Healthcare',
        intent: 'medical patient portal with appointment booking and health records access',
        context: 'healthcare clinic patient management system handling sensitive medical data',
        expected: { high: ['trustRequirement'], low: ['playfulness'] }
    }
];

const results = [];

for (const testCase of testCases) {
    console.log(`\n📤 Extracting: ${testCase.name}`);
    console.log(`   Intent: ${testCase.intent.slice(0, 50)}...`);
    
    try {
        const startTime = Date.now();
        const traits = await extractor.extractTraits(testCase.intent, testCase.context);
        const elapsed = Date.now() - startTime;
        
        console.log(`   ⏱️  Time: ${elapsed}ms`);
        console.log(`   📊 Traits:`);
        
        Object.entries(traits).forEach(([key, val]) => {
            const isExpectedHigh = testCase.expected.high.includes(key) && val > 0.6;
            const isExpectedLow = testCase.expected.low.includes(key) && val < 0.4;
            const marker = isExpectedHigh ? '✓ HIGH' : isExpectedLow ? '✓ LOW' : '  ';
            console.log(`      ${marker} ${key}: ${val.toFixed(2)}`);
        });
        
        results.push({ name: testCase.name, traits, elapsed });
    } catch (e) {
        console.log(`   ❌ Failed: ${e.message}`);
    }
}

// Statistical analysis
if (results.length >= 2) {
    console.log('\n📈 Statistical Analysis:');
    
    for (let i = 0; i < results.length; i++) {
        for (let j = i + 1; j < results.length; j++) {
            const r1 = results[i].traits;
            const r2 = results[j].traits;
            
            // Euclidean distance across all 8 dimensions
            const distance = Math.sqrt(
                Math.pow(r1.informationDensity - r2.informationDensity, 2) +
                Math.pow(r1.temporalUrgency - r2.temporalUrgency, 2) +
                Math.pow(r1.emotionalTemperature - r2.emotionalTemperature, 2) +
                Math.pow(r1.playfulness - r2.playfulness, 2) +
                Math.pow(r1.spatialDependency - r2.spatialDependency, 2) +
                Math.pow(r1.trustRequirement - r2.trustRequirement, 2) +
                Math.pow(r1.visualEmphasis - r2.visualEmphasis, 2) +
                Math.pow(r1.conversionFocus - r2.conversionFocus, 2)
            );
            
            // Max possible distance is sqrt(8) ≈ 2.83
            const maxPossible = Math.sqrt(8);
            const normalized = distance / maxPossible;
            
            console.log(`\n   ${results[i].name} vs ${results[j].name}:`);
            console.log(`      Distance: ${distance.toFixed(3)} / ${maxPossible.toFixed(3)}`);
            console.log(`      Differentiation: ${(normalized * 100).toFixed(1)}%`);
            console.log(`      Distinct: ${normalized > 0.15 ? '✅ YES' : '❌ NO'}`);
        }
    }
    
    // Specific pattern verification
    console.log('\n🎯 Pattern Verification:');
    const dashboard = results.find(r => r.name === 'Dashboard');
    const portfolio = results.find(r => r.name === 'Portfolio');
    const healthcare = results.find(r => r.name === 'Healthcare');
    
    if (dashboard && portfolio) {
        const infoDiff = dashboard.traits.informationDensity - portfolio.traits.informationDensity;
        const visualDiff = portfolio.traits.visualEmphasis - dashboard.traits.visualEmphasis;
        
        console.log(`   Dashboard infoDensity > Portfolio: ${infoDiff > 0 ? '✅' : '❌'} (${infoDiff > 0 ? '+' : ''}${infoDiff.toFixed(2)})`);
        console.log(`   Portfolio visualEmphasis > Dashboard: ${visualDiff > 0 ? '✅' : '❌'} (${visualDiff > 0 ? '+' : ''}${visualDiff.toFixed(2)})`);
    }
    
    if (healthcare && portfolio) {
        const trustDiff = healthcare.traits.trustRequirement - portfolio.traits.trustRequirement;
        console.log(`   Healthcare trust > Portfolio: ${trustDiff > 0 ? '✅' : '❌'} (${trustDiff > 0 ? '+' : ''}${trustDiff.toFixed(2)})`);
    }
}

// ============== TEST 2: PDF Parsing Verification ==============
console.log('\n' + '='.repeat(60));
console.log('TEST 2: PDF Parsing Verification');
console.log('='.repeat(60));

// Create a REAL PDF using pdf-lib
console.log('\nCreating real PDF with pdf-lib...');

const pdfPath = path.join(TEST_DIR, 'test-brand-guidelines.pdf');

try {
    const { PDFDocument, StandardFonts } = await import('pdf-lib');
    
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // US Letter size
    
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Add title
    page.drawText('Brand Guidelines', {
        x: 50,
        y: height - 50,
        size: 24,
        font: boldFont,
    });
    
    // Add content
    const content = [
        'Company: EcoTech Industries',
        '',
        'Mission Statement:',
        'Sustainable eco-friendly technology solutions for a better tomorrow.',
        '',
        'Core Values:',
        '- Transparency in all operations',
        '- Innovation through research',
        '- Community engagement and support',
        '',
        'Design Philosophy:',
        'Organic patterns derived from nature. Earthy color palette inspired',
        'by forest and ocean. Clean minimal typography for readability.',
        '',
        'Contact: brand@ecotech.industries'
    ];
    
    let y = height - 100;
    for (const line of content) {
        page.drawText(line, {
            x: 50,
            y: y,
            size: 12,
            font: font,
        });
        y -= 20;
    }
    
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, pdfBytes);
    
    console.log(`   ✅ Created real PDF: ${path.basename(pdfPath)}`);
    console.log(`   📄 PDF size: ${pdfBytes.length} bytes`);
    
} catch (e) {
    console.log(`   ❌ Failed to create PDF: ${e.message}`);
    console.log('   (pdf-lib may not be available)');
}

// Parse the PDF
const epigeneticParser = new EpigeneticParser();
console.log('\nParsing PDF for brand context...');

try {
    const epigeneticData = await epigeneticParser.parseAssets([pdfPath]);
    
    console.log('   Results:');
    console.log(`      Has brandContext: ${epigeneticData.brandContext ? '✅' : '❌'}`);
    
    if (epigeneticData.brandContext) {
        console.log(`      Context length: ${epigeneticData.brandContext.length} chars`);
        console.log(`      Contains "sustainable": ${epigeneticData.brandContext.toLowerCase().includes('sustainable') ? '✅' : '❌'}`);
        console.log(`      Contains "eco-friendly": ${epigeneticData.brandContext.toLowerCase().includes('eco-friendly') ? '✅' : '❌'}`);
        console.log(`      Contains "organic": ${epigeneticData.brandContext.toLowerCase().includes('organic') ? '✅' : '❌'}`);
        console.log(`      Contains "transparency": ${epigeneticData.brandContext.toLowerCase().includes('transparency') ? '✅' : '❌'}`);
        
        // Show first 150 chars
        const preview = epigeneticData.brandContext.slice(0, 150);
        console.log(`      Preview: "${preview}..."`);
        
        // Verify meaningful content was extracted
        const hasMeaningfulContent = epigeneticData.brandContext.length > 50 && 
                                     epigeneticData.brandContext.split(' ').length > 10;
        console.log(`      Meaningful content extracted: ${hasMeaningfulContent ? '✅' : '❌'}`);
    } else {
        console.log('      ❌ No brand context extracted');
    }
} catch (e) {
    console.log(`   ❌ PDF parsing failed: ${e.message}`);
    console.log(`      Stack: ${e.stack}`);
}

// ============== TEST 3 & 4: Image Hue Extraction & Override ==============
console.log('\n' + '='.repeat(60));
console.log('TEST 3 & 4: Image Hue Extraction & Epigenetic Override');
console.log('='.repeat(60));

console.log('\nCreating test images programmatically...');

try {
    const { default: sharp } = await import('sharp');
    
    // Create test images with specific RGB values
    const testColors = [
        { name: 'red', r: 220, g: 40, b: 40 },
        { name: 'green', r: 40, g: 200, b: 60 },
        { name: 'blue', r: 40, g: 80, b: 220 }
    ];
    
    const hueResults = [];
    
    for (const color of testColors) {
        const imagePath = path.join(TEST_DIR, `test-${color.name}.png`);
        
        await sharp({
            create: {
                width: 100,
                height: 100,
                channels: 3,
                background: { r: color.r, g: color.g, b: color.b }
            }
        }).png().toFile(imagePath);
        
        const data = await epigeneticParser.parseAssets([imagePath]);
        
        console.log(`\n   ${color.name.toUpperCase()}: RGB(${color.r}, ${color.g}, ${color.b})`);
        console.log(`      Extracted hue: ${data.epigeneticHue}°`);
        
        hueResults.push({
            name: color.name,
            hue: data.epigeneticHue,
            rgb: { r: color.r, g: color.g, b: color.b }
        });
    }
    
    // Verify hues are different
    const redHue = hueResults.find(h => h.name === 'red').hue;
    const greenHue = hueResults.find(h => h.name === 'green').hue;
    const blueHue = hueResults.find(h => h.name === 'blue').hue;
    
    console.log('\n   Hue Differentiation:');
    console.log(`      Red: ${redHue}°`);
    console.log(`      Green: ${greenHue}°`);
    console.log(`      Blue: ${blueHue}°`);
    
    const redGreenDiff = Math.abs(redHue - greenHue);
    const redBlueDiff = Math.abs(redHue - blueHue);
    const greenBlueDiff = Math.abs(greenHue - blueHue);
    
    console.log(`\n      Red-Green diff: ${redGreenDiff}° ${redGreenDiff > 60 ? '✅' : '❌'}`);
    console.log(`      Red-Blue diff: ${redBlueDiff}° ${redBlueDiff > 60 ? '✅' : '❌'}`);
    console.log(`      Green-Blue diff: ${greenBlueDiff}° ${greenBlueDiff > 60 ? '✅' : '❌'}`);
    
    // Test epigenetic override
    console.log('\n   Testing Genome Override:');
    
    const sequencer = new GenomeSequencer();
    const neutralTraits = {
        informationDensity: 0.5, temporalUrgency: 0.5, emotionalTemperature: 0.5,
        playfulness: 0.5, spatialDependency: 0.5, trustRequirement: 0.5,
        visualEmphasis: 0.5, conversionFocus: 0.5
    };
    
    // Generate without override
    const genomeNoOverride = sequencer.generate('test-none', neutralTraits, { primarySector: 'technology' });
    const noOverrideHue = genomeNoOverride.chromosomes.ch5_color_primary.hue;
    
    // Generate with red override
    const genomeRed = sequencer.generate('test-red', neutralTraits, { primarySector: 'technology' }, { epigeneticHue: redHue });
    const redOverrideHue = genomeRed.chromosomes.ch5_color_primary.hue;
    
    // Generate with blue override
    const genomeBlue = sequencer.generate('test-blue', neutralTraits, { primarySector: 'technology' }, { epigeneticHue: blueHue });
    const blueOverrideHue = genomeBlue.chromosomes.ch5_color_primary.hue;
    
    console.log(`      No override hue: ${noOverrideHue}°`);
    console.log(`      Red override hue: ${redOverrideHue}° (target: ${redHue}°)`);
    console.log(`      Blue override hue: ${blueOverrideHue}° (target: ${blueHue}°)`);
    
    const redAccuracy = Math.abs(redOverrideHue - redHue);
    const blueAccuracy = Math.abs(blueOverrideHue - blueHue);
    
    console.log(`\n      Red override accuracy: ${redAccuracy}° diff ${redAccuracy < 30 ? '✅' : '⚠️'}`);
    console.log(`      Blue override accuracy: ${blueAccuracy}° diff ${blueAccuracy < 30 ? '✅' : '⚠️'}`);
    console.log(`      Overrides produce different hues: ${redOverrideHue !== blueOverrideHue ? '✅' : '❌'}`);
    
} catch (e) {
    console.log(`   ⚠️  Image tests skipped: ${e.message}`);
}

// ============== Cleanup ==============
console.log('\n' + '='.repeat(60));
console.log('Cleanup');
console.log('='.repeat(60));

try {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
    console.log('✅ Test assets cleaned');
} catch (e) {
    console.log('⚠️  Cleanup skipped:', e.message);
}

console.log('\n✨ Tests Complete\n');

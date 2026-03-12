import { GenomeSequencer } from './dist/genome/sequencer.js';
import { HTMLGenerator } from './dist/html-generator.js';
import fs from 'fs';
import path from 'path';

async function verify() {
    const sequencer = new GenomeSequencer();
    const traits = {
        informationDensity: 0.5,
        temporalUrgency: 0.5,
        emotionalTemperature: 0.5,
        playfulness: 0.5,
        spatialDependency: 0.5,
        trustRequirement: 0.5,
        visualEmphasis: 0.5,
        conversionFocus: 0.5
    };

    const genome = sequencer.generate('fintech-test-seed', traits, {
        primarySector: 'fintech',
        options: { fontProvider: 'bunny' }
    });

    const generator = new HTMLGenerator();
    const html = generator.generate(genome);

    const outputPath = path.join(process.cwd(), 'verification-fintech.html');
    fs.writeFileSync(outputPath, html);
    console.log(`✅ Generated ${outputPath}`);

    // Basic checks
    if (html.includes('Sarah Johnson')) {
        console.log('❌ FAIL: Still found "Sarah Johnson" placeholder');
    } else {
        console.log('✅ PASS: "Sarah Johnson" placeholder replaced');
    }

    if (html.includes('Productivity, Simplified')) {
        console.log('❌ FAIL: Still found "Productivity, Simplified" placeholder');
    } else {
        console.log('✅ PASS: "Productivity, Simplified" placeholder replaced');
    }

    console.log('Headline found:', html.match(/<h1[^>]*>(.*?)<\/h1>/)?.[1]);
    console.log('Company found:', html.match(/<div class="logo">(.*?)<\/div>/)?.[1]);
}

verify();

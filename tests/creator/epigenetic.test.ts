/**
 * Test: Epigenetic Brief Generator
 * 
 * Validates:
 * 1. Latent space decoding produces semantic hints
 * 2. Persona generation creates coherent, diverse characters
 * 3. Brief generation produces unique creative directions
 * 4. Same intent + different genomes = different briefs
 * 5. Chaos and cross-pollination introduce unpredictability
 */

import { generateCreatorGenome } from '../../src/creator/generator.js';
import { generatePersona, generateBrief, decodeLatentSpace } from '../../src/brief/generator.js';
import { strict as assert } from 'assert';

console.log('=== Epigenetic Generator Tests ===\n');

// Test 1: Latent Space Decoding
console.log('Test 1: Latent Space Decoding');
{
  const genome = generateCreatorGenome('latent-decode-test');
  const interpretation = decodeLatentSpace(genome);
  
  console.log('  Decoded interpretation:');
  console.log(`    Cultural: ${interpretation.cultural_hint}`);
  console.log(`    Temporal: ${interpretation.temporal_hints.join(', ')}`);
  console.log(`    Aesthetic: ${interpretation.aesthetic_hint}`);
  console.log(`    Cognitive: ${interpretation.cognitive_hint}`);
  console.log(`    Social: ${interpretation.social_hint}`);
  console.log(`    Material: ${interpretation.material_hint}`);
  console.log(`    Narrative: ${interpretation.narrative_hint}`);
  
  assert(interpretation.cultural_hint.length > 0, 'Should have cultural hint');
  assert(interpretation.temporal_hints.length > 0, 'Should have temporal hints');
  assert(interpretation.aesthetic_hint.length > 0, 'Should have aesthetic hint');
  
  console.log('✓ Latent space decodes to semantic hints\n');
}

// Test 2: Persona Generation
console.log('Test 2: Persona Generation');
{
  const genome = generateCreatorGenome('persona-test');
  const persona = await generatePersona(genome);
  
  console.log('  Generated Persona:');
  console.log(`    ID: ${persona.id}`);
  console.log(`    Origin: ${persona.biography.origin.substring(0, 60)}...`);
  console.log(`    Formative: ${persona.biography.formative_years.substring(0, 60)}...`);
  console.log(`    Visual Language: ${persona.instincts.visual_language.join(', ')}`);
  console.log(`    Copy Voice: ${persona.instincts.copy_voice}`);
  console.log(`    Core Metaphor: ${persona.worldview.core_metaphor.substring(0, 60)}...`);
  console.log(`    Chaos Tolerance: ${persona.creative_behavior.chaos_tolerance.toFixed(3)}`);
  console.log(`    Coherence: ${persona.creative_behavior.coherence_style}`);
  
  assert(persona.id === genome.dna_hash, 'Persona ID should match genome hash');
  assert(persona.biography.origin.length > 20, 'Should have meaningful origin');
  assert(persona.worldview.core_metaphor.length > 10, 'Should have core metaphor');
  assert(persona.biography.contradictions.length > 0, 'Should have contradictions');
  
  console.log('✓ Persona generated with coherent biography\n');
}

// Test 3: Brief Generation
console.log('Test 3: Brief Generation');
{
  const genome = generateCreatorGenome('brief-test');
  const persona = await generatePersona(genome);
  
  const intent = {
    description: 'A portfolio site for a photographer',
    sector: 'photography',
    audience: 'Creative directors',
  };
  
  const brief = await generateBrief(persona, intent);
  
  console.log('  Generated Brief:');
  console.log(`    Concept: ${brief.concept.statement}`);
  console.log(`    Insight: ${brief.concept.insight.substring(0, 80)}...`);
  console.log(`    Primary Metaphor: ${brief.metaphor_system.primary}`);
  console.log(`    Secondary Metaphor: ${brief.metaphor_system.secondary}`);
  console.log(`    Tension: ${brief.metaphor_system.tension_description.substring(0, 80)}...`);
  console.log(`    Button Language: ${brief.component_language.buttons}`);
  console.log(`    Submit Button: "${brief.copy_system.microcopy_examples.submit}"`);
  
  assert(brief.concept.statement.includes('photographer') || brief.concept.statement.includes('portfolio'), 
         'Concept should reference intent');
  assert(brief.metaphor_system.primary.length > 0, 'Should have primary metaphor');
  assert(brief.component_language.buttons.length > 0, 'Should have button language');
  assert(brief.generated_by.id === persona.id, 'Brief should reference creator');
  
  console.log('✓ Brief generated with coherent creative direction\n');
}

// Test 4: Same Intent, Different Genomes = Different Briefs
console.log('Test 4: Diversity - Same Intent, Different Genomes');
{
  const intent = {
    description: 'A fintech dashboard',
    sector: 'fintech',
    audience: 'Traders',
  };
  
  const briefs = [];
  for (let i = 0; i < 10; i++) {
    const genome = generateCreatorGenome(`diversity-test-${i}`);
    const persona = await generatePersona(genome);
    const brief = await generateBrief(persona, intent);
    briefs.push(brief);
  }
  
  // Check metaphor diversity
  const primaryMetaphors = new Set(briefs.map(b => b.metaphor_system.primary));
  const secondaryMetaphors = new Set(briefs.map(b => b.metaphor_system.secondary));
  
  console.log(`  Generated ${briefs.length} briefs`);
  console.log(`  Unique primary metaphors: ${primaryMetaphors.size}`);
  console.log(`  Unique secondary metaphors: ${secondaryMetaphors.size}`);
  console.log(`  Primary metaphors used: ${Array.from(primaryMetaphors).join(', ')}`);
  
  assert(primaryMetaphors.size >= 2, 'Should have multiple primary metaphors');
  assert(secondaryMetaphors.size >= 2, 'Should have multiple secondary metaphors');
  
  // Check button language diversity
  const buttonLanguages = new Set(briefs.map(b => b.component_language.buttons));
  console.log(`  Unique button languages: ${buttonLanguages.size}`);
  assert(buttonLanguages.size >= 2, 'Should have diverse component language');
  
  console.log('✓ Same intent produces diverse creative directions\n');
}

// Test 5: Chaos Tolerance Effect
console.log('Test 5: Chaos Tolerance Effect');
{
  const lowChaosGenome = generateCreatorGenome('low-chaos');
  // Manually set low chaos
  (lowChaosGenome as any).c11_chaos_tolerance = 0.2;
  
  const highChaosGenome = generateCreatorGenome('high-chaos');
  // Manually set high chaos
  (highChaosGenome as any).c11_chaos_tolerance = 0.8;
  
  const intent = { description: 'An e-commerce site' };
  
  const lowChaosPersona = await generatePersona(lowChaosGenome);
  const highChaosPersona = await generatePersona(highChaosGenome);
  
  const lowChaosBrief = await generateBrief(lowChaosPersona, intent);
  const highChaosBrief = await generateBrief(highChaosPersona, intent);
  
  console.log('  Low Chaos Brief:');
  console.log(`    Tension: ${lowChaosBrief.metaphor_system.tension_description.substring(0, 60)}...`);
  console.log(`    Tertiary metaphor: ${lowChaosBrief.metaphor_system.tertiary || 'None'}`);
  
  console.log('  High Chaos Brief:');
  console.log(`    Tension: ${highChaosBrief.metaphor_system.tension_description.substring(0, 60)}...`);
  console.log(`    Tertiary metaphor: ${highChaosBrief.metaphor_system.tertiary || 'None'}`);
  
  // High chaos should have tertiary metaphor (unexpected element)
  assert(highChaosBrief.metaphor_system.tertiary, 'High chaos should introduce tertiary metaphor');
  assert(!lowChaosBrief.metaphor_system.tertiary, 'Low chaos should not have tertiary metaphor');
  
  console.log('✓ Chaos tolerance affects creative unpredictability\n');
}

// Test 6: Cross-Pollination Effect
console.log('Test 6: Cross-Pollination Effect');
{
  const lowCrossGenome = generateCreatorGenome('low-cross');
  (lowCrossGenome as any).c12_cross_pollination = 0.2;
  
  const highCrossGenome = generateCreatorGenome('high-cross');
  (highCrossGenome as any).c12_cross_pollination = 0.8;
  
  const intent = { description: 'A travel booking app' };
  
  const lowCrossPersona = await generatePersona(lowCrossGenome);
  const highCrossPersona = await generatePersona(highCrossGenome);
  
  const lowCrossBrief = await generateBrief(lowCrossPersona, intent);
  const highCrossBrief = await generateBrief(highCrossPersona, intent);
  
  console.log('  Low Cross-Pollination:');
  console.log(`    Unusual connections: ${lowCrossPersona.worldview.unusual_connections.length}`);
  console.log(`    Tension: ${lowCrossBrief.metaphor_system.tension_description.substring(0, 60)}...`);
  
  console.log('  High Cross-Pollination:');
  console.log(`    Unusual connections: ${highCrossPersona.worldview.unusual_connections.length}`);
  console.log(`    Tension: ${highCrossBrief.metaphor_system.tension_description.substring(0, 60)}...`);
  
  // High cross-pollination should have unusual connections
  assert(highCrossPersona.worldview.unusual_connections.length > 
         lowCrossPersona.worldview.unusual_connections.length,
         'High cross-pollination should have more connections');
  
  console.log('✓ Cross-pollination affects domain bridging\n');
}

// Test 7: Coherence Style Effect
console.log('Test 7: Coherence Style Effect');
{
  const integratedGenome = generateCreatorGenome('integrated');
  (integratedGenome as any).c15_coherence_style = 0.8;
  
  const fragmentedGenome = generateCreatorGenome('fragmented');
  (fragmentedGenome as any).c15_coherence_style = 0.2;
  
  const integratedPersona = await generatePersona(integratedGenome);
  const fragmentedPersona = await generatePersona(fragmentedGenome);
  
  console.log('  Integrated Persona:');
  console.log(`    Coherence: ${integratedPersona.creative_behavior.coherence_style}`);
  console.log(`    Contradictions: ${integratedPersona.biography.contradictions.length}`);
  
  console.log('  Fragmented Persona:');
  console.log(`    Coherence: ${fragmentedPersona.creative_behavior.coherence_style}`);
  console.log(`    Contradictions: ${fragmentedPersona.biography.contradictions.length}`);
  
  assert(integratedPersona.creative_behavior.coherence_style === 'integrated',
         'High coherence should be integrated');
  assert(fragmentedPersona.creative_behavior.coherence_style === 'fragmented',
         'Low coherence should be fragmented');
  
  console.log('✓ Coherence style affects persona integration\n');
}

// Test 8: Full Pipeline Example
console.log('Test 8: Full Pipeline - 3 Complete Examples');
{
  const intent = { description: 'A music streaming service landing page' };
  
  for (let i = 0; i < 3; i++) {
    console.log(`\n  Example ${i + 1}:`);
    
    const genome = generateCreatorGenome(`pipeline-example-${i}`);
    const persona = await generatePersona(genome);
    const brief = await generateBrief(persona, intent);
    
    console.log(`    Creator: ${persona.biography.origin.substring(0, 50)}...`);
    console.log(`    Philosophy: ${persona.worldview.design_philosophy.substring(0, 50)}...`);
    console.log(`    Concept: ${brief.concept.statement}`);
    console.log(`    Metaphor: ${brief.metaphor_system.primary} + ${brief.metaphor_system.secondary}`);
    console.log(`    Submit button: "${brief.copy_system.microcopy_examples.submit}"`);
  }
  
  console.log('\n✓ Full pipeline produces complete creative directions\n');
}

console.log('=== All Epigenetic Generator Tests Passed ===');

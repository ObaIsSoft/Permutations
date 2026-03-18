/**
 * Test: L0 Creator Genome Generation
 * 
 * Validates:
 * 1. Determinism - same seed = same genome
 * 2. Diversity - different seeds = different genomes
 * 3. No archetype clustering - values are evenly distributed
 * 4. Statistical validity - all chromosomes in valid ranges
 */

import { generateCreatorGenome, mutateGenome, crossoverGenomes } from '../../src/creator/generator.js';
import { validateCreatorGenome } from '../../src/creator/types.js';
import { strict as assert } from 'assert';

// Helper to calculate vector distance
function vectorDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - (b[i] || 0), 2), 0));
}

// Helper to check if value is in range
function inRange(val: number, min: number, max: number): boolean {
  return val >= min && val <= max;
}

console.log('=== L0 Creator Genome Tests ===\n');

// Test 1: Determinism
console.log('Test 1: Determinism');
{
  const genome1 = generateCreatorGenome('test-seed-123');
  const genome2 = generateCreatorGenome('test-seed-123');
  
  assert.deepEqual(genome1.c0_cultural_vector, genome2.c0_cultural_vector);
  assert.deepEqual(genome1.c4_authorial_embedding, genome2.c4_authorial_embedding);
  assert.equal(genome1.c11_chaos_tolerance, genome2.c11_chaos_tolerance);
  
  console.log('✓ Same seed produces identical genome\n');
}

// Test 2: Diversity
console.log('Test 2: Diversity - Generating 100 genomes...');
{
  const genomes = [];
  for (let i = 0; i < 100; i++) {
    genomes.push(generateCreatorGenome(`diversity-test-${i}`));
  }

  // Check all genomes are different
  const uniqueHashes = new Set(genomes.map(g => g.dna_hash));
  assert.equal(uniqueHashes.size, 100, 'All 100 genomes should be unique');

  // Check vector diversity - no clustering
  const culturalVectors = genomes.map(g => g.c0_cultural_vector);
  let totalDistance = 0;
  let comparisons = 0;

  for (let i = 0; i < culturalVectors.length; i++) {
    for (let j = i + 1; j < culturalVectors.length; j++) {
      totalDistance += vectorDistance(culturalVectors[i], culturalVectors[j]);
      comparisons++;
    }
  }

  const avgDistance = totalDistance / comparisons;
  console.log(`  Average cultural vector distance: ${avgDistance.toFixed(4)}`);
  console.log(`  (Expected ~1.0-1.5 for uniform distribution in 3D space)`);
  assert(avgDistance > 0.8, 'Vectors should be well-distributed, not clustered');
  
  console.log('✓ 100 unique genomes with good diversity\n');
}

// Test 3: Statistical Distribution
console.log('Test 3: Statistical Distribution');
{
  const genomes = [];
  for (let i = 0; i < 1000; i++) {
    genomes.push(generateCreatorGenome(`stats-test-${i}`));
  }

  // Check chaos tolerance distribution
  const chaosValues = genomes.map(g => g.c11_chaos_tolerance);
  const avgChaos = chaosValues.reduce((a, b) => a + b, 0) / chaosValues.length;
  console.log(`  Average chaos tolerance: ${avgChaos.toFixed(4)} (expected ~0.5)`);
  assert(inRange(avgChaos, 0.4, 0.6), 'Chaos should be centered around 0.5');

  // Check cross-pollination distribution
  const crossValues = genomes.map(g => g.c12_cross_pollination);
  const avgCross = crossValues.reduce((a, b) => a + b, 0) / crossValues.length;
  console.log(`  Average cross-pollination: ${avgCross.toFixed(4)} (expected ~0.5)`);
  assert(inRange(avgCross, 0.4, 0.6), 'Cross-pollination should be centered around 0.5');

  // Check vector ranges
  const allVectors = genomes.flatMap(g => [
    ...g.c0_cultural_vector,
    ...g.c3_formative_era,
    ...g.c4_authorial_embedding,
    ...g.c5_technical_spectrum,
    ...g.c6_aesthetic_sensibility,
    ...g.c7_cognitive_pattern,
    ...g.c8_social_vector,
    ...g.c9_material_affinity,
    ...g.c10_narrative_pattern,
    ...g.c13_temporal_sense,
  ]);

  const allInRange = allVectors.every(v => inRange(v, -1, 1));
  assert(allInRange, 'All vector values should be in [-1, 1]');
  console.log(`  Checked ${allVectors.length} vector values - all in range [-1, 1]`);
  
  console.log('✓ Statistical distribution valid\n');
}

// Test 4: Validation
console.log('Test 4: Genome Validation');
{
  const genome = generateCreatorGenome('validation-test');
  const errors = validateCreatorGenome(genome);
  
  if (errors.length > 0) {
    console.error('  Validation errors:', errors);
    assert.fail('Generated genome should pass validation');
  }
  
  console.log('✓ Generated genome passes validation\n');
}

// Test 5: Mutation
console.log('Test 5: Mutation');
{
  const original = generateCreatorGenome('mutation-original');
  const mutated = mutateGenome(original, 'mutation-seed', 0.3);

  // Should be different
  const vectorDiff = vectorDistance(original.c0_cultural_vector, mutated.c0_cultural_vector);
  console.log(`  Cultural vector change: ${vectorDiff.toFixed(4)}`);
  assert(vectorDiff > 0.1, 'Mutation should change the genome');
  assert(vectorDiff < 1.0, 'But not completely randomize it');

  // Should maintain valid ranges
  const errors = validateCreatorGenome(mutated);
  assert.equal(errors.length, 0, 'Mutated genome should be valid');
  
  console.log('✓ Mutation produces valid, different genome\n');
}

// Test 6: Crossover
console.log('Test 6: Crossover');
{
  const parentA = generateCreatorGenome('parent-a');
  const parentB = generateCreatorGenome('parent-b');
  const offspring = crossoverGenomes(parentA, parentB, 'offspring-seed');

  // Should blend characteristics
  const chaosBlend = offspring.c11_chaos_tolerance;
  const parentAvg = (parentA.c11_chaos_tolerance + parentB.c11_chaos_tolerance) / 2;
  console.log(`  Offspring chaos: ${chaosBlend.toFixed(4)} (parent avg: ${parentAvg.toFixed(4)})`);
  
  // Should be between parents (approximately)
  const chaosInRange = chaosBlend >= Math.min(parentA.c11_chaos_tolerance, parentB.c11_chaos_tolerance) - 0.2 &&
                       chaosBlend <= Math.max(parentA.c11_chaos_tolerance, parentB.c11_chaos_tolerance) + 0.2;
  assert(chaosInRange, 'Offspring should blend parent characteristics');

  const errors = validateCreatorGenome(offspring);
  assert.equal(errors.length, 0, 'Offspring genome should be valid');
  
  console.log('✓ Crossover produces valid blended genome\n');
}

// Test 7: No Obvious Archetypes
console.log('Test 7: Archetype Detection');
{
  // Generate many genomes and check for obvious clustering
  const genomes = [];
  for (let i = 0; i < 500; i++) {
    genomes.push(generateCreatorGenome(`archetype-test-${i}`));
  }

  // Check chaos tolerance isn't clustering at extremes
  const chaosBuckets = { low: 0, mid: 0, high: 0 };
  genomes.forEach(g => {
    if (g.c11_chaos_tolerance < 0.33) chaosBuckets.low++;
    else if (g.c11_chaos_tolerance < 0.66) chaosBuckets.mid++;
    else chaosBuckets.high++;
  });

  console.log(`  Chaos distribution: Low=${chaosBuckets.low}, Mid=${chaosBuckets.mid}, High=${chaosBuckets.high}`);
  
  // Should be roughly uniform (each ~33%)
  const total = genomes.length;
  const maxBucket = Math.max(chaosBuckets.low, chaosBuckets.mid, chaosBuckets.high);
  const minBucket = Math.min(chaosBuckets.low, chaosBuckets.mid, chaosBuckets.high);
  
  assert(maxBucket < total * 0.45, 'No single archetype should dominate');
  assert(minBucket > total * 0.20, 'All ranges should be represented');
  
  console.log('✓ No obvious archetype clustering detected\n');
}

// Test 8: Sample Genome Output
console.log('Test 8: Sample Genome Output');
{
  const genome = generateCreatorGenome('sample-for-inspection');
  
  console.log('  Sample Genome:');
  console.log(`    DNA Hash: ${genome.dna_hash}`);
  console.log(`    Cultural Vector: [${genome.c0_cultural_vector.map(v => v.toFixed(3)).join(', ')}]`);
  console.log(`    Formative Era: [${genome.c3_formative_era.map(v => v.toFixed(3)).join(', ')}]`);
  console.log(`    Authorial Voice: [${genome.c4_authorial_embedding.map(v => v.toFixed(3)).join(', ')}]`);
  console.log(`    Chaos Tolerance: ${genome.c11_chaos_tolerance.toFixed(3)}`);
  console.log(`    Cross-Pollination: ${genome.c12_cross_pollination.toFixed(3)}`);
  console.log(`    Coherence Style: ${genome.c15_coherence_style.toFixed(3)}`);
  console.log(`    Temporal Nostalgia Peaks: ${genome.c1_temporal_nostalgia.points.length}`);
  console.log(`    Sensory Weights: ${genome.c14_sensory_weights.points.map(p => p.weight.toFixed(2)).join(', ')}`);
  
  console.log('  ✓ Genome structure complete\n');
}

console.log('=== All L0 Creator Genome Tests Passed ===');

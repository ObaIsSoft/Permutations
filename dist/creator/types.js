/**
 * L0 CREATOR GENOME - The Foundation of Generative Design
 *
 * 16 chromosomes encoding latent space coordinates for infinite persona diversity.
 * Not categorical. Not indexed. Pure continuous values generating unique creators.
 */
/**
 * Validation: Check if genome is valid
 */
export function validateCreatorGenome(genome) {
    const errors = [];
    if (!genome.c0_cultural_vector || genome.c0_cultural_vector.length !== 3) {
        errors.push('c0_cultural_vector must be 3D vector');
    }
    if (!genome.c1_temporal_nostalgia || !genome.c1_temporal_nostalgia.points) {
        errors.push('c1_temporal_nostalgia must have distribution curve');
    }
    if (genome.c11_chaos_tolerance < 0 || genome.c11_chaos_tolerance > 1) {
        errors.push('c11_chaos_tolerance must be 0-1');
    }
    if (genome.c12_cross_pollination < 0 || genome.c12_cross_pollination > 1) {
        errors.push('c12_cross_pollination must be 0-1');
    }
    return errors;
}

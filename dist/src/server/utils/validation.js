/**
 * Genome Validation Utilities (FIX 9: Modularized from server.ts)
 */
import { ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
/**
 * Validates that a genome object has all required fields
 */
export function validateGenome(genome, context) {
    if (!genome) {
        throw new McpError(ErrorCode.InvalidParams, `${context}: Missing genome object`);
    }
    if (!genome.chromosomes) {
        throw new McpError(ErrorCode.InvalidParams, `${context}: Genome missing 'chromosomes' field. Ensure you pass the complete genome object from generate_design_genome, not just dnaHash/traits.`);
    }
    if (!genome.sectorContext) {
        throw new McpError(ErrorCode.InvalidParams, `${context}: Genome missing 'sectorContext' field. Ensure you pass the complete genome object from generate_design_genome.`);
    }
    if (!genome.dnaHash) {
        throw new McpError(ErrorCode.InvalidParams, `${context}: Genome missing 'dnaHash' field.`);
    }
}
/**
 * Validates that ecosystem output has required structure
 */
export function validateEcosystemOutput(eco, context) {
    if (!eco) {
        throw new McpError(ErrorCode.InvalidParams, `${context}: Missing ecosystem output`);
    }
    if (!eco.environment?.genome) {
        throw new McpError(ErrorCode.InvalidParams, `${context}: Ecosystem missing environment.genome. Pass the complete ecosystem output from generate_ecosystem.`);
    }
    if (!eco.organisms) {
        throw new McpError(ErrorCode.InvalidParams, `${context}: Ecosystem missing organisms. Pass the complete ecosystem output from generate_ecosystem.`);
    }
}

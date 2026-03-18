/**
 * Epigenetic Brief Generator
 *
 * Decodes L0 Creator Genome latent coordinates into creative personas and briefs.
 * Uses LLM (Groq/Gemini/OpenAI) when available, falls back to deterministic generation.
 */
import { SemanticTraitExtractor } from '../semantic/extractor.js';
// Cache for LLM extractor (lazy init)
let llmExtractor = null;
let llmAvailable = true;
function getLLM() {
    if (!llmAvailable)
        return null;
    if (!llmExtractor) {
        try {
            llmExtractor = new SemanticTraitExtractor();
        }
        catch (e) {
            console.log('LLM not available, using deterministic generation');
            llmAvailable = false;
            return null;
        }
    }
    return llmExtractor;
}
/**
 * Decode latent space coordinates into semantic hints
 */
export function decodeLatentSpace(genome) {
    return {
        cultural_hint: decodeCulturalVector(genome.c0_cultural_vector),
        temporal_hints: decodeTemporalNostalgia(genome.c1_temporal_nostalgia),
        aesthetic_hint: decodeAestheticSensibility(genome.c6_aesthetic_sensibility),
        cognitive_hint: decodeCognitivePattern(genome.c7_cognitive_pattern),
        social_hint: decodeSocialVector(genome.c8_social_vector),
        material_hint: decodeMaterialAffinity(genome.c9_material_affinity),
        narrative_hint: decodeNarrativePattern(genome.c10_narrative_pattern, genome.c4_authorial_embedding),
        sensory_weights: decodeSensoryWeights(genome.c14_sensory_weights),
    };
}
/**
 * Generate persona from genome
 * Uses LLM when available, falls back to deterministic generation
 */
export async function generatePersona(genome) {
    const llm = getLLM();
    if (llm) {
        try {
            return await generatePersonaWithLLM(genome, llm);
        }
        catch (e) {
            console.log('LLM persona generation failed, using fallback:', e);
        }
    }
    return generatePersonaDeterministic(genome);
}
/**
 * Generate creative brief from persona and intent
 */
export async function generateBrief(persona, intent) {
    const llm = getLLM();
    if (llm) {
        try {
            return await generateBriefWithLLM(persona, intent, llm);
        }
        catch (e) {
            console.log('LLM brief generation failed, using fallback:', e);
        }
    }
    return generateBriefDeterministic(persona, intent);
}
// ===== LLM GENERATION =====
async function generatePersonaWithLLM(genome, llm) {
    const interp = decodeLatentSpace(genome);
    const prompt = `Generate a fictional designer persona with these specific latent characteristics:

CULTURAL BACKGROUND: ${interp.cultural_hint}
TEMPORAL NOSTALGIA: ${interp.temporal_hints.join(', ')}
AESTHETIC SENSIBILITY: ${interp.aesthetic_hint}
COGNITIVE STYLE: ${interp.cognitive_hint}
SOCIAL POSITIONING: ${interp.social_hint}
MATERIAL PREFERENCE: ${interp.material_hint}
NARRATIVE INSTINCT: ${interp.narrative_hint}
SENSORY PRIORITIES: ${JSON.stringify(interp.sensory_weights)}

CHAOS TOLERANCE: ${genome.c11_chaos_tolerance.toFixed(2)} (0=strict, 1=chaotic)
CROSS-POLLINATION: ${genome.c12_cross_pollination.toFixed(2)} (0=focused, 1=eclectic)
COHERENCE STYLE: ${genome.c15_coherence_style > 0.6 ? 'integrated' : genome.c15_coherence_style > 0.3 ? 'contradictory' : 'fragmented'}

Generate a detailed persona. Make them feel like a real person with specific quirks, not an archetype. Include surprising details.

Return ONLY valid JSON:
{
  "biography": {
    "origin": "specific geographic/cultural background",
    "formative_years": "youth influences and pivots",
    "journey": "career/life path",
    "current": "present context",
    "contradictions": ["2-3 internal tensions"]
  },
  "instincts": {
    "visual_language": ["3-4 descriptive phrases"],
    "interaction_metaphors": ["2-3 metaphors"],
    "aesthetic_principles": ["2-3 principles"],
    "copy_voice": "how they write"
  },
  "worldview": {
    "core_metaphor": "how they see the world",
    "design_philosophy": "their stance on design",
    "unusual_connections": ["2-3 unexpected domain bridges"],
    "blind_spots": ["1-2 things they miss"]
  }
}`;
    const response = await llm.callText(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('No JSON in LLM response');
    }
    const parsed = JSON.parse(jsonMatch[0]);
    return {
        id: genome.dna_hash,
        biography: parsed.biography,
        instincts: parsed.instincts,
        worldview: parsed.worldview,
        creative_behavior: {
            chaos_tolerance: genome.c11_chaos_tolerance,
            cross_pollination: genome.c12_cross_pollination,
            coherence_style: genome.c15_coherence_style > 0.6 ? 'integrated' :
                genome.c15_coherence_style > 0.3 ? 'contradictory' : 'fragmented',
        },
        genome,
    };
}
async function generateBriefWithLLM(persona, intent, llm) {
    const prompt = `You are a designer with this background: ${persona.biography.origin}

Your design philosophy: ${persona.worldview.design_philosophy}
You see the world as: ${persona.worldview.core_metaphor}
You write in a ${persona.instincts.copy_voice} voice.
Your visual language: ${persona.instincts.visual_language.join(', ')}

CHAOS TOLERANCE: ${persona.creative_behavior.chaos_tolerance.toFixed(2)}
CROSS-POLLINATION: ${persona.creative_behavior.cross_pollination.toFixed(2)}

A client comes to you with: "${intent.description}"
${intent.sector ? `Sector: ${intent.sector}` : ''}
${intent.audience ? `Audience: ${intent.audience}` : ''}

As this persona, generate a creative brief. Return ONLY valid JSON:
{
  "concept": {
    "statement": "What if...",
    "insight": "The creative insight",
    "tension": "Productive friction"
  },
  "metaphor_system": {
    "primary": "main metaphor",
    "secondary": "counterpoint metaphor",
    ${persona.creative_behavior.chaos_tolerance > 0.6 ? '"tertiary": "unexpected disruption",' : ''}
    "tension_description": "how they interact"
  },
  "design_principles": ["3-4 principles"],
  "component_language": {
    "buttons": "how buttons work",
    "navigation": "how navigation works",
    "forms": "how forms work",
    "cards": "how cards work",
    "feedback": "success/error states"
  },
  "sensory_design": {
    "visual_approach": "...",
    "motion_philosophy": "...",
    "texture_strategy": "...",
    "sound_feel": "..."
  },
  "copy_system": {
    "voice_description": "...",
    "vocabulary_tendencies": ["..."],
    "sentence_patterns": ["..."],
    "microcopy_examples": {
      "submit": "...",
      "cancel": "...",
      "loading": "...",
      "success": "...",
      "error": "..."
    }
  }
}`;
    const response = await llm.callText(prompt);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('No JSON in LLM response');
    }
    const parsed = JSON.parse(jsonMatch[0]);
    return {
        id: `${persona.id}:BRIEF:${Date.now()}`,
        concept: parsed.concept,
        metaphor_system: parsed.metaphor_system,
        design_principles: parsed.design_principles,
        component_language: parsed.component_language,
        sensory_design: parsed.sensory_design,
        copy_system: parsed.copy_system,
        generated_by: persona,
        generation_metadata: {
            timestamp: Date.now(),
            intent,
            mutation_applied: persona.creative_behavior.chaos_tolerance > 0.6,
            cross_pollination_applied: persona.creative_behavior.cross_pollination > 0.6,
        },
    };
}
// ===== DETERMINISTIC FALLBACKS =====
function generatePersonaDeterministic(genome) {
    const interp = decodeLatentSpace(genome);
    // Generate diverse origin based on cultural vector
    const originPrefixes = [
        'Raised in a household where', 'Grew up between', 'Born into',
        'Childhood spent navigating', 'Formative years in'
    ];
    const originSuffixes = [
        'tradition collided with innovation',
        'craft and commerce intertwined',
        'landscape shaped creative instincts',
        'cultural currents ran deep',
        'old techniques met new technologies'
    ];
    const originIndex = Math.abs(hashFromString(genome.dna_hash + 'origin')) % originPrefixes.length;
    const suffixIndex = Math.abs(hashFromString(genome.dna_hash + 'suffix')) % originSuffixes.length;
    const origin = `${originPrefixes[originIndex]} ${interp.cultural_hint}, where ${originSuffixes[suffixIndex]}`;
    // Formative years from temporal nostalgia
    const formative_years = `Adolescence marked by ${interp.temporal_hints[0]} aesthetics, absorbing ${interp.temporal_hints[1] || 'timeless'} principles while navigating ${interp.narrative_hint.split(' ')[0]} narratives`;
    // Journey based on cognitive pattern
    const journey = `Career arc shaped by ${interp.cognitive_hint} thinking, moving through ${interp.social_hint} spaces while exploring ${interp.material_hint} territories`;
    // Current context
    const current = `Now operates from a position where ${interp.aesthetic_hint} sensibilities meet ${interp.social_hint} positioning`;
    // Contradictions based on coherence style and genome
    const contradictions = [];
    if (genome.c15_coherence_style < 0.5) {
        contradictions.push(`Drawn to ${interp.aesthetic_hint} but practices ${interp.cognitive_hint}`);
    }
    if (genome.c12_cross_pollination > 0.6) {
        contradictions.push(`Seeks depth in ${interp.temporal_hints[0]} while chasing the new`);
    }
    if (genome.c8_social_vector[0] > 0) {
        contradictions.push(`${interp.social_hint} posture masks insider ambitions`);
    }
    if (contradictions.length === 0) {
        contradictions.push(`Values ${interp.aesthetic_hint} yet prioritizes function`);
    }
    // Visual language from aesthetic + material
    const visual_language = [
        interp.aesthetic_hint,
        interp.material_hint,
        `${interp.temporal_hints[0]} palettes`,
        interp.sensory_weights.visual > 0.5 ? 'visually-driven compositions' : 'textural emphasis'
    ];
    // Copy voice from narrative pattern
    const voiceTypes = ['technical precision', 'poetic resonance', 'conversational warmth', 'academic rigor', 'irreverent wit'];
    const voiceIndex = Math.abs(hashFromString(genome.dna_hash + 'voice')) % voiceTypes.length;
    const copy_voice = voiceTypes[voiceIndex];
    // Metaphors from narrative + cognitive
    const metaphors = [
        `${interp.narrative_hint.split(' ')[0]} journeys`,
        `${interp.cognitive_hint} navigation`,
        `${interp.material_hint} constructions`
    ];
    // Principles from aesthetic + temporal
    const aestheticPrinciples = [
        `Honor ${interp.temporal_hints[0]} through ${interp.aesthetic_hint} forms`,
        `Balance ${interp.material_hint} with functional clarity`,
        `Let ${interp.narrative_hint.split(' ')[0]} guide structure`
    ];
    // Worldview
    const coreMetaphors = [
        `${interp.temporal_hints[0]} viewed through ${interp.aesthetic_hint}`,
        `${interp.material_hint} as ${interp.narrative_hint}`,
        `${interp.cognitive_hint} understanding of ${interp.social_hint} position`
    ];
    const metaphorIndex = Math.abs(hashFromString(genome.dna_hash + 'metaphor')) % coreMetaphors.length;
    const philosophies = [
        `${interp.aesthetic_hint} design honoring ${interp.temporal_hints[0]}`,
        `${interp.cognitive_hint} approach to ${interp.material_hint} problems`,
        `${interp.social_hint} perspective on ${interp.narrative_hint.split(' ')[0]} storytelling`
    ];
    const philIndex = Math.abs(hashFromString(genome.dna_hash + 'phil')) % philosophies.length;
    // Unusual connections from cross-pollination
    const unusual_connections = [];
    if (genome.c12_cross_pollination > 0.4) {
        unusual_connections.push(`${interp.temporal_hints[0]} ${interp.material_hint} synthesis`);
    }
    if (genome.c12_cross_pollination > 0.6) {
        unusual_connections.push(`${interp.narrative_hint.split(' ')[0]} ${interp.cognitive_hint.split('/')[0]} systems`);
    }
    if (genome.c12_cross_pollination > 0.8) {
        unusual_connections.push(`${interp.aesthetic_hint.split(',')[0]} ${interp.social_hint.split('/')[0]} aesthetics`);
    }
    // Blind spots
    const blind_spots = [
        `May underestimate mainstream ${interp.social_hint.split('/')[0]} appeal`,
        `Sometimes overlooks ${interp.temporal_hints[0]} constraints`
    ];
    return {
        id: genome.dna_hash,
        biography: {
            origin,
            formative_years,
            journey,
            current,
            contradictions,
        },
        instincts: {
            visual_language,
            interaction_metaphors: metaphors,
            aesthetic_principles: aestheticPrinciples,
            copy_voice,
        },
        worldview: {
            core_metaphor: coreMetaphors[metaphorIndex],
            design_philosophy: philosophies[philIndex],
            unusual_connections,
            blind_spots,
        },
        creative_behavior: {
            chaos_tolerance: genome.c11_chaos_tolerance,
            cross_pollination: genome.c12_cross_pollination,
            coherence_style: genome.c15_coherence_style > 0.6 ? 'integrated' :
                genome.c15_coherence_style > 0.3 ? 'contradictory' : 'fragmented',
        },
        genome,
    };
}
function generateBriefDeterministic(persona, intent) {
    const isPhoto = intent.sector === 'photography' || intent.description.toLowerCase().includes('photographer');
    const isFintech = intent.sector === 'fintech' || intent.description.toLowerCase().includes('dashboard');
    const isEcommerce = intent.description.toLowerCase().includes('e-commerce') || intent.description.toLowerCase().includes('shop');
    const isTravel = intent.description.toLowerCase().includes('travel');
    const isMusic = intent.description.toLowerCase().includes('music') || intent.description.toLowerCase().includes('streaming');
    // Concept based on intent type and persona
    let concept;
    if (isPhoto) {
        concept = {
            statement: `What if a photographer's portfolio felt like ${persona.worldview.core_metaphor.split(' ')[0]}?`,
            insight: `Images reveal themselves through ${persona.instincts.aesthetic_principles[0].split(' ')[0]} interaction`,
            tension: `Professional polish meets ${persona.biography.contradictions[0].split(' ')[0]} rawness`
        };
    }
    else if (isFintech) {
        concept = {
            statement: `What if ${intent.description} felt like ${persona.worldview.core_metaphor.split(' ')[0]}?`,
            insight: `Data becomes navigable through ${persona.instincts.aesthetic_principles[0].split(' ')[0]} structures`,
            tension: `Urgency balanced with ${persona.biography.contradictions[0].split(' ').slice(-1)[0]} deliberation`
        };
    }
    else if (isEcommerce) {
        concept = {
            statement: `What if shopping felt like ${persona.worldview.core_metaphor.split(' ')[0]}?`,
            insight: `Products are discovered through ${persona.instincts.aesthetic_principles[0].split(' ')[0]} journeys`,
            tension: `Commerce meets ${persona.biography.contradictions[0].split(' ')[0]} sentiment`
        };
    }
    else if (isTravel) {
        concept = {
            statement: `What if booking travel felt like ${persona.worldview.core_metaphor.split(' ')[0]}?`,
            insight: `Destinations emerge through ${persona.instincts.aesthetic_principles[0].split(' ')[0]} exploration`,
            tension: `Adventure and ${persona.biography.contradictions[0].split(' ').slice(-1)[0]} comfort`
        };
    }
    else if (isMusic) {
        concept = {
            statement: `What if music discovery felt like ${persona.worldview.core_metaphor.split(' ')[0]}?`,
            insight: `Songs connect through ${persona.instincts.aesthetic_principles[0].split(' ')[0]} pathways`,
            tension: `Algorithmic precision and ${persona.biography.contradictions[0].split(' ')[0]} serendipity`
        };
    }
    else {
        concept = {
            statement: `What if ${intent.description} felt like ${persona.worldview.core_metaphor.split(' ')[0]}?`,
            insight: `Experience unfolds through ${persona.instincts.aesthetic_principles[0].split(' ')[0]} moments`,
            tension: `Familiar expectations meet ${persona.biography.contradictions[0].split(' ').slice(-1)[0]} surprises`
        };
    }
    // Metaphor system
    const metaphor_system = {
        primary: persona.worldview.core_metaphor.split(' ')[0] + ' ' + (isPhoto ? 'darkroom' : isFintech ? 'navigation' : isEcommerce ? 'gallery' : 'journey'),
        secondary: persona.instincts.aesthetic_principles[0].split(' ').slice(0, 2).join(' ') + ' ' + (isPhoto ? 'exhibition' : isFintech ? 'archive' : isEcommerce ? 'studio' : 'map'),
        tension_description: `${persona.biography.contradictions[0].split(' ')[0]} meets ${persona.instincts.aesthetic_principles[0].split(' ')[0]} in productive friction`
    };
    // Tertiary metaphor for high chaos
    if (persona.creative_behavior.chaos_tolerance > 0.6) {
        metaphor_system.tertiary = persona.instincts.interaction_metaphors[0] + ' ' + (isPhoto ? 'archive' : 'construct');
    }
    // Design principles
    const design_principles = [
        persona.instincts.aesthetic_principles[0],
        `Honor ${persona.biography.formative_years.split(' ')[0]} through intentional moments`,
        `Balance ${persona.biography.contradictions[0].split(' ')[0]} with clarity`,
        `Let ${persona.instincts.interaction_metaphors[0]} guide the experience`
    ];
    // Component language
    const component_language = {
        buttons: `${persona.instincts.visual_language[0]} controls that feel like ${persona.instincts.interaction_metaphors[0]}`,
        navigation: `Structured as ${persona.worldview.core_metaphor.split(' ')[0]} pathways`,
        forms: `Input moments that ${persona.instincts.aesthetic_principles[0].split(' ')[0]} user attention`,
        cards: `Content containers with ${persona.instincts.visual_language[1]} surfaces`,
        feedback: `Responses that feel ${persona.instincts.copy_voice} and ${persona.instincts.visual_language[0]}`
    };
    // Sensory design
    const sensory_design = {
        visual_approach: persona.instincts.visual_language.join(', '),
        motion_philosophy: `Movement that echoes ${persona.instincts.interaction_metaphors[0]}`,
        texture_strategy: `Surfaces with ${persona.instincts.visual_language[1]} qualities`,
        sound_feel: `Silent as ${persona.worldview.core_metaphor.split(' ')[0]}`
    };
    // Copy system
    const submitPhrases = {
        'technical precision': 'Commit',
        'poetic resonance': 'Seal the pact',
        'conversational warmth': "Let's do this",
        'academic rigor': 'Submit',
        'irreverent wit': 'Make it so'
    };
    const cancelPhrases = {
        'technical precision': 'Abort',
        'poetic resonance': 'Retreat gracefully',
        'conversational warmth': 'Never mind',
        'academic rigor': 'Cancel',
        'irreverent wit': 'Nope out'
    };
    const copy_system = {
        voice_description: persona.instincts.copy_voice,
        vocabulary_tendencies: [
            `${persona.instincts.copy_voice} terms`,
            `${persona.biography.formative_years.split(' ')[0]} references`,
            `${persona.instincts.aesthetic_principles[0].split(' ')[0]} language`
        ],
        sentence_patterns: [
            `${persona.instincts.copy_voice.split(' ')[0]} constructions`,
            `${persona.biography.contradictions[0].split(' ')[0]} phrasing`
        ],
        microcopy_examples: {
            submit: submitPhrases[persona.instincts.copy_voice] || 'Submit',
            cancel: cancelPhrases[persona.instincts.copy_voice] || 'Cancel',
            loading: `Entering ${persona.worldview.core_metaphor.split(' ')[0]}...`,
            success: `${persona.instincts.aesthetic_principles[0].split(' ')[0]} accomplished`,
            error: `${persona.biography.contradictions[0].split(' ')[0]} encountered`
        }
    };
    return {
        id: `${persona.id}:BRIEF:${Date.now()}`,
        concept,
        metaphor_system,
        design_principles,
        component_language,
        sensory_design,
        copy_system,
        generated_by: persona,
        generation_metadata: {
            timestamp: Date.now(),
            intent,
            mutation_applied: persona.creative_behavior.chaos_tolerance > 0.6,
            cross_pollination_applied: persona.creative_behavior.cross_pollination > 0.6,
        },
    };
}
// ===== LATENT DECODERS =====
function decodeCulturalVector(vec) {
    const [x, y, z] = vec;
    const regions = [];
    if (x > 0.3)
        regions.push("Mediterranean/European");
    else if (x < -0.3)
        regions.push("East Asian/Pacific");
    else
        regions.push("Transitional/Mixed");
    if (y > 0.3)
        regions.push("post-industrial urban");
    else if (y < -0.3)
        regions.push("traditional/agrarian roots");
    else
        regions.push("suburban/small-city");
    if (z > 0.3)
        regions.push("globalized/cosmopolitan");
    else if (z < -0.3)
        regions.push("regional/local identity");
    else
        regions.push("balanced exposure");
    return regions.join(', ');
}
function decodeTemporalNostalgia(curve) {
    return curve.points.slice(0, 3).map(p => {
        const year = 1900 + p.position * 130;
        const intensity = p.weight > 0.7 ? 'strong' : p.weight > 0.4 ? 'moderate' : 'subtle';
        if (year < 1940)
            return `${intensity} early-20th-century`;
        if (year < 1970)
            return `${intensity} mid-century`;
        if (year < 1990)
            return `${intensity} late-20th-century`;
        if (year < 2005)
            return `${intensity} early-digital era`;
        return `${intensity} contemporary`;
    });
}
function decodeAestheticSensibility(vec) {
    const [a1, a2, a3] = vec;
    const prefs = [];
    if (a1 > 0.3)
        prefs.push("minimal");
    else if (a1 < -0.3)
        prefs.push("maximal");
    if (a2 > 0.3)
        prefs.push("precise");
    else if (a2 < -0.3)
        prefs.push("organic");
    if (a3 > 0.3)
        prefs.push("clean");
    else if (a3 < -0.3)
        prefs.push("textured");
    return prefs.length > 0 ? prefs.join(', ') : 'eclectic';
}
function decodeCognitivePattern(vec) {
    const [c1, c2, c3] = vec;
    const patterns = [];
    if (c1 > 0.3)
        patterns.push("systematic");
    else if (c1 < -0.3)
        patterns.push("intuitive");
    if (c2 > 0.3)
        patterns.push("abstract");
    else if (c2 < -0.3)
        patterns.push("concrete");
    if (c3 > 0.3)
        patterns.push("analytical");
    else if (c3 < -0.3)
        patterns.push("holistic");
    return patterns.length > 0 ? patterns.join('/') : 'balanced';
}
function decodeSocialVector(vec) {
    const [s1, s2] = vec;
    const positions = [];
    if (s1 > 0.3)
        positions.push("outsider");
    else if (s1 < -0.3)
        positions.push("insider");
    if (s2 > 0.3)
        positions.push("rebel");
    else if (s2 < -0.3)
        positions.push("traditional");
    return positions.length > 0 ? positions.join('/') : 'observer';
}
function decodeMaterialAffinity(vec) {
    const [m1, m2, m3] = vec;
    const materials = [];
    if (m1 > 0.3)
        materials.push("digital");
    else if (m1 < -0.3)
        materials.push("analog");
    if (m2 > 0.3)
        materials.push("polished");
    else if (m2 < -0.3)
        materials.push("rough");
    if (m3 > 0.3)
        materials.push("synthetic");
    else if (m3 < -0.3)
        materials.push("natural");
    return materials.length > 0 ? materials.join(', ') : 'material-agnostic';
}
function decodeNarrativePattern(vec, authorial) {
    const [n1] = vec;
    const [a1, a2] = authorial;
    const patterns = [];
    if (n1 > 0.3)
        patterns.push("hero-journey");
    else if (n1 < -0.3)
        patterns.push("fragmented");
    else
        patterns.push("processual");
    const voices = [];
    if (a1 > 0.3)
        voices.push("technical");
    else if (a1 < -0.3)
        voices.push("poetic");
    if (a2 > 0.3)
        voices.push("direct");
    else if (a2 < -0.3)
        voices.push("allusive");
    return `${patterns.join(' ')} ${voices.length > 0 ? 'with ' + voices.join('/') + ' voice' : ''}`;
}
function decodeSensoryWeights(curve) {
    const senses = ['visual', 'tactile', 'auditory', 'spatial', 'kinesthetic'];
    const weights = {};
    curve.points.forEach((p, i) => {
        weights[senses[i] || `sense_${i}`] = p.weight;
    });
    return weights;
}
// Simple hash function for deterministic generation
function hashFromString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
// Export class for advanced usage
export { EpigeneticGenerator };
/**
 * Epigenetic Generator class for advanced usage with cached LLM
 */
class EpigeneticGenerator {
    extractor = null;
    constructor() {
        try {
            this.extractor = new SemanticTraitExtractor();
        }
        catch (e) {
            // LLM not available, use deterministic
        }
    }
    async generatePersona(genome) {
        if (this.extractor) {
            try {
                return await generatePersonaWithLLM(genome, this.extractor);
            }
            catch (e) {
                // Fall through to deterministic
            }
        }
        return generatePersonaDeterministic(genome);
    }
    async generateBrief(persona, intent) {
        if (this.extractor) {
            try {
                return await generateBriefWithLLM(persona, intent, this.extractor);
            }
            catch (e) {
                // Fall through to deterministic
            }
        }
        return generateBriefDeterministic(persona, intent);
    }
}

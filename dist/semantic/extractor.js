import OpenAI from "openai";
export class SemanticTraitExtractor {
    openai;
    constructor(apiKey) {
        this.openai = new OpenAI({
            apiKey: apiKey || process.env.OPENAI_API_KEY,
        });
    }
    async extractTraits(intent) {
        const prompt = `
You are a Semantic Trait Extractor for a parametric design system.
Analyze the following design intent and project description, then map it to five continuous trait vectors between 0.0 and 1.0.

Traits:
1. informationDensity: 0.1 (sparse, luxurious, minimal) to 0.9 (chaotic, data-heavy, dashboard)
2. temporalUrgency: 0.1 (timeless, archival, deep reading) to 0.9 (real-time, scanning, high-frequency)
3. emotionalTemperature: 0.1 (clinical, technical, brutalist) to 0.9 (warm, humanist, empathetic)
4. playfulness: 0.1 (strict, rigid, enterprise) to 0.9 (organic, whimsical, experimental)
5. spatialDependency: 0.1 (flat, Cartesian CSS, text-heavy) to 0.9 (immersive, WebGL, 3D particles, z-depth)

Intent: "${intent}"

Respond ONLY with a valid JSON object matching this exact shape:
{
  "informationDensity": 0.5,
  "temporalUrgency": 0.5,
  "emotionalTemperature": 0.5,
  "playfulness": 0.5,
  "spatialDependency": 0.5
}
    `;
        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.2,
            });
            const result = JSON.parse(response.choices[0].message.content || "{}");
            return {
                informationDensity: result.informationDensity ?? 0.5,
                temporalUrgency: result.temporalUrgency ?? 0.5,
                emotionalTemperature: result.emotionalTemperature ?? 0.5,
                playfulness: result.playfulness ?? 0.5,
                spatialDependency: result.spatialDependency ?? 0.5,
            };
        }
        catch (e) {
            console.error("Trait extraction failed, falling back to neutral traits", e);
            return {
                informationDensity: 0.5,
                temporalUrgency: 0.5,
                emotionalTemperature: 0.5,
                playfulness: 0.5,
                spatialDependency: 0.5,
            };
        }
    }
}

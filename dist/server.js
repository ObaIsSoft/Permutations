import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError } from "@modelcontextprotocol/sdk/types.js";
import { SemanticTraitExtractor } from "./semantic/extractor.js";
import { GenomeSequencer } from "./genome/sequencer.js";
import { CSSGenerator } from "./generators/css-generator.js";
import { HTMLTopologyGenerator } from "./generators/html-topology.js";
import { WebGLGenerator } from "./generators/webgl-generator.js";
import { FXGenerator } from "./generators/fx-generator.js";
import { SVGGenerator } from "./generators/svg-generator.js";
class DesignGenomeServer {
    server;
    extractor;
    sequencer;
    cssGen;
    htmlGen;
    webglGen;
    fxGen;
    svgGen;
    constructor() {
        this.server = new Server({ name: "permutations", version: "1.0.0" }, { capabilities: { tools: {} } });
        this.extractor = new SemanticTraitExtractor();
        this.sequencer = new GenomeSequencer();
        this.cssGen = new CSSGenerator();
        this.htmlGen = new HTMLTopologyGenerator();
        this.webglGen = new WebGLGenerator();
        this.fxGen = new FXGenerator();
        this.svgGen = new SVGGenerator();
        this.setupHandlers();
    }
    setupHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "generate_design_genome",
                    description: "Calculates the mathematical design DNA constraints from a fuzzy user prompt",
                    inputSchema: {
                        type: "object",
                        properties: {
                            intent: { type: "string", description: "Natural language design intent (e.g., 'Japanese Y2K football site')" },
                            seed: { type: "string", description: "Unique project seed or timestamp to ensure specific DNA generation" }
                        },
                        required: ["intent", "seed"]
                    }
                }
            ]
        }));
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            if (request.params.name !== "generate_design_genome") {
                throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
            }
            const args = request.params.arguments;
            if (!args.intent || !args.seed) {
                throw new McpError(ErrorCode.InvalidParams, "Missing intent or seed");
            }
            try {
                const traits = await this.extractor.extractTraits(args.intent);
                const genome = this.sequencer.generate(args.seed, traits);
                const tailwindConfig = this.cssGen.generate(genome, "tailwind");
                const topology = this.htmlGen.generateTopology(genome);
                const webglComponents = this.webglGen.generateR3F(genome);
                const fxAtmosphere = this.fxGen.generateCSSClass(genome);
                const svgBiomarker = this.svgGen.generateBiomarker(genome);
                return {
                    content: [
                        {
                            type: "text",
                            text: JSON.stringify({ genome, topology, tailwindConfig, webglComponents, fxAtmosphere, svgBiomarker }, null, 2)
                        }
                    ]
                };
            }
            catch (error) {
                return {
                    content: [{ type: "text", text: `Error: ${error.message}` }],
                    isError: true
                };
            }
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("Permutations MCP server running on stdio");
    }
}
const server = new DesignGenomeServer();
server.run().catch(console.error);

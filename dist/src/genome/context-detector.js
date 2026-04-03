/**
 * Context Detector
 *
 * Analyzes design intent + genome to determine what the page IS —
 * its content type, purpose, audience, and structural requirements.
 *
 * This drives which structural patterns from the catalog are eligible
 * vs forbidden. A shoe store needs different patterns than a fintech dashboard.
 *
 * Philosophy: context is detected from intent keywords + sector + genome traits.
 * NOT hardcoded — the detector uses keyword matching and sector mapping.
 */
const CONTEXT_RULES = {
    ecommerce: {
        requiredSections: ["navigation", "hero", "product", "cta", "footer"],
        optionalSections: ["feature", "testimonial", "faq", "pricing", "blog", "newsletter", "trust", "social", "stats", "logo_wall"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "onboarding", "wizard"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["shopper", "consumer"],
        keywords: ["shoe store", "shoe shop", "shoe ecommerce", "online store", "product store", "shop", "buy", "product", "cart", "checkout", "order", "shopify", "woocommerce", "sell", "marketplace", "catalog", "clothing store", "fashion store", "retail"],
    },
    dashboard: {
        requiredSections: ["navigation", "data", "metrics", "chart"],
        optionalSections: ["table", "activity_feed", "cta", "notification", "filter", "search", "status_bar", "toolbar"],
        forbiddenSections: ["hero", "testimonial", "cta_focused", "newsletter", "pricing"],
        purposes: ["monitoring", "management", "exploration"],
        audiences: ["analyst", "admin", "manager", "enterprise"],
        keywords: ["analytics dashboard", "fintech dashboard", "finance dashboard", "trading dashboard", "banking dashboard", "dashboard", "metrics", "kpi", "monitor", "admin panel", "control panel", "report", "data", "chart", "graph", "stats", "overview"],
    },
    landing: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["testimonial", "faq", "pricing", "team", "stats", "logo_wall", "blog", "newsletter", "trust", "social", "process", "timeline"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "onboarding", "wizard"],
        purposes: ["conversion", "exploration"],
        audiences: ["consumer", "shopper", "general", "professional"],
        keywords: ["landing page", "landing", "homepage", "home", "intro", "welcome", "signup", "get started", "learn more", "hero", "marketing", "campaign", "launch"],
    },
    blog: {
        requiredSections: ["navigation", "content", "footer"],
        optionalSections: ["cta", "newsletter", "social", "testimonial", "about", "author_box", "search", "pagination", "breadcrumb"],
        forbiddenSections: ["product", "metrics", "chart", "pricing", "hero"],
        purposes: ["exploration", "education", "reference"],
        audiences: ["reader", "student", "general", "professional"],
        keywords: ["tech blog", "blog", "article", "post", "news", "journal", "writing", "content", "read", "story", "magazine", "publication", "editorial"],
    },
    portfolio: {
        requiredSections: ["hero", "gallery", "content", "footer"],
        optionalSections: ["testimonial", "cta", "about", "team", "contact", "timeline", "process", "stats", "blog"],
        forbiddenSections: ["product", "metrics", "chart", "pricing", "table", "activity_feed"],
        purposes: ["exploration", "conversion"],
        audiences: ["creator", "professional", "general"],
        keywords: ["portfolio", "work", "projects", "showcase", "gallery", "design", "creative", "photography", "art", "case study", "freelance"],
    },
    documentation: {
        requiredSections: ["navigation", "content", "footer"],
        optionalSections: ["search", "breadcrumb", "toc", "faq", "alert", "banner"],
        forbiddenSections: ["hero", "product", "cta", "testimonial", "pricing", "metrics", "chart"],
        purposes: ["reference", "education"],
        audiences: ["developer", "student", "professional", "general"],
        keywords: ["docs", "documentation", "api", "guide", "tutorial", "reference", "manual", "help", "wiki", "knowledge base", "how to"],
    },
    application: {
        requiredSections: ["navigation", "content"],
        optionalSections: ["sidebar", "toolbar", "status_bar", "notification", "modal", "dialog", "form", "search", "filter", "table", "chart"],
        forbiddenSections: ["hero", "testimonial", "cta", "pricing", "newsletter", "blog"],
        purposes: ["management", "creation", "communication"],
        audiences: ["admin", "manager", "professional", "enterprise"],
        keywords: ["app", "application", "tool", "platform", "software", "workspace", "editor", "builder", "manager", "system"],
    },
    saas: {
        requiredSections: ["hero", "feature", "cta", "pricing", "footer"],
        optionalSections: ["testimonial", "faq", "stats", "logo_wall", "team", "blog", "newsletter", "comparison", "trust", "social", "process", "timeline"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "onboarding", "wizard"],
        purposes: ["conversion", "exploration"],
        audiences: ["professional", "enterprise", "consumer"],
        keywords: ["saas platform", "saas product", "saas solution", "saas tool", "software as a service", "cloud platform", "cloud service", "subscription software"],
    },
    agency: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["testimonial", "portfolio", "team", "process", "stats", "logo_wall", "blog", "contact", "case_study", "service"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "onboarding"],
        purposes: ["conversion", "exploration"],
        audiences: ["professional", "enterprise", "consumer"],
        keywords: ["agency", "studio", "consulting", "services", "firm", "company", "team", "expertise", "portfolio"],
    },
    creative: {
        requiredSections: ["hero", "gallery", "content", "footer"],
        optionalSections: ["about", "contact", "testimonial", "process", "team", "blog", "cta"],
        forbiddenSections: ["metrics", "chart", "table", "pricing", "activity_feed", "onboarding"],
        purposes: ["exploration", "conversion"],
        audiences: ["creator", "general", "professional"],
        keywords: ["creative", "art", "design", "illustration", "animation", "visual", "brand", "identity", "experience", "immersive"],
    },
    nonprofit: {
        requiredSections: ["hero", "cta", "content", "footer"],
        optionalSections: ["testimonial", "stats", "team", "donation", "newsletter", "blog", "trust", "social", "impact", "mission", "values"],
        forbiddenSections: ["metrics", "chart", "table", "pricing", "product"],
        purposes: ["conversion", "exploration"],
        audiences: ["consumer", "general", "professional"],
        keywords: ["nonprofit", "charity", "cause", "donate", "fundraise", "impact", "mission", "community", "social good", "volunteer"],
    },
    healthcare: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["testimonial", "team", "faq", "contact", "trust", "stats", "blog", "service", "booking"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration", "reference"],
        audiences: ["consumer", "professional"],
        keywords: ["healthcare", "medical", "health", "clinic", "hospital", "doctor", "patient", "wellness", "therapy", "treatment"],
    },
    fintech: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["stats", "testimonial", "pricing", "trust", "comparison", "faq", "team", "blog", "security", "compliance"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "gallery"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["professional", "enterprise", "consumer"],
        keywords: ["fintech platform", "fintech product", "fintech solution", "fintech tool", "finance platform", "trading platform", "banking platform", "payment platform"],
    },
    education: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["testimonial", "course", "team", "faq", "blog", "stats", "pricing", "process", "timeline"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "product"],
        purposes: ["conversion", "education", "exploration"],
        audiences: ["student", "professional", "general"],
        keywords: ["education", "learn", "course", "training", "school", "university", "class", "study", "teach", "academy", "e-learning"],
    },
    real_estate: {
        requiredSections: ["hero", "product", "cta", "footer"],
        optionalSections: ["search", "filter", "map", "testimonial", "stats", "team", "faq", "blog", "trust"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "onboarding"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["consumer", "professional"],
        keywords: ["real estate", "property", "house", "home", "rent", "buy", "sell", "agent", "broker", "listing", "mortgage"],
    },
    travel: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["gallery", "testimonial", "search", "filter", "map", "booking", "faq", "blog", "stats"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["consumer", "general"],
        keywords: ["travel", "trip", "vacation", "hotel", "flight", "tour", "destination", "booking", "adventure", "explore"],
    },
    food: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["gallery", "menu", "testimonial", "booking", "map", "faq", "blog", "team", "social"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["consumer", "general"],
        keywords: ["food", "restaurant", "menu", "recipe", "cook", "dining", "catering", "delivery", "cafe", "bakery"],
    },
    sports: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["stats", "gallery", "testimonial", "team", "schedule", "blog", "social", "shop"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration", "entertainment"],
        audiences: ["consumer", "general", "professional"],
        keywords: ["sports", "fitness", "gym", "team", "league", "tournament", "game", "athlete", "training", "workout"],
    },
    gaming: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["gallery", "stats", "testimonial", "blog", "social", "community", "shop", "leaderboard"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "entertainment", "exploration"],
        audiences: ["consumer", "general"],
        keywords: ["gaming", "game", "esports", "play", "stream", "console", "pc gaming", "mobile game", "vr"],
    },
    crypto_web3: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["stats", "testimonial", "pricing", "trust", "community", "blog", "roadmap", "team", "token"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "gallery"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["professional", "consumer", "developer"],
        keywords: ["crypto", "web3", "blockchain", "defi", "nft", "dao", "token", "wallet", "swap", "staking"],
    },
    media: {
        requiredSections: ["hero", "content", "footer"],
        optionalSections: ["gallery", "blog", "social", "newsletter", "testimonial", "stats", "team", "contact"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["exploration", "entertainment", "education"],
        audiences: ["consumer", "general", "reader"],
        keywords: ["media company", "media platform", "broadcasting", "streaming platform", "video platform", "music platform"],
    },
    government: {
        requiredSections: ["hero", "content", "footer"],
        optionalSections: ["faq", "contact", "search", "breadcrumb", "alert", "banner", "service", "team"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "hero", "pricing", "testimonial"],
        purposes: ["reference", "exploration", "transaction"],
        audiences: ["general", "professional"],
        keywords: ["government", "public", "city", "state", "federal", "municipal", "civic", "official", "agency"],
    },
    legal: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["team", "testimonial", "faq", "contact", "blog", "trust", "service"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "gallery", "pricing"],
        purposes: ["conversion", "reference", "exploration"],
        audiences: ["professional", "consumer"],
        keywords: ["legal", "law", "attorney", "lawyer", "firm", "counsel", "litigation", "corporate law", "ip", "immigration"],
    },
    manufacturing: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["stats", "testimonial", "team", "process", "gallery", "contact", "trust", "blog"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration"],
        audiences: ["enterprise", "professional"],
        keywords: ["manufacturing", "factory", "production", "industrial", "engineering", "supply chain", "logistics", "assembly"],
    },
    automotive: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["gallery", "stats", "comparison", "testimonial", "booking", "faq", "blog", "trust"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["consumer", "professional"],
        keywords: ["automotive", "car", "vehicle", "auto", "dealer", "electric", "ev", "luxury car", "suv", "truck"],
    },
    hospitality: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["gallery", "booking", "testimonial", "map", "faq", "team", "blog", "social", "trust"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["consumer", "general"],
        keywords: ["hospitality", "hotel", "resort", "rental", "vacation rental", "bnb", "lodge", "inn", "boutique hotel"],
    },
    beauty_fashion: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["gallery", "testimonial", "blog", "social", "team", "shop", "newsletter", "trust"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration", "transaction"],
        audiences: ["consumer", "general"],
        keywords: ["beauty", "fashion", "cosmetics", "skincare", "makeup", "luxury beauty", "fragrance", "wellness", "salon"],
    },
    insurance: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["testimonial", "faq", "trust", "stats", "team", "blog", "contact", "comparison"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "gallery"],
        purposes: ["conversion", "exploration", "reference"],
        audiences: ["consumer", "professional", "enterprise"],
        keywords: ["insurance", "coverage", "policy", "claim", "health insurance", "life insurance", "auto insurance", "business insurance"],
    },
    energy: {
        requiredSections: ["hero", "feature", "cta", "footer"],
        optionalSections: ["stats", "testimonial", "team", "process", "blog", "contact", "trust", "gallery"],
        forbiddenSections: ["metrics", "chart", "table", "activity_feed", "pricing"],
        purposes: ["conversion", "exploration"],
        audiences: ["enterprise", "professional", "consumer"],
        keywords: ["energy", "renewable", "solar", "wind", "oil", "gas", "utilities", "nuclear", "storage", "grid"],
    },
};
// ── Detection Logic ─────────────────────────────────────────────────────────
/**
 * Detect page context from intent + genome
 *
 * Uses keyword matching against intent description + sector mapping
 * to determine what the page IS, its purpose, and audience.
 */
export function detectPageContext(intent, sector, genome) {
    const intentLower = intent.toLowerCase();
    // Find best matching context by keyword overlap
    let bestMatch = { type: "landing", score: 0 };
    for (const [type, rule] of Object.entries(CONTEXT_RULES)) {
        let score = 0;
        for (const keyword of rule.keywords) {
            if (intentLower.includes(keyword.toLowerCase())) {
                score += 1;
            }
        }
        // Sector bonus
        if (type === sector)
            score += 3;
        if (score > bestMatch.score) {
            bestMatch = { type, score };
        }
    }
    // Default to landing if no match
    const contentType = bestMatch.score > 0 ? bestMatch.type : "landing";
    const rule = CONTEXT_RULES[contentType] || CONTEXT_RULES.landing;
    // Calculate complexity from genome if available
    const complexity = genome
        ? calculateComplexity(genome)
        : 0.5;
    return {
        contentType,
        purpose: rule.purposes[0],
        audience: rule.audiences[0],
        complexity,
        requiredSections: rule.requiredSections,
        optionalSections: rule.optionalSections,
        forbiddenSections: rule.forbiddenSections,
    };
}
/**
 * Calculate complexity score from genome chromosomes
 */
function calculateComplexity(genome) {
    const ch = genome.chromosomes;
    let score = 0;
    // Structure complexity
    if (ch.ch1_structure?.topology === "graph")
        score += 0.3;
    else if (ch.ch1_structure?.topology === "radial")
        score += 0.2;
    else if (ch.ch1_structure?.topology === "deep")
        score += 0.25;
    else
        score += 0.1;
    // Motion complexity
    if (ch.ch8_motion?.physics === "particle" || ch.ch8_motion?.physics === "fluid")
        score += 0.2;
    else if (ch.ch8_motion?.physics === "spring" || ch.ch8_motion?.physics === "elastic")
        score += 0.1;
    // Rendering complexity
    if (ch.ch18_rendering?.primary === "webgl2")
        score += 0.3;
    else if (ch.ch18_rendering?.primary === "canvas2d" || ch.ch18_rendering?.primary === "canvas_bitmap")
        score += 0.15;
    // Atmosphere complexity
    if (ch.ch13_atmosphere?.fx && ch.ch13_atmosphere?.fx !== "none")
        score += 0.1;
    // Content depth
    if (ch.ch23_content_depth?.estimatedSections) {
        score += Math.min(0.2, ch.ch23_content_depth.estimatedSections * 0.02);
    }
    return Math.min(1, Math.max(0, score));
}
/**
 * Get context rules for a content type
 */
export function getContextRules(contentType) {
    return CONTEXT_RULES[contentType];
}
/**
 * List all available content types
 */
export function getAvailableContentTypes() {
    return Object.keys(CONTEXT_RULES);
}

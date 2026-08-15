export function calculateSeoScore(portfolioData, blocks) {
    if (!portfolioData) return { score: 0, warnings: [], metrics: {} };
    
    let score = 100;
    const warnings = [];
    const metrics = {
        hasTitle: false,
        hasDescription: false,
        hasContent: false,
        imageOptimized: true,
        semanticStructure: true
    };

    // 1. Check SEO Metadata
    const seo = portfolioData.seo || {};
    if (!seo.title || seo.title.trim() === '') {
        score -= 20;
        warnings.push("Missing Site Title (Title tag is crucial for SEO)");
    } else {
        metrics.hasTitle = true;
    }

    if (!seo.description || seo.description.trim() === '') {
        score -= 15;
        warnings.push("Missing Meta Description");
    } else {
        metrics.hasDescription = true;
    }

    // 2. Content Density
    const hero = portfolioData.heroSection;
    const about = portfolioData.aboutSection;
    if ((!hero || !hero.headline) && (!about || !about.bioDescription)) {
        score -= 15;
        warnings.push("Thin content: Add a Headline or About section");
    } else {
        metrics.hasContent = true;
    }

    // 3. Media & Performance (Mock logic)
    const projects = portfolioData.projectsSection || [];
    const missingImages = projects.filter(p => !p.image);
    if (missingImages.length > 0) {
        score -= 5;
        warnings.push(`${missingImages.length} project(s) missing thumbnails`);
        metrics.imageOptimized = false;
    }

    // 4. Semantic Structure
    if (blocks && blocks.length > 0) {
        // Ensure there's a Hero or Header block near the top
        const firstBlock = blocks[0];
        if (firstBlock.type !== 'HeroBlock') {
            score -= 5;
            warnings.push("Best practice: Place a Hero or introduction block first");
            metrics.semanticStructure = false;
        }
    }

    // Calculate Lighthouse-style ranges
    let color = "text-red-500 bg-red-500/10";
    if (score >= 90) color = "text-[#34A853] bg-[#34A853]/10";
    else if (score >= 50) color = "text-[#FBBC04] bg-[#FBBC04]/10";

    return {
        score: Math.max(0, score),
        warnings,
        color,
        metrics
    };
}

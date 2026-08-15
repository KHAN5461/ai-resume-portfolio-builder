export function optimizeLayout(portfolioData) {
    if (!portfolioData || !portfolioData.blocks) return portfolioData?.blocks || [];
    
    // We want to return a new array of blocks with optimized order and variants
    let blocks = [...portfolioData.blocks];
    
    // 1. Order Optimization:
    // Best practice order: Hero -> About -> Projects -> Experience -> Skills -> Education -> Contact
    const orderPriority = {
        'HeroBlock': 1,
        'AboutBlock': 2,
        'ProjectsBlock': 3,
        'ExperienceBlock': 4,
        'SkillsBlock': 5,
        'EducationBlock': 6,
        'ContactBlock': 7
    };
    
    blocks.sort((a, b) => {
        const p1 = orderPriority[a.type] || 99;
        const p2 = orderPriority[b.type] || 99;
        return p1 - p2;
    });

    // 2. Variant Optimization based on content density:
    blocks = blocks.map(block => {
        const optimizedBlock = { ...block, config: { ...block.config } };
        
        switch (block.type) {
            case 'HeroBlock': {
                // If subheadline is very long, left-align is better for readability.
                // If short, center is bolder.
                const heroData = portfolioData.heroSection || {};
                const textLength = (heroData.subheadline || '').length;
                if (textLength > 150) {
                    optimizedBlock.config.alignment = 'left';
                    optimizedBlock.config.size = 'lg';
                } else {
                    optimizedBlock.config.alignment = 'center';
                    optimizedBlock.config.size = 'xl';
                }
                break;
            }
            case 'ProjectsBlock': {
                // If many projects (4+), use grid. If few (1-3), use list/featured layout.
                const projects = portfolioData.projectsSection || [];
                if (projects.length >= 4) {
                    optimizedBlock.config.layout = 'grid';
                    optimizedBlock.config.columns = 3;
                } else {
                    optimizedBlock.config.layout = 'featured';
                    optimizedBlock.config.columns = 1;
                }
                break;
            }
            case 'SkillsBlock': {
                // If many categories, use bento or grid. If simple list, use pills.
                const skills = portfolioData.skillsSection?.categories || [];
                if (skills.length > 2) {
                    optimizedBlock.config.layout = 'bento';
                } else {
                    optimizedBlock.config.layout = 'pills';
                }
                break;
            }
        }
        
        return optimizedBlock;
    });

    return blocks;
}

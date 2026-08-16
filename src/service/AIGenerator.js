import { AIChatSession } from './AIModal';

export const validateScaffold = (data) => {
  const requiredKeys = ['siteConfig', 'heroSection', 'aboutSection'];
  return requiredKeys.every(key => Object.keys(data).includes(key));
};

const JSON_SCHEMA = `
{
  "siteConfig": {
    "themePreset": "default",
    "accentColor": "#6366f1",
    "themeMode": "light",
    "layout": [
      { "id": "hero_1", "type": "hero", "visible": true, "name": "Hero" },
      { "id": "about_1", "type": "about", "visible": true, "name": "About" },
      { "id": "projects_1", "type": "projects", "visible": true, "name": "Projects" },
      { "id": "skills_1", "type": "skills", "visible": true, "name": "Skills" },
      { "id": "contact_1", "type": "contact", "visible": true, "name": "Contact" }
    ]
  },
  "heroSection": {
    "greeting": "",
    "headline": "",
    "subheadline": "",
    "primaryCta": { "text": "", "link": "" },
    "secondaryCta": { "text": "", "link": "" }
  },
  "aboutSection": {
    "bioTitle": "",
    "bioDescription": "",
    "stats": []
  },
  "projectsSection": [
    {
      "title": "",
      "description": "",
      "technologies": [],
      "githubUrl": "",
      "liveUrl": ""
    }
  ],
  "skillsSection": {
    "categories": [
      { "name": "", "skills": [] }
    ]
  },
  "contactSection": {
    "heading": "",
    "subheading": "",
    "email": "",
    "socialLinks": []
  }
}
`;

const SCAFFOLD_PROMPT = `
You are an expert Data Model Architect and Portfolio Scaffolder.
The user wants to generate a professional developer portfolio.
You must extract their intent and any provided unstructured data (like a resume or LinkedIn profile) to build a fully structured portfolio JSON object.

CRITICAL INSTRUCTIONS:
1. You MUST return ONLY a valid JSON object.
2. DO NOT wrap the output in markdown code blocks (\`\`\`json). Just return the raw JSON string.
3. The JSON MUST perfectly match this exact schema:

${JSON_SCHEMA}

4. If the user provides unstructured data, parse it and map it into the appropriate sections (Projects, Skills, About).
5. If the user asks for a specific "vibe" or "style" (e.g., Minimalist, Dark), adjust the \`siteConfig.themeMode\` and \`siteConfig.accentColor\` accordingly.
6. Generate engaging, professional copy for the \`heroSection\` and \`aboutSection\` if not explicitly provided.

User Request: {prompt}
Unstructured Data: {unstructuredData}
`;

export const generatePortfolioScaffold = async (prompt, unstructuredData = '') => {
  try {
    const finalPrompt = SCAFFOLD_PROMPT
      .replace('{prompt}', prompt)
      .replace('{unstructuredData}', unstructuredData);

    const result = await AIChatSession.sendMessage(finalPrompt);
    let responseText = result.response.text(); // AIChatSession returns an object with `response: { text: () => text }`
    
    // Clean up potential markdown code block wrappers
    responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(responseText);
    
    if (!validateScaffold(parsedData)) {
      throw new Error("Invalid scaffold schema returned by AI.");
    }
    
    return parsedData;
  } catch (error) {
    console.error("Scaffold Generation Error:", error);
    throw error;
  }
};

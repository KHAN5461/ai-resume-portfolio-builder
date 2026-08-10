import { AIChatSession } from './../../service/AIModal';

const PROMPT_TEMPLATE = `
You are an expert full-stack AI prompt engineer, career data architect, and JSON transformation engine. 

### Core Objective
Analyze the user's raw input (such as bio notes, project snippets, or raw career history) and transform, rewrite, and structure it into a pristine, strictly formatted JSON object matching the exact schema below. 

### Optimization Rules
1. **Professional Writing:** Rewrite all experience and project bullet points using strong action verbs, technical context, and quantifiable metrics (STAR method).
2. **Taxonomy & Skills:** Group skills cleanly into logical categories as required by the schema.
3. **Strict Formatting:** Output MUST be valid JSON only. Do NOT include markdown code block wrappers.

### Target JSON Schema

{
  "resumeData": {
    "personalInfo": {
      "fullName": "string",
      "targetTitle": "string",
      "email": "string",
      "phone": "string",
      "location": "string",
      "portfolioUrl": "string",
      "githubUrl": "string",
      "linkedinUrl": "string"
    },
    "professionalSummary": "string",
    "workExperience": [
      {
        "role": "string",
        "company": "string",
        "location": "string",
        "startDate": "string",
        "endDate": "string",
        "current": false,
        "bullets": ["string"]
      }
    ],
    "projects": [
      {
        "name": "string",
        "role": "string",
        "startDate": "string",
        "endDate": "string",
        "highlights": ["string"],
        "technologies": ["string"]
      }
    ],
    "education": [
      {
        "degree": "string",
        "institution": "string",
        "location": "string",
        "startDate": "string",
        "endDate": "string",
        "gpaOrHonors": "string"
      }
    ],
    "skills": {
      "languages": ["string"],
      "frameworksAndLibraries": ["string"],
      "databasesAndTools": ["string"]
    },
    "certifications": [
      {
        "title": "string",
        "issuer": "string",
        "date": "string"
      }
    ]
  },
  "portfolioData": {
    "siteConfig": {
      "themePreset": "default",
      "accentColor": "#000000",
      "enableAnimations": true,
      "seo": {
        "metaTitle": "Portfolio",
        "metaDescription": "My professional portfolio",
        "ogImage": ""
      }
    },
    "heroSection": {
      "greeting": "string",
      "headline": "string",
      "subheadline": "string",
      "primaryCta": { "text": "string", "link": "string" },
      "secondaryCta": { "text": "string", "link": "string" },
      "terminalCodeSnippet": "string"
    },
    "aboutSection": {
      "bioTitle": "string",
      "bioDescription": "string",
      "stats": [{ "label": "string", "value": "string" }]
    },
    "projectsSection": [
      {
        "id": "string",
        "title": "string",
        "tagline": "string",
        "description": "string",
        "category": "string",
        "thumbnailUrl": "string",
        "liveUrl": "string",
        "githubUrl": "string",
        "tags": ["string"],
        "featured": true
      }
    ],
    "skillsSection": {
      "categories": [
        { "categoryName": "string", "skills": ["string"] }
      ]
    },
    "communitySection": {
      "title": "string",
      "items": [
        { "role": "string", "organization": "string", "description": "string" }
      ]
    },
    "contactSection": {
      "heading": "string",
      "subheading": "string",
      "email": "string",
      "socialLinks": [
        { "platform": "string", "url": "string" }
      ]
    }
  }
}

### User Input to Process:
{userPrompt}
`;

export const transformResumeData = async (rawText) => {
    const prompt = PROMPT_TEMPLATE.replace('{userPrompt}', rawText);
    try {
        const result = await AIChatSession.sendMessage(prompt);
        let responseText = result.response.text();
        
        // Robust JSON extraction matching anything between outer braces
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No JSON object found in AI response");
        }
        
        let cleanJson = jsonMatch[0].trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("AI Transformation Error:", error);
        // Fallback safe state
        return {
            resumeData: {
                personalInfo: {},
                professionalSummary: "",
                workExperience: [],
                projects: [],
                education: [],
                skills: { languages: [], frameworksAndLibraries: [], databasesAndTools: [] },
                certifications: []
            },
            portfolioData: {}
        };
    }
};

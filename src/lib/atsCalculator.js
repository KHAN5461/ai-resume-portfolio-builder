export const calculateLocalAtsScore = (resumeInfo) => {
  let total = 0;
  if (resumeInfo?.firstName || resumeInfo?.lastName) total += 10;
  if (resumeInfo?.email) total += 10;
  if (resumeInfo?.summery?.length > 50) total += 20;
  if (resumeInfo?.Experience?.length > 0) total += 30;
  if (resumeInfo?.education?.length > 0) total += 15;

  const actionVerbs = [
    "Led", "Developed", "Optimized", "Managed", "Designed",
    "Built", "Reduced", "Increased", "Implemented", "Created",
    "Analyzed", "Collaborated", "Spearheaded", "Streamlined", "Resolved",
    "Orchestrated", "Improved", "Executed", "Directed", "Achieved"
  ];

  const expString = JSON.stringify(resumeInfo?.Experience || "").toLowerCase();
  const sumString = (resumeInfo?.summery || "").toLowerCase();
  const textToSearch = expString + " " + sumString;

  let foundCount = 0;
  let missingKeywords = [];

  actionVerbs.forEach(verb => {
    if (textToSearch.includes(verb.toLowerCase())) {
      foundCount++;
    } else {
      missingKeywords.push(verb);
    }
  });

  const keywordPoints = Math.min(foundCount * 3, 15);
  total += keywordPoints;

  return {
    score: Math.min(100, total),
    missingKeywords: missingKeywords.slice(0, 5)
  };
};

self.onmessage = async (e) => {
    const { username } = e.data;
    
    if (!username) {
        self.postMessage({ error: 'Username is required' });
        return;
    }

    try {
        const response = await fetch(`https://api.github.com/users/${username.trim()}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            self.postMessage({ error: 'Failed to fetch repositories. Please check the username.' });
            return;
        }
        
        const repos = await response.json();
        
        // Filter out forks, sort by stargazers_count (descending), take top 6
        const topRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6);

        const parsedRepos = topRepos.map(repo => ({
            name: repo.name,
            role: "Creator",
            startDate: "",
            endDate: "",
            highlights: [repo.description || ""],
            technologies: repo.language ? [repo.language] : []
        }));

        self.postMessage({ success: true, repos: parsedRepos });
    } catch (error) {
        self.postMessage({ error: error.message || 'Failed to sync GitHub. Please try again.' });
    }
};

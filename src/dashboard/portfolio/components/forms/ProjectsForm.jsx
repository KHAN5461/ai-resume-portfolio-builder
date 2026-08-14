import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updatePortfolioData } from '@/store/portfolioSlice';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axios from 'axios';

const ProjectsForm = () => {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.portfolios[portfolioId]);
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");
  
  if (!portfolioData) return null;
  const projects = portfolioData.projectsSection || [];

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    dispatch(updatePortfolioData({ id: portfolioId, data: { projectsSection: newProjects } }));
  };

  const addProject = () => {
    const newProjects = [...projects, { title: "", tagline: "", description: "", thumbnailUrl: "", githubUrl: "", liveUrl: "", tags: [] }];
    dispatch(updatePortfolioData({ id: portfolioId, data: { projectsSection: newProjects } }));
  };

  const removeProject = (index) => {
    const newProjects = projects.filter((_, i) => i !== index);
    dispatch(updatePortfolioData({ id: portfolioId, data: { projectsSection: newProjects } }));
  };

  const handleTagsChange = (index, value) => {
    const tagsArray = value.split(',').map(tag => tag.trim());
    handleProjectChange(index, 'tags', tagsArray);
  };

  const handleGithubImport = async () => {
    if (!githubUsername) return;

    setIsFetchingGithub(true);
    try {
      // Fetch user's public repos sorted by recently updated
      const res = await axios.get(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=3`);
      const repos = res.data;
      
      if (!repos || repos.length === 0) {
        toast.error("No public repositories found for this user.");
        setIsFetchingGithub(false);
        return;
      }

      const importedProjects = repos.map(repo => ({
        title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '), // beautify name
        tagline: repo.language ? `Built with ${repo.language}` : "Open Source Project",
        description: repo.description || "No description provided.",
        thumbnailUrl: "",
        githubUrl: repo.html_url,
        liveUrl: repo.homepage || "",
        tags: repo.topics || (repo.language ? [repo.language] : [])
      }));

      const newProjects = [...projects, ...importedProjects];
      dispatch(updatePortfolioData({ id: portfolioId, data: { projectsSection: newProjects } }));
      
      toast.success(`Successfully imported ${importedProjects.length} repositories!`);
      setIsGithubModalOpen(false);
      setGithubUsername("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch from GitHub. Please check the username.");
    } finally {
      setIsFetchingGithub(false);
    }
  };

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-indigo-500 border-t-4 mt-10 bg-white'>
      <div className="flex justify-between items-center mb-2">
        <h2 className='font-bold text-lg'>Projects Section</h2>
        <Dialog open={isGithubModalOpen} onOpenChange={setIsGithubModalOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isFetchingGithub}
              className="flex items-center gap-2 border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Github className="w-4 h-4" />
              Import from GitHub
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Import from GitHub</DialogTitle>
              <DialogDescription>
                Enter your GitHub username to import your most recently updated public repositories.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Input
                  id="username"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  placeholder="e.g. torvalds"
                  className="col-span-4"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleGithubImport();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button disabled={isFetchingGithub || !githubUsername} onClick={handleGithubImport}>
                {isFetchingGithub ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isFetchingGithub ? "Importing..." : "Import Repositories"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-sm text-slate-500 mb-4">Add your selected works</p>

      {projects.length === 0 ? (
        <div className="text-center py-8 bg-zinc-50 rounded-lg mt-4 border border-dashed border-zinc-300">
           <span className="material-symbols-outlined text-4xl text-zinc-400 mb-2">work_off</span>
           <h3 className="font-semibold text-zinc-700">No Projects Yet</h3>
           <p className="text-sm text-zinc-500 max-w-xs mx-auto mb-4">Showcase your best work by adding your first project.</p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {projects.map((project, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className='border rounded p-4 bg-zinc-50 relative'>
                  <button 
                    onClick={() => removeProject(index)}
                    className='absolute top-2 right-2 text-red-500 text-sm hover:underline flex items-center gap-1'
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Remove
                  </button>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                    <div>
                      <label className='text-sm font-semibold'>Project Title</label>
                      <Input value={project.title || ""} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} placeholder="e.g. E-Commerce App" />
                    </div>
                    <div>
                      <label className='text-sm font-semibold'>Tagline</label>
                      <Input value={project.tagline || ""} onChange={(e) => handleProjectChange(index, 'tagline', e.target.value)} placeholder="e.g. Built with React & Node" />
                    </div>
                    <div className='md:col-span-2'>
                      <label className='text-sm font-semibold'>Description</label>
                      <Textarea value={project.description || ""} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} placeholder="What did you build?" />
                    </div>
                    <div className='md:col-span-2'>
                      <label className='text-sm font-semibold'>Thumbnail URL</label>
                      <Input value={project.thumbnailUrl || ""} onChange={(e) => handleProjectChange(index, 'thumbnailUrl', e.target.value)} placeholder="https://..." />
                    </div>
                    <div>
                      <label className='text-sm font-semibold'>GitHub URL</label>
                      <Input value={project.githubUrl || ""} onChange={(e) => handleProjectChange(index, 'githubUrl', e.target.value)} placeholder="https://github.com/..." />
                    </div>
                    <div>
                      <label className='text-sm font-semibold'>Live URL</label>
                      <Input value={project.liveUrl || ""} onChange={(e) => handleProjectChange(index, 'liveUrl', e.target.value)} placeholder="https://..." />
                    </div>
                    <div className='md:col-span-2'>
                      <label className='text-sm font-semibold'>Tags (comma separated)</label>
                      <Input value={project.tags?.join(', ') || ""} onChange={(e) => handleTagsChange(index, e.target.value)} placeholder="React, Node.js, MongoDB" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      <Button onClick={addProject} variant="outline" className="w-full mt-4 text-indigo-600 border-indigo-600">
        + Add New Project
      </Button>
    </div>
  );
}

export default React.memo(ProjectsForm);

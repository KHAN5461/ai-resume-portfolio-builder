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
  const portfolioData = useSelector((state) => state.portfolio.present.portfolios[portfolioId]);
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
    <div className='space-y-6'>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Selected Works</h4>
          <Dialog open={isGithubModalOpen} onOpenChange={setIsGithubModalOpen}>
            <DialogTrigger asChild>
              <button 
                disabled={isFetchingGithub}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 uppercase tracking-wider transition-colors bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                Import from GitHub
              </button>
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
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-gray-200 dark:border-slate-700/50">
           <span className="material-symbols-outlined text-[32px] text-gray-300 dark:text-gray-600 mb-1 block">work_off</span>
           <h3 className="font-semibold text-sm text-gray-600 dark:text-gray-300">No Projects</h3>
           <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Showcase your best work.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {projects.map((project, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.2 }}
              >
                <div className='p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700/50 relative group'>
                  <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-slate-700 pb-2">
                     <h5 className="text-[11px] font-bold text-gray-500 uppercase">Project {index + 1}</h5>
                     <button 
                       onClick={() => removeProject(index)}
                       className='p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors opacity-0 group-hover:opacity-100'
                     >
                       <span className="material-symbols-outlined text-[16px] block">delete</span>
                     </button>
                  </div>
                  
                  <div className='space-y-3'>
                    <div className="space-y-1.5">
                      <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>Project Title</label>
                      <Input value={project.title || ""} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} placeholder="e.g. E-Commerce App" className="h-8 text-xs bg-white dark:bg-slate-900" />
                    </div>
                    <div className="space-y-1.5">
                      <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>Tagline</label>
                      <Input value={project.tagline || ""} onChange={(e) => handleProjectChange(index, 'tagline', e.target.value)} placeholder="e.g. Built with React & Node" className="h-8 text-xs bg-white dark:bg-slate-900" />
                    </div>
                    <div className="space-y-1.5">
                      <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>Description</label>
                      <Textarea value={project.description || ""} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} placeholder="What did you build?" className="text-xs resize-none h-20 custom-scrollbar bg-white dark:bg-slate-900" />
                    </div>
                    
                    <div className="space-y-1.5 pt-2">
                      <label className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Media & Links</label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input value={project.thumbnailUrl || ""} onChange={(e) => handleProjectChange(index, 'thumbnailUrl', e.target.value)} placeholder="Thumbnail URL" className="h-8 text-xs bg-white dark:bg-slate-900 col-span-2" />
                        <Input value={project.githubUrl || ""} onChange={(e) => handleProjectChange(index, 'githubUrl', e.target.value)} placeholder="GitHub URL" className="h-8 text-xs bg-white dark:bg-slate-900" />
                        <Input value={project.liveUrl || ""} onChange={(e) => handleProjectChange(index, 'liveUrl', e.target.value)} placeholder="Live URL" className="h-8 text-xs bg-white dark:bg-slate-900" />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 pt-2">
                      <label className='text-xs font-medium text-gray-600 dark:text-gray-400'>Tags (comma separated)</label>
                      <Input value={project.tags?.join(', ') || ""} onChange={(e) => handleTagsChange(index, e.target.value)} placeholder="React, Node.js, MongoDB" className="h-8 text-xs bg-white dark:bg-slate-900" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      <button onClick={addProject} className="w-full py-2 bg-white dark:bg-slate-800 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
        + Add New Project
      </button>
    </div>
  );
}

export default React.memo(ProjectsForm);

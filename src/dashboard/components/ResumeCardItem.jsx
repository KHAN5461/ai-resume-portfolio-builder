import { Loader2Icon, MoreVertical, Edit2, Trash } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import GlobalApi from './../../../service/GlobalApi'
import { toast } from 'sonner'
import { Eye, Clock } from 'lucide-react'

function ResumeCardItem({resume,refreshData, optimisticDelete, rollbackDelete, views}) {

  const navigation=useNavigate();
  const [openAlert,setOpenAlert]=useState(false);
  const [loading,setLoading]=useState(false);

  const onDelete=(e)=>{
    e.preventDefault();
    setLoading(true);
    
    // Optimistic UI update
    if (optimisticDelete) optimisticDelete(resume.documentId);
    
    GlobalApi.DeleteResumeById(resume.documentId).then(resp=>{
      toast('Resume Deleted!');
      setLoading(false);
      setOpenAlert(false);
      // Optional: still refresh data to ensure sync with server
      refreshData();
    }).catch((error)=>{
      toast.error('Failed to delete resume. Reverting changes.');
      setLoading(false);
      setOpenAlert(false);
      if (rollbackDelete) rollbackDelete();
      else refreshData(); // Fallback if no rollback provided
    });
  }

  return (
    <>
      <div className="group flex flex-col sm:flex-col max-sm:flex-row bg-surface-container-lowest/80 backdrop-blur-sm rounded-xl border border-outline-variant/40 overflow-hidden hover:shadow-[0px_12px_24px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 cursor-pointer hardware-accelerated h-auto sm:h-[280px]">
        <Link to={'/dashboard/resume/'+resume.documentId+"/edit"} className="relative w-full max-sm:w-28 h-40 max-sm:h-auto max-sm:min-h-full bg-surface-container overflow-hidden flex items-center justify-center bg-surface-variant/30 group-hover:bg-surface-variant/50 transition-colors">
          <span className="material-symbols-outlined text-outline text-4xl group-hover:scale-110 transition-transform">description</span>
          <div className="absolute top-2 right-2 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#34A853]"></span>
            <span className="font-label-sm text-[12px] text-on-surface">Published</span>
          </div>
        </Link>
        <div className="p-4 flex flex-col flex-1">
          <h4 className="font-headline-md text-[18px] font-bold text-on-surface mb-1 truncate group-hover:text-stitch-primary transition-colors">{resume.title}</h4>
          
          <div className="flex items-center justify-between mb-4 mt-2">
              <p className="font-body-sm text-[12px] text-on-surface-variant flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Updated recently
              </p>
              {views !== undefined && (
                  <p className="font-body-sm text-[12px] font-medium text-stitch-primary flex items-center gap-1 bg-stitch-primary/10 px-2 py-0.5 rounded-full">
                      <Eye className="w-3.5 h-3.5" /> {views} views
                  </p>
              )}
          </div>

          <div className="mt-auto flex justify-between items-center pt-3 border-t border-outline-variant/30">
            <span className="inline-flex items-center rounded-full bg-stitch-primary/10 px-2.5 py-0.5 font-label-sm text-[12px] text-stitch-primary">Resume</span>
            
            <div className="flex sm:hidden items-center gap-2">
              <button aria-label="Edit resume" onClick={(e) => { e.stopPropagation(); e.preventDefault(); navigation('/dashboard/resume/'+resume.documentId+"/edit"); }} className="p-1.5 text-on-surface-variant hover:bg-surface-variant rounded-full">
                <Edit2 className="w-4 h-4" />
              </button>
              <button aria-label="Delete resume" onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpenAlert(true); }} className="p-1.5 text-error hover:bg-error-container rounded-full">
                <Trash className="w-4 h-4" />
              </button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="hidden sm:block text-on-surface-variant hover:text-stitch-primary p-1 rounded-full hover:bg-surface-variant transition-colors focus:outline-none">
                <span className="material-symbols-outlined">more_horiz</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-surface-container-lowest border border-outline-variant/40 text-on-surface rounded-lg shadow-sm">
                <DropdownMenuItem className="hover:bg-surface-container cursor-pointer" onClick={(e)=> { e.stopPropagation(); navigation('/dashboard/resume/'+resume.documentId+"/edit")}}>Edit</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-surface-container cursor-pointer" onClick={(e)=> { e.stopPropagation(); navigation('/my-resume/'+resume.documentId+"/view")}}>View</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-surface-container cursor-pointer" onClick={(e)=> { e.stopPropagation(); navigation('/my-resume/'+resume.documentId+"/view")}}>Download</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-error-container hover:text-error cursor-pointer text-error" onClick={(e)=> { e.stopPropagation(); setOpenAlert(true)}}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent className="bg-surface-container-lowest border-outline-variant/40 text-on-surface rounded-2xl shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[24px] font-bold">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-on-surface-variant">
              This action cannot be undone. This will permanently delete your resume and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-surface-variant text-on-surface hover:bg-surface-container-high border-transparent rounded-full px-6" onClick={()=>setOpenAlert(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-error hover:bg-error/90 text-on-error rounded-full px-6" onClick={onDelete} disabled={loading}>
              {loading? <Loader2Icon className='animate-spin mr-2 h-4 w-4'/>:'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ResumeCardItem
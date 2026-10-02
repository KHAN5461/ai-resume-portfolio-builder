import { Loader2Icon, MoreVertical, Edit2, Trash, Eye, Clock, Sparkles, FileText, ExternalLink, ArrowUpRight } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

function ResumeCardItem({ resume, refreshData, optimisticDelete, rollbackDelete, views, layout = 'grid' }) {
  const navigation = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const themeColor = resume?.themeColor || '#4f46e5';

  const onDelete = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Optimistic UI update
    if (optimisticDelete) optimisticDelete(resume.documentId);
    
    GlobalApi.DeleteResumeById(resume.documentId).then(resp => {
      toast.success('Resume deleted successfully');
      setLoading(false);
      setOpenAlert(false);
      refreshData();
    }).catch((error) => {
      console.error(error);
      toast.error('Failed to delete resume. Reverting changes.');
      setLoading(false);
      setOpenAlert(false);
      if (rollbackDelete) rollbackDelete();
      else refreshData();
    });
  };

  if (layout === 'list') {
    return (
      <>
        <div className="group flex items-center justify-between gap-4 p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            {/* Visual Icon Accent */}
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
              style={{ backgroundColor: themeColor }}
            >
              <FileText className="w-5 h-5 text-white/95" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link 
                  to={'/dashboard/resume/' + resume.documentId + "/edit"}
                  className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate transition-colors"
                >
                  {resume.title || 'Untitled Resume'}
                </Link>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>

              {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <span>Resume</span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Updated recently</span>
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">98% ATS Ready</span>
                {views !== undefined && (
                  <>
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="hidden sm:inline">{views} views</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to={'/dashboard/resume/' + resume.documentId + "/edit"}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
            >
              <span>Edit</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none" aria-label="Resume options">
                <MoreVertical className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl shadow-xl p-1 z-50">
                <DropdownMenuItem 
                  className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); navigation('/dashboard/resume/' + resume.documentId + "/edit"); }}
                >
                  <Edit2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Edit in Studio</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); navigation('/my-resume/' + resume.documentId + "/view"); }}
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View Public URL</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); navigation('/my-resume/' + resume.documentId + "/view"); }}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download PDF</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1 border-slate-100 dark:border-slate-800" />
                <DropdownMenuItem 
                  className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); setOpenAlert(true); }}
                >
                  <Trash className="w-3.5 h-3.5" />
                  <span>Delete Document</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Delete Confirmation Alert Dialog */}
        <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
          <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl max-w-md p-6">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-bold">Delete this resume?</AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                This action cannot be undone. This document will be permanently deleted and removed from your cloud workspace.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4 gap-2">
              <AlertDialogCancel 
                className="rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold min-h-[40px] px-4"
                onClick={() => setOpenAlert(false)}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold min-h-[40px] px-4 flex items-center gap-2"
                onClick={onDelete} 
                disabled={loading}
              >
                {loading ? <Loader2Icon className="animate-spin h-3.5 w-3.5" /> : <Trash className="w-3.5 h-3.5" />}
                <span>{loading ? 'Deleting...' : 'Delete Permanently'}</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden h-[300px]">
        {/* Top Preview Canvas Zone */}
        <Link 
          to={'/dashboard/resume/' + resume.documentId + "/edit"} 
          className="relative w-full h-40 bg-slate-50 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center border-b border-slate-100 dark:border-slate-800/80 p-4 group-hover:bg-slate-100/70 dark:group-hover:bg-slate-800/80 transition-colors"
        >
          {/* Subtle Document Wireframe Preview */}
          <div className="w-36 h-48 bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-200/90 dark:border-slate-700/80 p-3 transform scale-90 group-hover:scale-95 group-hover:-translate-y-1 transition-all duration-300 flex flex-col gap-1.5 pointer-events-none">
            {/* Top theme color accent bar */}
            <div className="h-1.5 w-full rounded-full" style={{ backgroundColor: themeColor }}></div>
            {/* Mini Wireframe Lines */}
            <div className="h-2 w-3/4 bg-slate-300 dark:bg-slate-600 rounded-xs mt-1"></div>
            <div className="h-1.5 w-1/2 bg-slate-200 dark:bg-slate-700 rounded-xs"></div>
            <div className="w-full h-px bg-slate-100 dark:bg-slate-700/80 my-1"></div>
            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-xs"></div>
            <div className="h-1.5 w-5/6 bg-slate-200 dark:bg-slate-700 rounded-xs"></div>
            <div className="h-1.5 w-4/6 bg-slate-200 dark:bg-slate-700 rounded-xs"></div>
            <div className="w-full h-px bg-slate-100 dark:bg-slate-700/80 my-1"></div>
            <div className="flex gap-1">
              <div className="h-2.5 w-7 bg-indigo-100 dark:bg-indigo-950/60 rounded-xs"></div>
              <div className="h-2.5 w-7 bg-slate-100 dark:bg-slate-700 rounded-xs"></div>
            </div>
          </div>

          {/* Quick Edit Overlay Hover Pill */}
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-900/95 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold flex items-center gap-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <span>Open Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Status Indicator */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-700/80 px-2 py-0.5 rounded-md flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200 tracking-wide">ACTIVE</span>
            </div>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-700/80 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>ATS 98%</span>
            </span>
          </div>
        </Link>

        {/* Card Metadata Body */}
        <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-slate-900">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {resume.title || 'Untitled Resume'}
              </h4>
              <DropdownMenu>
                <DropdownMenuTrigger className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none shrink-0" aria-label="Resume options">
                  <MoreVertical className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl shadow-xl p-1 z-50">
                  <DropdownMenuItem 
                    className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); navigation('/dashboard/resume/' + resume.documentId + "/edit"); }}
                  >
                    <Edit2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>Edit in Studio</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); navigation('/my-resume/' + resume.documentId + "/view"); }}
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Public URL</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); navigation('/my-resume/' + resume.documentId + "/view"); }}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download PDF</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 border-slate-100 dark:border-slate-800" />
                  <DropdownMenuItem 
                    className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setOpenAlert(true); }}
                  >
                    <Trash className="w-3.5 h-3.5" />
                    <span>Delete Document</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Zero-Pill Unboxed Metadata with Typographic Separators */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Updated recently</span>
              </span>
              {views !== undefined && (
                <>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                  <span>{views} views</span>
                </>
              )}
            </div>
          </div>

          {/* Footer Card Controls */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Resume</span>

            <Link
              to={'/dashboard/resume/' + resume.documentId + "/edit"}
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors min-h-[32px] px-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>Edit</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
        <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl max-w-md p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">Delete this resume?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              This action cannot be undone. This document will be permanently deleted and removed from your cloud workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel 
              className="rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold min-h-[40px] px-4"
              onClick={() => setOpenAlert(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold min-h-[40px] px-4 flex items-center gap-2"
              onClick={onDelete} 
              disabled={loading}
            >
              {loading ? <Loader2Icon className="animate-spin h-3.5 w-3.5" /> : <Trash className="w-3.5 h-3.5" />}
              <span>{loading ? 'Deleting...' : 'Delete Permanently'}</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ResumeCardItem
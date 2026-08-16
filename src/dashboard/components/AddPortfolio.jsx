import { Loader2, PlusSquare, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '../../auth.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createPortfolio } from '@/store/portfolioSlice';
import GlobalApi from './../../../service/GlobalApi';

function AddPortfolio({ renderTrigger }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [portfolioTitle, setPortfolioTitle] = useState("");
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigate();
    const dispatch = useDispatch();

    const onCreate = async () => {
        setLoading(true);
        const data = {
            data: {
                title: portfolioTitle,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName
            }
        };

        GlobalApi.CreateNewPortfolio(data).then(resp => {
            if(resp) {
                setLoading(false);
                navigation('/dashboard/portfolio/' + resp.data.data.documentId + "/edit");
            }
        }, (error) => {
            setLoading(false);
        });
    };

    return (
        <div>
           {renderTrigger ? (
              renderTrigger(() => setOpenDialog(true))
           ) : (
             <div className='p-14 py-24 items-center flex justify-center bg-[var(--color-paper)] rounded-[16px] h-[280px] hover:border-[var(--color-signal-blue)] cursor-pointer border border-[var(--color-chalk)] group transition-colors'
             onClick={() => setOpenDialog(true)}
             >
                 <PlusSquare className="text-[var(--color-fog)] group-hover:text-[var(--color-signal-blue)] transition-colors w-10 h-10 stroke-[1.5px]" />
             </div>
           )}

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="bg-[var(--color-paper)] border-[var(--color-chalk)] rounded-[16px]">
                    <DialogHeader>
                        <DialogTitle className="text-[24px] font-semibold text-[var(--color-carbon)]">Create New Portfolio</DialogTitle>
                        <DialogDescription>
                            <p className="text-[var(--color-pencil)] mt-1">Add a title for your new portfolio site</p>
                            <Input className="my-4 border-[var(--color-chalk)] text-[var(--color-ink)]" 
                            placeholder="Ex. Software Engineer Portfolio"
                            onChange={(e) => setPortfolioTitle(e.target.value)}
                            />
                        </DialogDescription>
                        <div className='flex justify-end gap-3'>
                            <Button onClick={() => setOpenDialog(false)} variant="ghost" className="text-[var(--color-pencil)] hover:bg-[var(--color-mist)] rounded-[36px]">Cancel</Button>
                            <Button 
                                disabled={!portfolioTitle || loading}
                                onClick={() => onCreate()}
                                className="bg-[var(--color-signal-blue)] hover:bg-[var(--color-deep-signal)] text-white rounded-[36px]"
                            >
                                {loading ?
                                <Loader2 className='animate-spin' /> : 'Create'   
                                }
                            </Button>
                        </div>
                        <div className="pt-3 mt-3 border-t border-[var(--color-chalk)]">
                          <button
                            onClick={() => { setOpenDialog(false); navigation('/dashboard/portfolio/new/ai'); }}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2.5 rounded-[36px] text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
                          >
                            <Sparkles size={16} /> Generate with AI instead
                          </button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    );
}

export default AddPortfolio;

import { Loader2, PlusSquare } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from './../../../service/GlobalApi'
import { useUser } from '../../auth.jsx'
import { useNavigate } from 'react-router-dom'

function AddResume({ renderTrigger }) {

    const [openDialog,setOpenDialog]=useState(false)
    const [resumeTitle,setResumeTitle]=useState();
    const {user}=useUser();
    const [loading,setLoading]=useState(false);
    const navigation=useNavigate();
    const onCreate=async()=>{
        setLoading(true)
        const uuid=uuidv4();
        const data={
            data:{
                title:resumeTitle,
                resumeId:uuid,
                userEmail:user?.primaryEmailAddress?.emailAddress,
                userName:user?.fullName
            }
        }

        GlobalApi.CreateNewResume(data).then(resp=>{
            console.log(resp.data.data.documentId);
            if(resp){
                setLoading(false);
                navigation('/dashboard/resume/'+resp.data.data.documentId+"/edit");
            }
        },(error)=>{
            setLoading(false);
        })

    }
  return (
    <div>
        {renderTrigger ? (
            renderTrigger(() => setOpenDialog(true))
        ) : (
            <div className='p-14 py-24 items-center flex justify-center bg-surface-container-lowest rounded-[16px] h-[280px] hover:border-primary-container cursor-pointer border border-outline-variant/30 group transition-colors'
            onClick={() => setOpenDialog(true)}
            >
                <PlusSquare className="text-on-surface-variant group-hover:text-stitch-primary transition-colors w-10 h-10 stroke-[1.5px]" />
            </div>
        )}

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="bg-surface-container-lowest border-outline-variant/30 rounded-[16px]">
                <DialogHeader>
                    <DialogTitle className="text-[24px] font-semibold text-on-surface">Create New Resume</DialogTitle>
                    <DialogDescription>
                        <p className="text-on-surface-variant mt-1">Add a title for your new resume</p>
                        <Input className="my-4 border-outline-variant/50 text-on-surface bg-surface" 
                        placeholder="Ex. Full Stack Developer"
                        onChange={(e)=>setResumeTitle(e.target.value)}
                        />
                    </DialogDescription>
                    <div className='flex justify-end gap-3'>
                        <Button onClick={()=>setOpenDialog(false)} variant="ghost" className="text-on-surface-variant hover:bg-surface-variant rounded-[36px]">Cancel</Button>
                        <Button 
                            disabled={!resumeTitle||loading}
                            onClick={onCreate}
                            className="bg-stitch-primary hover:bg-stitch-primary/90 text-white rounded-[36px]"
                        >
                            {loading ? <Loader2 className='animate-spin' /> : 'Create'}
                        </Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddResume
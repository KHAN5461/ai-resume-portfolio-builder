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
            renderTrigger(() => navigation('/templates'))
        ) : (
            <div className='p-14 py-24 items-center flex justify-center bg-surface-container-lowest rounded-[16px] h-[280px] hover:border-primary-container cursor-pointer border border-outline-variant/30 group transition-colors'
            onClick={()=>navigation('/templates')}
            >
                <PlusSquare className="text-on-surface-variant group-hover:text-stitch-primary transition-colors w-10 h-10 stroke-[1.5px]" />
            </div>
        )}
    </div>
  )
}

export default AddResume
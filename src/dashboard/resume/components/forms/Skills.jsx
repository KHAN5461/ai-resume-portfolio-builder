import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import { Rating } from '@smastrom/react-rating'

import '@smastrom/react-rating/style.css'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import GlobalApi from './../../../../../service/GlobalApi'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { handleFormKeyDown } from '@/lib/keyboard'

function Skills() {

    const {resumeId}=useParams();
    const [loading,setLoading]=useState(false);
    const dispatch = useDispatch();
    const resumeInfo = useSelector(state => state.resume.resumeData);

    const [skillsList,setSkillsList]=useState(() => {
        const sk = resumeInfo?.skills || resumeInfo?.Skills;
        return sk?.length > 0 ? sk : [{
            name:'',
            rating:0
        }];
    });
   
    const handleChange=(index,name,value)=>{
        setSkillsList(prev => {
            const newEntries = [...prev];
            newEntries[index] = { ...newEntries[index], [name]: value };
            return newEntries;
        });
    }

    const AddNewSkills=()=>{
        setSkillsList([...skillsList,{
            name:'',
        rating:0 
        }])
    }
    const RemoveSkills=()=>{
        setSkillsList(skillsList=>skillsList.slice(0,-1))
    }

    const onSave=()=>{

        setLoading(true);
        const data={
            data:{
                skills:skillsList.map(({ id, ...rest }) => rest)
            }
        }

        GlobalApi.UpdateResumeDetail(resumeId,data)
        .then(resp=>{
            console.log(resp);
            setLoading(false);
            toast('Details updated !')
        },(error)=>{
            setLoading(false);
            toast('Server Error, Try again!')
        })
    }

    useEffect(()=>{
        dispatch(setResumeData({
            ...resumeInfo,
            skills:skillsList
        }));
    },[skillsList])
  return (
    <div onKeyDown={handleFormKeyDown} className="form-container">
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Skills</h2>
    <p>Add Your top professional key skills</p>

    <div>
        {skillsList.map((item,index)=>(
            <div className='flex justify-between mb-2 border rounded-lg p-3 '>
                <div>
                    <label className='text-xs'>Name</label>
                    <Input className="w-full"
                    defaultValue={item.name}
                    onChange={(e)=>handleChange(index,'name',e.target.value)} />
                </div>
                <Rating style={{ maxWidth: 120 }} value={item.rating} 
                onChange={(v)=>handleChange(index,'rating',v)}/>

            </div>
        ))}
    </div>
    <div className='flex justify-between'>
            <div className='flex gap-2'>
            <Button variant="outline" onClick={AddNewSkills} className="text-primary"> + Add More Skill</Button>
            <Button variant="outline" onClick={RemoveSkills} className="text-primary"> - Remove</Button>

            </div>
            <Button disabled={loading} onClick={()=>onSave()}>
            {loading?<LoaderCircle className='animate-spin' />:'Save'}    
            </Button>
        </div>
    </div>
    </div>
  )
}

export default Skills
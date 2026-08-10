import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { handleFormKeyDown } from '@/lib/keyboard';

function PersonalDetail({enabledNext}) {

    const params=useParams();
    const dispatch = useDispatch();
    const resumeInfo = useSelector(state => state.resume.resumeData);

    const [formData,setFormData]=useState(resumeInfo || {});
    const [loading,setLoading]=useState(false);
    
    // Sync from Redux only on mount or external changes
    useEffect(()=>{
        if (resumeInfo) setFormData(resumeInfo);
    },[resumeInfo])

    const handleInputChange=(e)=>{
        enabledNext(false)
        const {name,value}=e.target;

        setFormData(prev => ({
            ...prev,
            [name]:value
        }))
    }

    // Debounced sync to Redux
    useEffect(() => {
        const timer = setTimeout(() => {
            if (formData && Object.keys(formData).length > 0) {
                dispatch(setResumeData(formData));
            }
        }, 500);
        return () => clearTimeout(timer); // Cleanup memory leak
    }, [formData, dispatch]);

    const onSave=(e)=>{
        e.preventDefault();
        setLoading(true)
        const data={
            data:formData
        }
        GlobalApi.UpdateResumeDetail(params?.resumeId,data).then(resp=>{
            console.log(resp);
            enabledNext(true);
            setLoading(false);
            toast("Details updated")
        },(error)=>{
            setLoading(false);
        })
        
    }
  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Personal Detail</h2>
        <p>Get Started with the basic information</p>

        <form onSubmit={onSave} onKeyDown={handleFormKeyDown}>
            <div className='grid grid-cols-2 mt-5 gap-3'>
                <div>
                    <label className='text-sm'>First Name</label>
                    <Input name="firstName" value={formData?.firstName || ''} required onChange={handleInputChange}  />
                </div>
                <div>
                    <label className='text-sm'>Last Name</label>
                    <Input name="lastName" required onChange={handleInputChange} 
                    value={formData?.lastName || ''} />
                </div>
                <div className='col-span-2'>
                    <label className='text-sm'>Job Title</label>
                    <Input name="jobTitle" required 
                    value={formData?.jobTitle || ''}
                    onChange={handleInputChange}  />
                </div>
                <div className='col-span-2'>
                    <label className='text-sm'>Address</label>
                    <Input name="address" required 
                    value={formData?.address || ''}
                    onChange={handleInputChange}  />
                </div>
                <div>
                    <label className='text-sm'>Phone</label>
                    <Input name="phone" required 
                    value={formData?.phone || ''}
                    onChange={handleInputChange}  />
                </div>
                <div>
                    <label className='text-sm'>Email</label>
                    <Input name="email" required 
                    value={formData?.email || ''}
                    onChange={handleInputChange}  />
                </div>
            </div>
            <div className='mt-3 flex justify-end'>
                <Button type="submit"
                disabled={loading}>
                    {loading?<LoaderCircle className='animate-spin' />:'Save'}
                    </Button>
            </div>
        </form>
    </div>
  )
}

export default PersonalDetail
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
    <div className='bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm mt-4'>
        <h2 className='font-headline-md font-bold text-on-surface'>Personal Detail</h2>
        <p className='font-body-sm text-on-surface-variant mb-6'>Get Started with the basic information</p>

        <form onSubmit={onSave} onKeyDown={handleFormKeyDown}>
            <div className='grid grid-cols-2 mt-5 gap-3'>
                <div>
                    <label className='font-label-md mb-1.5 block'>First Name</label>
                    <Input name="firstName" value={formData?.firstName || ''} required onChange={handleInputChange}  />
                </div>
                <div>
                    <label className='font-label-md mb-1.5 block'>Last Name</label>
                    <Input name="lastName" required onChange={handleInputChange} 
                    value={formData?.lastName || ''} />
                </div>
                <div className='col-span-2'>
                    <label className='font-label-md mb-1.5 block'>Job Title</label>
                    <Input name="jobTitle" required 
                    value={formData?.jobTitle || ''}
                    onChange={handleInputChange}  />
                </div>
                <div className='col-span-2'>
                    <label className='font-label-md mb-1.5 block'>Address</label>
                    <Input name="address" required 
                    value={formData?.address || ''}
                    onChange={handleInputChange}  />
                </div>
                <div>
                    <label className='font-label-md mb-1.5 block'>Phone</label>
                    <Input name="phone" required 
                    value={formData?.phone || ''}
                    onChange={handleInputChange}  />
                </div>
                <div>
                    <label className='font-label-md mb-1.5 block'>Email</label>
                    <Input name="email" required 
                    value={formData?.email || ''}
                    onChange={handleInputChange}  />
                </div>
            </div>
            <div className='mt-6 flex justify-end'>
                <Button type="submit"
                disabled={loading} className="bg-stitch-primary hover:bg-stitch-primary/90 text-white rounded-xl h-12 px-8 shadow-sm">
                    {loading?<LoaderCircle className='animate-spin' />:'Force Save'}
                    </Button>
            </div>
        </form>
    </div>
  )
}

export default PersonalDetail
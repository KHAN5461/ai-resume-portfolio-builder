import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import RichTextEditor from '../RichTextEditor'
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'
import { LoaderCircle, GripVertical } from 'lucide-react'
import { handleFormKeyDown } from '@/lib/keyboard'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

const formField={
    title:'',
    companyName:'',
    city:'',
    state:'',
    startDate:'',
    endDate:'',
    workSummery:'',
}

function Experience() {
    const dispatch = useDispatch();
    const resumeInfo = useSelector(state => state.resume.resumeData);
    const params=useParams();
    const [loading,setLoading]=useState(false);

    const [experinceList,setExperinceList]=useState(() => {
        const exp = resumeInfo?.Experience || resumeInfo?.experience;
        return exp?.length > 0 ? exp : [];
    });

    const handleChange=(index,event)=>{
        const {name,value}=event.target;
        setExperinceList(prev => {
            const newEntries = [...prev];
            newEntries[index] = { ...newEntries[index], [name]: value };
            return newEntries;
        });
    }

    const AddNewExperience=()=>{
    
        setExperinceList([...experinceList,{
            title:'',
            companyName:'',
            city:'',
            state:'',
            startDate:'',
            endDate:'',
            workSummery:'',
        }])
    }

    const RemoveExperience=()=>{
        setExperinceList(experinceList=>experinceList.slice(0,-1))
    }

    const handleRichTextEditor=(e,name,index)=>{
        setExperinceList(prev => {
            const newEntries = [...prev];
            newEntries[index] = { ...newEntries[index], [name]: e.target.value };
            return newEntries;
        });
    }

    useEffect(()=>{
        dispatch(setResumeData({
            ...resumeInfo,
            Experience:experinceList
        }));
     
    },[experinceList]);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(experinceList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setExperinceList(items);
    };


    const onSave=()=>{
        setLoading(true)
        const data={
            data:{
                Experience:experinceList.map(({ id, ...rest }) => rest)
            }
        }

         console.log(experinceList)

        GlobalApi.UpdateResumeDetail(params?.resumeId,data).then(res=>{
            console.log(res);
            setLoading(false);
            toast('Details updated !')
        },(error)=>{
            setLoading(false);
        })

    }
  return (
    <div onKeyDown={handleFormKeyDown} className="form-container">
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Professional Experience</h2>
        <p>Add Your previous Job experience</p>
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="experience-list">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {experinceList.map((item,index)=>(
                                <Draggable key={item.id || `exp-${index}`} draggableId={item.id || `exp-${index}`} index={index}>
                                    {(provided) => (
                                        <div 
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className='mb-5 group relative'
                                        >
                                            <div 
                                                {...provided.dragHandleProps}
                                                className='absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab text-outline transition-opacity p-1 bg-surface-container rounded-md border border-outline-variant/30 shadow-sm z-10'
                                            >
                                                <GripVertical size={16} />
                                            </div>
                                            <div className='grid grid-cols-2 gap-3 border p-3 rounded-lg bg-surface hover:border-stitch-primary/30 transition-colors'>
                                                <div>
                                                    <label className='text-xs'>Position Title</label>
                                                    <Input name="title" 
                                                    onChange={(event)=>handleChange(index,event)}
                                                    defaultValue={item?.title}
                                                    />
                                                </div>
                                                <div>
                                                    <label className='text-xs'>Company Name</label>
                                                    <Input name="companyName" 
                                                    onChange={(event)=>handleChange(index,event)}
                                                    defaultValue={item?.companyName} />
                                                </div>
                                                <div>
                                                    <label className='text-xs'>City</label>
                                                    <Input name="city" 
                                                    onChange={(event)=>handleChange(index,event)} 
                                                    defaultValue={item?.city}/>
                                                </div>
                                                <div>
                                                    <label className='text-xs'>State</label>
                                                    <Input name="state" 
                                                    onChange={(event)=>handleChange(index,event)}
                                                    defaultValue={item?.state}
                                                     />
                                                </div>
                                                <div>
                                                    <label className='text-xs'>Start Date</label>
                                                    <Input type="date"  
                                                    name="startDate" 
                                                    onChange={(event)=>handleChange(index,event)} 
                                                    defaultValue={item?.startDate}/>
                                                </div>
                                                <div>
                                                    <label className='text-xs'>End Date</label>
                                                    <Input type="date" name="endDate" 
                                                    onChange={(event)=>handleChange(index,event)} 
                                                    defaultValue={item?.endDate}
                                                    />
                                                </div>
                                                <div className='col-span-2'>
                                                   {/* Work Summery  */}
                                                   <RichTextEditor
                                                   index={index}
                                                   defaultValue={item?.workSummery}
                                                   onRichTextEditorChange={(event)=>handleRichTextEditor(event,'workSummery',index)}  />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
        <div className='flex justify-between'>
            <div className='flex gap-2'>
            <Button variant="outline" onClick={AddNewExperience} className="text-primary"> + Add More Experience</Button>
            <Button variant="outline" onClick={RemoveExperience} className="text-primary"> - Remove</Button>

            </div>
            <Button disabled={loading} onClick={()=>onSave()}>
            {loading?<LoaderCircle className='animate-spin' />:'Save'}    
            </Button>
        </div>
        </div>
    </div>
  )
}

export default Experience
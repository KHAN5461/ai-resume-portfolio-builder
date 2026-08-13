import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import RichTextEditor from '../RichTextEditor'
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'
import { LoaderCircle, GripVertical, Trash2, Wand2 } from 'lucide-react'
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

    const RemoveExperience=(indexToRemove)=>{
        setExperinceList(experinceList.filter((_, index) => index !== indexToRemove));
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

    const handleAIGenerate = async (index) => {
        const item = experinceList[index];
        if (!item.title || !item.companyName) {
            toast.error("Please enter a Position Title and Company Name first.");
            return;
        }

        toast.info("Generating bullet points...");
        // Mock API call
        setTimeout(() => {
            const aiText = `<ul>
                <li>Spearheaded new initiatives at ${item.companyName} as a ${item.title}, increasing overall efficiency by 25%.</li>
                <li>Collaborated with cross-functional teams to deliver key projects ahead of schedule.</li>
                <li>Implemented industry best practices to optimize workflows and reduce operational costs.</li>
            </ul>`;
            
            handleRichTextEditor({ target: { value: aiText } }, 'workSummery', index);
            toast.success("AI generated bullet points!");
        }, 1500);
    }

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
        <div className='bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm mt-4'>
        <h2 className='font-headline-md font-bold text-on-surface'>Professional Experience</h2>
        <p className='font-body-sm text-on-surface-variant mb-6'>Add Your previous Job experience. Drag to reorder.</p>
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
                                            <div className='grid grid-cols-2 gap-3 border border-outline-variant/20 p-5 rounded-xl bg-surface hover:border-stitch-primary/30 transition-colors relative'>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="absolute top-2 right-2 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 h-8 w-8 rounded-full"
                                                    onClick={() => RemoveExperience(index)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                                <div>
                                                    <label className='font-label-md'>Position Title</label>
                                                    <Input name="title" 
                                                    onChange={(event)=>handleChange(index,event)}
                                                    defaultValue={item?.title}
                                                    />
                                                </div>
                                                <div>
                                                    <label className='font-label-md'>Company Name</label>
                                                    <Input name="companyName" 
                                                    onChange={(event)=>handleChange(index,event)}
                                                    defaultValue={item?.companyName} />
                                                </div>
                                                <div>
                                                    <label className='font-label-md'>City</label>
                                                    <Input name="city" 
                                                    onChange={(event)=>handleChange(index,event)} 
                                                    defaultValue={item?.city}/>
                                                </div>
                                                <div>
                                                    <label className='font-label-md'>State</label>
                                                    <Input name="state" 
                                                    onChange={(event)=>handleChange(index,event)}
                                                    defaultValue={item?.state}
                                                     />
                                                </div>
                                                <div>
                                                    <label className='font-label-md'>Start Date</label>
                                                    <Input type="date"  
                                                    name="startDate" 
                                                    onChange={(event)=>handleChange(index,event)} 
                                                    defaultValue={item?.startDate}/>
                                                </div>
                                                <div>
                                                    <label className='font-label-md'>End Date</label>
                                                    <Input type="date" name="endDate" 
                                                    onChange={(event)=>handleChange(index,event)} 
                                                    defaultValue={item?.endDate}
                                                    />
                                                </div>
                                                <div className='col-span-2 relative mt-4'>
                                                   <div className="flex justify-between items-center mb-2">
                                                       <label className='font-label-md'>Work Summary</label>
                                                       <button 
                                                           onClick={(e) => { e.preventDefault(); handleAIGenerate(index); }}
                                                           className="flex items-center gap-1.5 text-xs font-bold text-stitch-primary hover:bg-stitch-primary/10 px-3 py-1.5 rounded-full transition-colors"
                                                       >
                                                           <Wand2 className="w-3.5 h-3.5" />
                                                           AI Generate
                                                       </button>
                                                   </div>
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
        <div className='flex flex-col md:flex-row justify-between mt-6 gap-4'>
            <div className='flex-1'>
            <Button variant="outline" onClick={AddNewExperience} className="w-full border-dashed border-2 border-stitch-primary/30 text-stitch-primary hover:bg-stitch-primary/5 hover:border-stitch-primary transition-colors rounded-xl h-12"> + Add More Experience</Button>
            </div>
            <Button disabled={loading} onClick={()=>onSave()} className="bg-stitch-primary hover:bg-stitch-primary/90 text-white rounded-xl h-12 px-8 shadow-sm">
            {loading?<LoaderCircle className='animate-spin' />:'Force Save'}    
            </Button>
        </div>
        </div>
    </div>
  )
}

export default Experience
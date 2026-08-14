import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import RichTextEditor from '../RichTextEditor'
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'
import { LoaderCircle, GripVertical, Trash2, Plus, ArrowLeft, ArrowRight } from 'lucide-react'
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

function Experience({handleNext, handlePrev}) {
    const dispatch = useDispatch();
    const resumeInfo = useSelector(state => state.resume.resumeData);
    const params=useParams();
    const [loading,setLoading]=useState(false);
    const [expandedIndex, setExpandedIndex] = useState(0);

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
    
        const newIndex = experinceList.length;
        setExperinceList([...experinceList,{
            title:'',
            companyName:'',
            city:'',
            state:'',
            startDate:'',
            endDate:'',
            workSummery:'',
        }]);
        setExpandedIndex(newIndex);
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

        GlobalApi.UpdateResumeDetail(params?.resumeId,data).then(res=>{
            setLoading(false);
            toast('Details updated !')
            if (handleNext) handleNext();
        },(error)=>{
            setLoading(false);
        })

    }
  return (
    <div onKeyDown={handleFormKeyDown} className="form-container">
        <div>
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
                                            {expandedIndex === index ? (
                                                <div className='grid grid-cols-2 gap-3 border border-outline-variant/20 p-5 rounded-xl bg-surface hover:border-stitch-primary/30 transition-colors relative'>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="absolute top-2 right-2 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 h-8 w-8 rounded-full"
                                                        onClick={(e) => { e.stopPropagation(); RemoveExperience(index); }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="absolute top-2 right-12 text-on-surface-variant h-8 rounded-full"
                                                        onClick={() => setExpandedIndex(-1)}
                                                    >
                                                        Collapse
                                                    </Button>
                                                    <div>
                                                        <label className='font-label-md'>Position Title</label>
                                                        <Input name="title" 
                                                        onChange={(event)=>handleChange(index,event)}
                                                        defaultValue={item?.title}
                                                        className="focus:ring-2 focus:ring-stitch-primary shadow-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className='font-label-md'>Company Name</label>
                                                        <Input name="companyName" 
                                                        onChange={(event)=>handleChange(index,event)}
                                                        defaultValue={item?.companyName} 
                                                        className="focus:ring-2 focus:ring-stitch-primary shadow-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className='font-label-md'>City</label>
                                                        <Input name="city" 
                                                        onChange={(event)=>handleChange(index,event)} 
                                                        defaultValue={item?.city}
                                                        className="focus:ring-2 focus:ring-stitch-primary shadow-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className='font-label-md'>State</label>
                                                        <Input name="state" 
                                                        onChange={(event)=>handleChange(index,event)}
                                                        defaultValue={item?.state}
                                                        className="focus:ring-2 focus:ring-stitch-primary shadow-sm"
                                                         />
                                                    </div>
                                                    <div>
                                                        <label className='font-label-md'>Start Date</label>
                                                        <Input type="date"  
                                                        name="startDate" 
                                                        onChange={(event)=>handleChange(index,event)} 
                                                        defaultValue={item?.startDate}
                                                        className="focus:ring-2 focus:ring-stitch-primary shadow-sm"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className='font-label-md'>End Date</label>
                                                        <Input type="date" name="endDate" 
                                                        onChange={(event)=>handleChange(index,event)} 
                                                        defaultValue={item?.endDate}
                                                        className="focus:ring-2 focus:ring-stitch-primary shadow-sm"
                                                        />
                                                    </div>
                                                    <div className='col-span-2 relative mt-4'>
                                                       <RichTextEditor
                                                       index={index}
                                                       defaultValue={item?.workSummery}
                                                       onRichTextEditorChange={(event)=>handleRichTextEditor(event,'workSummery',index)}  />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div 
                                                    className="flex justify-between items-center bg-surface border border-outline-variant/30 p-4 rounded-xl shadow-sm hover:border-stitch-primary/30 transition-colors cursor-pointer"
                                                    onClick={() => setExpandedIndex(index)}
                                                >
                                                    <div>
                                                        <h3 className="font-label-lg font-bold text-on-surface">{item?.title || 'New Position'}</h3>
                                                        <p className="font-body-sm text-on-surface-variant">{item?.companyName || 'Company Name'} {item?.startDate ? `• ${item.startDate}` : ''}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setExpandedIndex(index); }}>Edit</Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            className="text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 h-8 w-8 rounded-full"
                                                            onClick={(e) => { e.stopPropagation(); RemoveExperience(index); }}
                                                        >
                                                            <Trash2 size={16} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
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
            <div className='flex justify-between items-center mt-6'>
                <div className='flex gap-2'>
                    <Button variant="outline" onClick={AddNewExperience} className="text-stitch-primary hover:text-stitch-primary border-stitch-primary/30 hover:bg-stitch-primary/5 rounded-xl h-10 px-4">
                        <Plus className='w-4 h-4 mr-2' /> Add More Experience
                    </Button>
                </div>
                
                <div className='flex gap-2'>
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handlePrev} 
                        disabled={!handlePrev}
                        className="h-10 px-6 rounded-xl text-on-surface-variant hover:text-stitch-primary hover:bg-surface-variant"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Prev
                    </Button>
                    <Button disabled={loading} onClick={()=>onSave()} className="bg-stitch-primary hover:bg-stitch-primary/90 text-white rounded-xl h-10 px-6 shadow-sm">
                        {loading?<LoaderCircle className='animate-spin mr-2' />:null}
                        Next <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Experience
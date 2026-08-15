import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import { LoaderCircle, GripVertical, Trash2, ArrowLeft, ArrowRight } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { handleFormKeyDown } from '@/lib/keyboard'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

function Education({handleNext, handlePrev}) {

  const [loading,setLoading]=useState(false);
  const dispatch = useDispatch();
  const resumeInfo = useSelector(state => state.resume.resumeData);
  const params=useParams();
  const [expandedIndex, setExpandedIndex] = useState(0);
  
  const [educationalList,setEducationalList]=useState(() => {
    const edu = resumeInfo?.education || resumeInfo?.Education;
    return edu?.length > 0 ? edu : [
      {
        universityName:'',
        degree:'',
        major:'',
        startDate:'',
        endDate:'',
        description:''
      }
    ];
  });

  const handleChange=(event,index)=>{
    const {name,value}=event.target;
    setEducationalList(prev => {
      const newEntries = [...prev];
      newEntries[index] = { ...newEntries[index], [name]: value };
      return newEntries;
    });
  }

  const AddNewEducation=()=>{
    const newIndex = educationalList.length;
    setEducationalList([...educationalList,
      {
        universityName:'',
        degree:'',
        major:'',
        startDate:'',
        endDate:'',
        description:''
      }
    ]);
    setExpandedIndex(newIndex);
  }
  const RemoveEducation=(indexToRemove)=>{
    setEducationalList(educationalList.filter((_, index) => index !== indexToRemove));
  }
  const onSave=()=>{
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        if (handleNext) handleNext();
    }, 10);
  }

  useEffect(()=>{
    dispatch(setResumeData({
      ...resumeInfo,
      education:educationalList
    }));
  },[educationalList])

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(educationalList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setEducationalList(items);
  };
  return (
    <div onKeyDown={handleFormKeyDown} className='p-2 md:p-4'>
      <h2 className='font-headline-md font-bold text-on-surface'>Education</h2>
    <p className='font-body-sm text-on-surface-variant mb-6'>Add Your educational details</p>

    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="education-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {educationalList.map((item,index)=>(
                <Draggable key={item.id || `edu-${index}`} draggableId={item.id || `edu-${index}`} index={index}>
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
                              onClick={(e) => { e.stopPropagation(); RemoveEducation(index); }}
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
                          <div className='col-span-2'>
                            <label className='font-label-md'>University Name</label>
                            <Input name="universityName" 
                            onChange={(e)=>handleChange(e,index)}
                            defaultValue={item?.universityName}
                            className="focus:ring-2 focus:ring-stitch-primary shadow-sm"
                            />
                          </div>
                          <div>
                            <label className='font-label-md'>Degree</label>
                            <Input name="degree" 
                            onChange={(e)=>handleChange(e,index)}
                            defaultValue={item?.degree} 
                            className="focus:ring-2 focus:ring-stitch-primary shadow-sm"
                            />
                          </div>
                          <div>
                            <label className='font-label-md'>Major</label>
                            <Input name="major" 
                            onChange={(e)=>handleChange(e,index)}
                            defaultValue={item?.major} 
                            className="focus:ring-2 focus:ring-stitch-primary shadow-sm"
                            />
                          </div>
                          <div>
                            <label className='font-label-md'>Start Date</label>
                            <Input type="date" name="startDate" 
                            onChange={(e)=>handleChange(e,index)}
                            defaultValue={item?.startDate} 
                            className="focus:ring-2 focus:ring-stitch-primary shadow-sm"
                            />
                          </div>
                          <div>
                            <label className='font-label-md'>End Date</label>
                            <Input type="date" name="endDate" 
                            onChange={(e)=>handleChange(e,index)}
                            defaultValue={item?.endDate} 
                            className="focus:ring-2 focus:ring-stitch-primary shadow-sm"
                            />
                          </div>
                          <div className='col-span-2'>
                            <label className='font-label-md'>Description</label>
                            <Textarea name="description" 
                            onChange={(e)=>handleChange(e,index)}
                            defaultValue={item?.description} 
                            className="focus:ring-2 focus:ring-stitch-primary shadow-sm"
                            />
                          </div>
                        </div>
                      ) : (
                        <div 
                            className="flex justify-between items-center bg-surface border border-outline-variant/30 p-4 rounded-xl shadow-sm hover:border-stitch-primary/30 transition-colors cursor-pointer"
                            onClick={() => setExpandedIndex(index)}
                        >
                            <div>
                                <h3 className="font-label-lg font-bold text-on-surface">{item?.universityName || 'New Education'}</h3>
                                <p className="font-body-sm text-on-surface-variant">{item?.degree || 'Degree'} {item?.startDate ? `• ${item.startDate}` : ''}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setExpandedIndex(index); }}>Edit</Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 h-8 w-8 rounded-full"
                                    onClick={(e) => { e.stopPropagation(); RemoveEducation(index); }}
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
                    <Button variant="outline" onClick={AddNewEducation} className="text-stitch-primary hover:text-stitch-primary border-stitch-primary/30 hover:bg-stitch-primary/5 rounded-xl h-10 px-4">
                        + Add More Education
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
  )
}

export default Education
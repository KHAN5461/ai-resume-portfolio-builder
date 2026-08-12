import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import { LoaderCircle, GripVertical } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'
import { handleFormKeyDown } from '@/lib/keyboard'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

function Education() {

  const [loading,setLoading]=useState(false);
  const dispatch = useDispatch();
  const resumeInfo = useSelector(state => state.resume.resumeData);
  const params=useParams();
  
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
    setEducationalList([...educationalList,
      {
        universityName:'',
        degree:'',
        major:'',
        startDate:'',
        endDate:'',
        description:''
      }
    ])
  }
  const RemoveEducation=()=>{
    setEducationalList(educationalList=>educationalList.slice(0,-1))

  }
  const onSave=()=>{
    setLoading(true)
    const data={
      data:{
        education:educationalList.map(({ id, ...rest }) => rest)
      }
    }

    GlobalApi.UpdateResumeDetail(params.resumeId,data).then(resp=>{
      console.log(resp);
      setLoading(false)
      toast('Details updated !')
    },(error)=>{
      setLoading(false);
      toast('Server Error, Please try again!')
    })

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
    <div onKeyDown={handleFormKeyDown} className="form-container">
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
      <h2 className='font-bold text-lg'>Education</h2>
    <p>Add Your educational details</p>

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
                      <div className='grid grid-cols-2 gap-3 border p-3 rounded-lg bg-surface hover:border-stitch-primary/30 transition-colors'>
                        <div className='col-span-2'>
                          <label>University Name</label>
                          <Input name="universityName" 
                          onChange={(e)=>handleChange(e,index)}
                          defaultValue={item?.universityName}
                          />
                        </div>
                        <div>
                          <label>Degree</label>
                          <Input name="degree" 
                          onChange={(e)=>handleChange(e,index)}
                          defaultValue={item?.degree} />
                        </div>
                        <div>
                          <label>Major</label>
                          <Input name="major" 
                          onChange={(e)=>handleChange(e,index)}
                          defaultValue={item?.major} />
                        </div>
                        <div>
                          <label>Start Date</label>
                          <Input type="date" name="startDate" 
                          onChange={(e)=>handleChange(e,index)}
                          defaultValue={item?.startDate} />
                        </div>
                        <div>
                          <label>End Date</label>
                          <Input type="date" name="endDate" 
                          onChange={(e)=>handleChange(e,index)}
                          defaultValue={item?.endDate} />
                        </div>
                        <div className='col-span-2'>
                          <label>Description</label>
                          <Textarea name="description" 
                          onChange={(e)=>handleChange(e,index)}
                          defaultValue={item?.description} />
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
            <Button variant="outline" onClick={AddNewEducation} className="text-primary"> + Add More Education</Button>
            <Button variant="outline" onClick={RemoveEducation} className="text-primary"> - Remove</Button>

            </div>
            <Button disabled={loading} onClick={()=>onSave()}>
            {loading?<LoaderCircle className='animate-spin' />:'Save'}    
            </Button>
        </div>
    </div>
    </div>
  )
}

export default Education
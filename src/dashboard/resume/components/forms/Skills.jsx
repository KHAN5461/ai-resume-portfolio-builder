import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoaderCircle, X, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { setResumeData } from '@/store/resumeSlice';
import GlobalApi from './../../../../../service/GlobalApi'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { handleFormKeyDown } from '@/lib/keyboard'

const SUGGESTIONS = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", 
    "Java", "C++", "SQL", "MongoDB", "PostgreSQL",
    "Docker", "Kubernetes", "AWS", "Azure", "GCP",
    "Figma", "UI/UX Design", "Project Management", "Agile", "Scrum",
    "Machine Learning", "Data Analysis", "SEO", "Marketing", "Sales"
];

function Skills({handleNext, handlePrev}) {
    const {resumeId} = useParams();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const resumeInfo = useSelector(state => state.resume.resumeData);

    const [skillsList, setSkillsList] = useState(() => {
        const sk = resumeInfo?.skills || resumeInfo?.Skills || [];
        return sk.map(s => typeof s === 'string' ? { name: s, rating: 0 } : s);
    });

    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        if (value.trim().length > 0) {
            const matches = SUGGESTIONS.filter(s => 
                s.toLowerCase().includes(value.toLowerCase()) && 
                !skillsList.some(skill => skill.name.toLowerCase() === s.toLowerCase())
            );
            setSuggestions(matches.slice(0, 5));
        } else {
            setSuggestions([]);
        }
    }

    const addSkill = (name) => {
        if (!name.trim()) return;
        
        if (skillsList.some(s => s.name.toLowerCase() === name.toLowerCase())) {
            setInputValue("");
            setSuggestions([]);
            return;
        }

        const newSkills = [...skillsList, { name: name.trim(), rating: 100 }];
        setSkillsList(newSkills);
        setInputValue("");
        setSuggestions([]);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill(inputValue);
        }
    }

    const removeSkill = (indexToRemove) => {
        setSkillsList(skillsList.filter((_, index) => index !== indexToRemove));
    }

    const onSave = () => {
        setLoading(true);
        const data = {
            data: {
                skills: skillsList.map(({ id, ...rest }) => rest)
            }
        }

        GlobalApi.UpdateResumeDetail(resumeId, data)
        .then(resp => {
            setLoading(false);
            toast.success('Skills updated!');
            if (handleNext) handleNext();
        }).catch(error => {
            setLoading(false);
            toast.error('Server Error, Try again!');
        });
    }

    useEffect(() => {
        dispatch(setResumeData({
            ...resumeInfo,
            skills: skillsList
        }));
    }, [skillsList]);

    return (
        <div onKeyDown={handleFormKeyDown} className="p-2 md:p-4">
                <h2 className='font-headline-md font-bold text-on-surface flex items-center gap-2'>
                    <Sparkles className="w-5 h-5 text-stitch-primary" />
                    Smart Skills
                </h2>
                <p className='font-body-sm text-on-surface-variant mb-6'>Type a skill and hit enter, or select from suggestions.</p>

                <div className="relative mb-6">
                    <Input 
                        placeholder="e.g. JavaScript, Product Management..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="h-14 font-body-md text-[16px] shadow-sm pl-4 pr-24 rounded-xl border-outline-variant/50 focus:border-stitch-primary focus:ring-1 focus:ring-stitch-primary"
                    />
                    <div className="absolute right-2 top-2">
                        <Button 
                            onClick={() => addSkill(inputValue)}
                            disabled={!inputValue.trim()}
                            className="h-10 px-4 bg-stitch-primary/10 text-stitch-primary hover:bg-stitch-primary/20 rounded-lg font-label-md"
                        >
                            Add
                        </Button>
                    </div>

                    {suggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-full mt-2 bg-surface rounded-xl shadow-lg border border-outline-variant/20 z-50 overflow-hidden">
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => addSkill(suggestion)}
                                    className="w-full text-left px-4 py-3 hover:bg-surface-variant text-on-surface font-body-md transition-colors border-b border-outline-variant/10 last:border-0"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-surface-container-low/50 rounded-xl border border-outline-variant/20 mb-8">
                    {skillsList.length === 0 ? (
                        <p className="text-on-surface-variant font-body-sm w-full text-center py-8">No skills added yet.</p>
                    ) : (
                        skillsList.map((item, index) => (
                            <div 
                                key={index} 
                                className="group flex items-center gap-2 bg-white border border-outline-variant/30 pl-3 pr-1 py-1.5 rounded-full shadow-sm hover:border-stitch-primary/40 transition-colors"
                            >
                                <span className="font-label-md text-[14px] text-on-surface">{item.name}</span>
                                <button 
                                    onClick={() => removeSkill(index)}
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-red-50 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className='flex justify-between items-center mt-8 pt-6 border-t border-outline-variant/30'>
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handlePrev} 
                        disabled={!handlePrev}
                        className="h-12 px-6 rounded-xl text-on-surface-variant hover:text-stitch-primary hover:bg-surface-variant"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Prev
                    </Button>
                    <Button disabled={loading} onClick={() => onSave()} className="bg-stitch-primary hover:bg-stitch-primary/90 text-white rounded-xl h-12 px-8 shadow-sm">
                        {loading ? <LoaderCircle className='animate-spin mr-2' /> : null}
                        Save <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
    )
}

export default Skills
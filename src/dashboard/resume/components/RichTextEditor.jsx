import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { Brain, LoaderCircle, Sparkles } from 'lucide-react';
import React, { useContext, useState } from 'react'
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnLink, BtnNumberedList, BtnStrikeThrough, BtnStyles, BtnUnderline, Editor, EditorProvider, HtmlButton, Separator, Toolbar } from 'react-simple-wysiwyg'
import { AIChatSession } from './../../../../service/AIModal';
import { toast } from 'sonner';
const GENERATE_PROMPT = `Based on the position title "{positionTitle}" at "{companyName}", give me 5-7 professional bullet points for a resume. Focus on achievements and technical skills. Do not include experience level. Return ONLY valid HTML ul and li tags, without markdown wrappers.`;

const REWRITE_PROMPT = `You are an expert resume writer. I have the following raw experience notes for my role as "{positionTitle}" at "{companyName}":

{existingContent}

Please REWRITE these notes into 3-5 high-impact, professional resume bullet points. Use strong action verbs, quantify achievements where possible (STAR method), and ensure it sounds impressive for ATS systems. 
Return ONLY valid HTML ul and li tags, without markdown wrappers or conversational text.`;

function RichTextEditor({onRichTextEditorChange,index,defaultValue}) {
    const [value,setValue]=useState(defaultValue);
    const resumeInfo = useSelector(state => state.resume.resumeData);
    const [loading,setLoading]=useState(false);
    
    const GenerateSummeryFromAI=async()=>{
      const exp = resumeInfo?.Experience?.[index];
      if(!exp?.title)
      {
        toast('Please Add Position Title first.');
        return ;
      }
      
      setLoading(true);
      try {
        const hasExistingContent = value && value.length > 20 && value !== '<ul><li></li></ul>';
        let prompt = '';
        
        if (hasExistingContent) {
          // Rewrite Mode
          prompt = REWRITE_PROMPT
            .replace('{positionTitle}', exp.title || 'Professional')
            .replace('{companyName}', exp.companyName || 'a company')
            .replace('{existingContent}', value);
        } else {
          // Generate Mode
          prompt = GENERATE_PROMPT
            .replace('{positionTitle}', exp.title || 'Professional')
            .replace('{companyName}', exp.companyName || 'a company');
        }
        
        const result=await AIChatSession.sendMessage(prompt);
        let resp=result.response.text();
        
        // Cleanup markdown if AI accidentally includes it
        resp = resp.replace(/```html/g, '').replace(/```/g, '').trim();
        
        setValue(resp);
        // We need to trigger the parent's onChange manually since we bypassed the DOM event
        onRichTextEditorChange({ target: { name: 'workSummery', value: resp } });
        
        toast.success(hasExistingContent ? 'Rewrote experience successfully!' : 'Generated experience successfully!');
      } catch (e) {
        toast.error('Failed to generate. Please try again.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  
    return (
    <div>
      <div className='flex justify-between items-center my-2'>
        <label className='font-label-md'>Work Experience Details</label>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className="bg-gradient-to-r from-stitch-primary to-purple-600 text-white border-0 hover:from-stitch-primary/90 hover:to-purple-600/90 hover:scale-105 transition-all shadow-sm flex gap-2"
        >
          {loading ? <LoaderCircle className='animate-spin h-4 w-4'/> : (value && value.length > 20 && value !== '<ul><li></li></ul>' ? <Brain className='h-4 w-4'/> : <Sparkles className='h-4 w-4'/>)} 
          {loading ? 'Generating...' : (value && value.length > 20 && value !== '<ul><li></li></ul>' ? 'Rewrite with AI' : 'Generate from scratch')}
        </Button>
      </div>
    <EditorProvider>
      <Editor value={value} onChange={(e)=>{
        setValue(e.target.value);
        onRichTextEditorChange(e)
      }}>
         <Toolbar>
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <BtnStrikeThrough />
          <Separator />
          <BtnNumberedList />
          <BtnBulletList />
          <Separator />
          <BtnLink />
         
         
        </Toolbar>
      </Editor>
      </EditorProvider>
    </div>
  )
}

export default RichTextEditor
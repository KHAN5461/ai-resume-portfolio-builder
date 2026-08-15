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
    const resumeInfo = useSelector(state => state.resume.present.resumeData);
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
        
        const result = await AIChatSession.sendMessageStream(prompt);
        let fullText = "";
        
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          fullText += chunkText;
          // Cleanup markdown progressively
          let cleanText = fullText.replace(/```html/g, '').replace(/```/g, '');
          setValue(cleanText);
        }
        
        let finalCleanText = fullText.replace(/```html/g, '').replace(/```/g, '').trim();
        setValue(finalCleanText);
        // We need to trigger the parent's onChange manually since we bypassed the DOM event
        onRichTextEditorChange({ target: { name: 'workSummery', value: finalCleanText } });
        
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
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-stitch-primary/50 focus-within:border-stitch-primary transition-all">
    <EditorProvider>
      <Editor value={value} onChange={(e)=>{
        setValue(e.target.value);
        onRichTextEditorChange(e)
      }} className="min-h-[150px] p-4 text-on-surface bg-transparent focus:outline-none">
         <Toolbar className="bg-surface-variant/30 border-b border-outline-variant/30 px-2 py-1 flex gap-1 flex-wrap items-center">
          <div className="flex gap-1 bg-surface rounded-lg p-1 shadow-sm border border-outline-variant/20">
            <BtnBold className="hover:bg-primary-container hover:text-on-primary-container rounded-md p-1" />
            <BtnItalic className="hover:bg-primary-container hover:text-on-primary-container rounded-md p-1" />
            <BtnUnderline className="hover:bg-primary-container hover:text-on-primary-container rounded-md p-1" />
            <BtnStrikeThrough className="hover:bg-primary-container hover:text-on-primary-container rounded-md p-1" />
          </div>
          <Separator className="mx-1 h-6 bg-outline-variant/30 w-px" />
          <div className="flex gap-1 bg-surface rounded-lg p-1 shadow-sm border border-outline-variant/20">
            <BtnNumberedList className="hover:bg-primary-container hover:text-on-primary-container rounded-md p-1" />
            <BtnBulletList className="hover:bg-primary-container hover:text-on-primary-container rounded-md p-1" />
          </div>
          <Separator className="mx-1 h-6 bg-outline-variant/30 w-px" />
          <div className="flex gap-1 bg-surface rounded-lg p-1 shadow-sm border border-outline-variant/20">
            <BtnLink className="hover:bg-primary-container hover:text-on-primary-container rounded-md p-1" />
          </div>
        </Toolbar>
      </Editor>
      </EditorProvider>
    </div>
    </div>
  )
}

export default RichTextEditor
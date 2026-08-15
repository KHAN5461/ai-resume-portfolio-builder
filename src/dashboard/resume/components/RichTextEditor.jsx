import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { Brain, LoaderCircle, Sparkles } from 'lucide-react';
import React, { useContext, useState } from 'react'
import { BtnBold, BtnBulletList, BtnClearFormatting, BtnItalic, BtnLink, BtnNumberedList, BtnStrikeThrough, BtnStyles, BtnUnderline, Editor, EditorProvider, HtmlButton, Separator, Toolbar } from 'react-simple-wysiwyg'
import { AIChatSession } from './../../../service/AIModal';
import { toast } from 'sonner';
import { calculateLocalAtsScore } from '../../../lib/atsCalculator';

const GENERATE_PROMPT = `Based on the position title "{positionTitle}" at "{companyName}", give me 5-7 professional bullet points for a resume. Focus on achievements and technical skills. Do not include experience level. Return ONLY valid HTML ul and li tags, without markdown wrappers.`;

const REWRITE_PROMPT = `You are an expert resume writer. I have the following raw experience notes for my role as "{positionTitle}" at "{companyName}":

{existingContent}

Please REWRITE these notes into 3-5 high-impact, professional resume bullet points. Use strong action verbs, quantify achievements where possible (STAR method), and ensure it sounds impressive for ATS systems. 
Return ONLY valid HTML ul and li tags, without markdown wrappers or conversational text.`;

function RichTextEditor({onRichTextEditorChange,index,defaultValue}) {
    const [value,setValue]=useState(defaultValue);
    const [draftValue, setDraftValue] = useState(null);
    const resumeInfo = useSelector(state => state.resume.present.resumeData);
    const [loading,setLoading]=useState(false);
    const [loadingFeedback, setLoadingFeedback] = useState('');
    
    const GenerateSummeryFromAI=async(customPrompt = null)=>{
      const exp = resumeInfo?.Experience?.[index];
      if(!exp?.title)
      {
        toast('Please Add Position Title first.');
        return ;
      }
      
      setLoading(true);
      setLoadingFeedback('Writing draft...');
      try {
        const hasExistingContent = value && value.length > 20 && value !== '<ul><li></li></ul>';
        let basePrompt = '';
        
        if (customPrompt) {
           basePrompt = `You are an expert resume writer. Rewrite the following resume experience bullet points based on this instruction: "${customPrompt}". Keep it professional and use the STAR method. Return ONLY valid HTML ul and li tags, without markdown wrappers.\n\nCurrent text:\n${draftValue || value}`;
        } else if (hasExistingContent) {
          // Rewrite Mode
          basePrompt = REWRITE_PROMPT
            .replace('{positionTitle}', exp.title || 'Professional')
            .replace('{companyName}', exp.companyName || 'a company')
            .replace('{existingContent}', value);
        } else {
          // Generate Mode
          basePrompt = GENERATE_PROMPT
            .replace('{positionTitle}', exp.title || 'Professional')
            .replace('{companyName}', exp.companyName || 'a company');
        }

        let fullText = await executeAIPrompt(basePrompt);

        // Continuous Quality Gate (ATS Check)
        setLoadingFeedback('Analyzing ATS keywords...');
        const tempResumeInfo = { ...resumeInfo, Experience: [{ title: exp.title, summery: fullText }] };
        const atsResult = calculateLocalAtsScore(tempResumeInfo);
        
        if (atsResult.score < 50 && atsResult.missingKeywords.length > 0) {
            setLoadingFeedback('Adding missing keywords...');
            const refinementPrompt = `The following resume bullet points have a low ATS score because they are missing the following action verbs: ${atsResult.missingKeywords.join(', ')}. Please rewrite the bullet points to naturally include some of these keywords. Return ONLY valid HTML ul and li tags, without markdown wrappers.\n\nText:\n${fullText}`;
            fullText = await executeAIPrompt(refinementPrompt);
        }
        
        setDraftValue(fullText.trim());
        toast.success('Draft generated! Review and refine below.');
      } catch (e) {
        toast.error('Failed to generate. Please try again.');
        console.error(e);
      } finally {
        setLoading(false);
        setLoadingFeedback('');
      }
    }

    const executeAIPrompt = async (prompt) => {
        const result = await AIChatSession.sendMessageStream(prompt);
        let fullText = "";
        
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          fullText += chunkText;
        }
        
        return fullText.replace(/```html/g, '').replace(/```/g, '');
    }

    const acceptDraft = () => {
        setValue(draftValue);
        onRichTextEditorChange({ target: { name: 'workSummery', value: draftValue } });
        setDraftValue(null);
    }
  
    return (
    <div>
      <div className='flex justify-between items-center my-2'>
        <label className='font-label-md'>Work Experience Details</label>
        <div className="flex items-center gap-2">
            {loadingFeedback && <span className="text-xs text-on-surface-variant animate-pulse italic">{loadingFeedback}</span>}
            <Button 
            variant="outline" 
            size="sm" 
            onClick={() => GenerateSummeryFromAI()}
            disabled={loading || draftValue !== null}
            className="bg-gradient-to-r from-stitch-primary to-purple-600 text-white border-0 hover:from-stitch-primary/90 hover:to-purple-600/90 hover:scale-105 transition-all shadow-sm flex gap-2"
            >
            {loading ? <LoaderCircle className='animate-spin h-4 w-4'/> : (value && value.length > 20 && value !== '<ul><li></li></ul>' ? <Brain className='h-4 w-4'/> : <Sparkles className='h-4 w-4'/>)} 
            {loading ? 'Generating...' : (value && value.length > 20 && value !== '<ul><li></li></ul>' ? 'Rewrite with AI' : 'Generate from scratch')}
            </Button>
        </div>
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

    {/* Differential Editing & Refinement Toolbar */}
    {draftValue && (
        <div className="mt-4 p-4 bg-surface-variant/20 border border-stitch-primary/30 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-3">
                <span className="font-label-md text-stitch-primary flex items-center gap-2"><Sparkles className="w-4 h-4" /> AI Draft Review</span>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-8 text-xs hover:bg-red-50 hover:text-red-600" onClick={() => setDraftValue(null)}>Discard</Button>
                    <Button size="sm" className="h-8 text-xs bg-stitch-primary hover:bg-stitch-primary/90 text-white" onClick={acceptDraft}>Accept & Merge</Button>
                </div>
            </div>
            
            <div className="bg-surface rounded-lg p-3 border border-outline-variant/30 text-sm mb-4" dangerouslySetInnerHTML={{ __html: draftValue }}></div>

            <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-on-surface-variant">Refine:</span>
                <Button size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={() => GenerateSummeryFromAI('Make it more technical and focused on hard skills')} disabled={loading}>More Technical</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={() => GenerateSummeryFromAI('Make it more concise and impactful')} disabled={loading}>More Concise</Button>
                <Button size="sm" variant="outline" className="h-7 text-xs rounded-full" onClick={() => GenerateSummeryFromAI('Focus on leadership and cross-functional collaboration')} disabled={loading}>Focus on Leadership</Button>
            </div>
        </div>
    )}

    </div>
  )
}

export default RichTextEditor
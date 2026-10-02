import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import { Brain, LoaderCircle, Sparkles, Check, X, RotateCcw } from 'lucide-react';
import React, { useState } from 'react';
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar
} from 'react-simple-wysiwyg';
import { AIChatSession, getDeterministicFallback } from './../../../service/AIModal';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
import { calculateLocalAtsScore } from '../../../lib/atsCalculator';

const GENERATE_PROMPT = `Based on the position title "{positionTitle}" at "{companyName}", give me 4-5 professional, metric-driven bullet points for a resume. Focus on achievements, leadership, and technical skills using the STAR methodology. Return ONLY valid HTML ul and li tags, without markdown wrappers.`;

const REWRITE_PROMPT = `You are a Fortune 500 executive resume writer. Rewrite these draft bullet points for the position "{positionTitle}" at "{companyName}":

{existingContent}

Use strong action verbs (e.g. Architected, Spearheaded, Optimized), quantify impacts with realistic KPIs/metrics, and align with ATS scanning benchmarks.
Return ONLY valid HTML ul and li tags, without markdown wrappers or conversational preamble.`;

function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
  const [value, setValue] = useState(defaultValue || '<ul><li></li></ul>');
  const [draftValue, setDraftValue] = useState(null);
  const resumeInfo = useSelector((state) => state.resume.present.resumeData);
  const [loading, setLoading] = useState(false);
  const [loadingFeedback, setLoadingFeedback] = useState('');

  const GenerateSummeryFromAI = async (customInstruction = null) => {
    const exp = resumeInfo?.Experience?.[index];
    const positionTitle = exp?.title || resumeInfo?.jobTitle || 'Specialist';
    const companyName = exp?.companyName || 'Organization';

    setLoading(true);
    setLoadingFeedback('Drafting bullet points...');

    try {
      const hasContent = value && value.length > 25 && value !== '<ul><li></li></ul>';
      let prompt = '';

      if (customInstruction) {
        prompt = `Rewrite these resume bullet points according to: "${customInstruction}". Keep strong metrics and STAR format. Return ONLY valid HTML ul and li tags.\n\nCurrent:\n${draftValue || value}`;
      } else if (hasContent) {
        prompt = REWRITE_PROMPT
          .replace('{positionTitle}', positionTitle)
          .replace('{companyName}', companyName)
          .replace('{existingContent}', value);
      } else {
        prompt = GENERATE_PROMPT
          .replace('{positionTitle}', positionTitle)
          .replace('{companyName}', companyName);
      }

      let generatedHtml = '';
      try {
        const result = await AIChatSession.sendMessage(prompt, 'resume');
        const raw = result.response.text();
        generatedHtml = raw.replace(/```html/gi, '').replace(/```/g, '').trim();
      } catch (err) {
        console.warn('AI call error, generating deterministic fallback:', err);
        generatedHtml = getDeterministicFallback(prompt);
      }

      // ATS score keyword validation
      setLoadingFeedback('Evaluating ATS keyword coverage...');
      const tempResumeInfo = { ...resumeInfo, Experience: [{ title: positionTitle, summery: generatedHtml }] };
      const ats = calculateLocalAtsScore(tempResumeInfo);

      if (ats.score < 50 && ats.missingKeywords?.length > 0) {
        setLoadingFeedback('Optimizing action verbs...');
        const refinePrompt = `Enhance the following bullet points to naturally incorporate some of these high-impact keywords: ${ats.missingKeywords.slice(0, 5).join(', ')}. Return ONLY valid HTML ul and li tags.\n\n${generatedHtml}`;
        try {
          const refineResult = await AIChatSession.sendMessage(refinePrompt, 'resume');
          generatedHtml = refineResult.response.text().replace(/```html/gi, '').replace(/```/g, '').trim();
        } catch (e) {
          // Keep existing generatedHtml
        }
      }

      setDraftValue(generatedHtml);
      toast.success('AI suggestions generated! Review below.');
    } catch (e) {
      toast.error('Could not complete generation. Please try again.');
    } finally {
      setLoading(false);
      setLoadingFeedback('');
    }
  };

  const acceptDraft = () => {
    setValue(draftValue);
    onRichTextEditorChange({ target: { name: 'workSummery', value: draftValue } });
    setDraftValue(null);
    toast.success('Merged suggestions into editor');
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center my-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          Work Responsibilities & Achievements
        </label>
        <div className="flex items-center gap-2">
          {loadingFeedback && (
            <span className="text-xs text-slate-500 animate-pulse font-mono">
              {loadingFeedback}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => GenerateSummeryFromAI()}
            disabled={loading || draftValue !== null}
            className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 border-0 text-xs h-8 px-3 gap-1.5 shadow-sm"
          >
            {loading ? (
              <LoaderCircle className="animate-spin h-3.5 w-3.5" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            )}
            {loading
              ? 'Generating...'
              : value && value.length > 25 && value !== '<ul><li></li></ul>'
              ? 'Rewrite with AI'
              : 'Generate Points'}
          </Button>
        </div>
      </div>

      <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900">
        <EditorProvider>
          <Editor
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onRichTextEditorChange(e);
            }}
            className="min-h-[160px] p-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
          >
            <Toolbar className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 px-2 py-1.5 flex gap-1 flex-wrap items-center">
              <div className="flex gap-1">
                <BtnBold className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded p-1" />
                <BtnItalic className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded p-1" />
                <BtnUnderline className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded p-1" />
              </div>
              <Separator className="mx-1 h-4 bg-slate-300 dark:bg-slate-700 w-px" />
              <div className="flex gap-1">
                <BtnBulletList className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded p-1" />
                <BtnNumberedList className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded p-1" />
              </div>
              <Separator className="mx-1 h-4 bg-slate-300 dark:bg-slate-700 w-px" />
              <BtnLink className="hover:bg-slate-200 dark:hover:bg-slate-700 rounded p-1" />
            </Toolbar>
          </Editor>
        </EditorProvider>
      </div>

      {draftValue && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Draft Proposal
            </span>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs text-slate-500 hover:text-red-600 gap-1"
                onClick={() => setDraftValue(null)}
              >
                <X className="w-3.5 h-3.5" /> Discard
              </Button>
              <Button
                size="sm"
                className="h-7 text-xs bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 gap-1"
                onClick={acceptDraft}
              >
                <Check className="w-3.5 h-3.5" /> Apply Draft
              </Button>
            </div>
          </div>

          <div
            className="bg-white dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(draftValue) }}
          />

          <div className="flex flex-wrap gap-1.5 items-center pt-1">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Tweak:</span>
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-[11px] px-2.5 rounded-full"
              onClick={() => GenerateSummeryFromAI('Emphasize hard technical skills, tools, and technical leadership')}
              disabled={loading}
            >
              More Technical
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-[11px] px-2.5 rounded-full"
              onClick={() => GenerateSummeryFromAI('Highlight measurable KPIs, percentages, cost reductions, and revenue')}
              disabled={loading}
            >
              More Metrics
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-[11px] px-2.5 rounded-full"
              onClick={() => GenerateSummeryFromAI('Make it more concise and high impact')}
              disabled={loading}
            >
              More Concise
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RichTextEditor;
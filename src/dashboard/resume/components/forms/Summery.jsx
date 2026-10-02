import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDispatch, useSelector } from 'react-redux';
import { updatePersonalInfo } from '@/store/profileSlice';
import React, { useEffect, useState } from 'react';
import { LoaderCircle, Sparkles, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { AIChatSession, extractCleanJson, getDeterministicFallback } from '@/service/AIModal';
import { motion, AnimatePresence } from 'framer-motion';

const promptTemplate = "Job Title: {jobTitle}. Based on this job title, give me a list of summaries for 3 experience levels (Fresher, Mid Level, Senior Level) in 3-4 lines in an array format. Return ONLY a valid JSON array of objects with 'summary' and 'experience_level' fields.";

function Summery({ enabledNext, handleNext, handlePrev }) {
  const dispatch = useDispatch();
  const resumeInfo = useSelector(state => state.resume.present.resumeData);
  const [summery, setSummery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState(null);

  useEffect(() => {
    if (resumeInfo?.summery || resumeInfo?.summary) {
      setSummery(resumeInfo.summery || resumeInfo.summary);
    }
  }, [resumeInfo]);

  useEffect(() => {
    if (summery) {
      dispatch(updatePersonalInfo({ summery }));
    }
  }, [summery, dispatch]);

  const GenerateSummeryFromAI = async () => {
    setLoading(true);
    const jobTitle = resumeInfo?.jobTitle || 'Software Engineer';
    const PROMPT = promptTemplate.replace('{jobTitle}', jobTitle);

    try {
      const result = await AIChatSession.sendMessage(PROMPT, 'resume');
      const rawText = result.response.text();
      let parsed = extractCleanJson(rawText);

      if (!parsed || !Array.isArray(parsed)) {
        parsed = getDeterministicFallback(PROMPT);
      }

      setAiGenerateSummeryList(parsed);
      toast.success('Generated suggestions!');
    } catch (err) {
      console.warn('AI summary error, loading fallback options:', err);
      setAiGenerateSummeryList(getDeterministicFallback(PROMPT));
      toast.success('Suggestions ready!');
    } finally {
      setLoading(false);
    }
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(updatePersonalInfo({ summery }));
    setTimeout(() => {
      setLoading(false);
      toast.success('Summary saved');
      if (enabledNext) enabledNext(true);
      if (handleNext) handleNext();
    }, 50);
  };

  return (
    <div>
      <div className="p-2 md:p-4">
        <h2 className="font-headline-md font-bold text-on-surface">Professional Summary</h2>
        <p className="font-body-sm text-on-surface-variant mb-6">
          Highlight your key achievements, core strengths, and career direction.
        </p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label className="font-label-md font-medium text-slate-800 dark:text-slate-200">
              Summary Statement
            </label>
            <Button
              variant="outline"
              onClick={GenerateSummeryFromAI}
              type="button"
              size="sm"
              disabled={loading}
              className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 border-0 transition-all shadow-sm flex gap-2 font-medium"
            >
              {loading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 text-amber-400" />
              )}
              {loading ? 'Generating...' : 'Enhance with AI'}
            </Button>
          </div>

          <Textarea
            className="mt-3 min-h-[140px] text-sm leading-relaxed border-slate-300 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-slate-900"
            required
            placeholder="Write a brief professional overview or generate one tailored to your role..."
            value={summery}
            onChange={(e) => setSummery(e.target.value)}
            maxLength={700}
          />

          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-400">
              ATS Recommendation: 3-5 concise, metric-oriented sentences.
            </span>
            <span className={`text-xs font-mono ${summery?.length > 650 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
              {summery?.length || 0} / 700
            </span>
          </div>

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={!handlePrev}
              className="h-10 px-5 rounded-lg text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Previous
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 rounded-lg h-10 px-6 shadow-sm"
            >
              {loading && <LoaderCircle className="animate-spin mr-2 h-4 w-4" />}
              Save & Next <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>

      <AnimatePresence>
        {aiGeneratedSummeryList && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 px-2 md:px-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Select Tailored Summary Level
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAiGenerateSummeryList(null)}
                className="text-xs text-slate-400 hover:text-slate-600 h-7"
              >
                Dismiss
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              {aiGeneratedSummeryList.map((item, index) => {
                const isActive = summery === item.summary;
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                    key={index}
                    className={`p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'border-slate-900 bg-slate-50 dark:bg-slate-800/80 dark:border-slate-100 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.experience_level}
                      </span>
                      {isActive && (
                        <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Currently Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      {item.summary}
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <Button
                        type="button"
                        size="sm"
                        variant={isActive ? "secondary" : "default"}
                        onClick={() => {
                          setSummery(item.summary);
                          toast.success(`Applied ${item.experience_level} summary!`);
                        }}
                        className="text-xs h-7 px-3 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900"
                      >
                        {isActive ? 'Re-Apply' : 'Replace My Summary'}
                      </Button>

                      {summery && !isActive && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSummery(prev => `${prev}\n\n${item.summary}`.trim());
                            toast.success(`Appended ${item.experience_level} summary!`);
                          }}
                          className="text-xs h-7 px-3 border-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                        >
                          Append to Current
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Summery;
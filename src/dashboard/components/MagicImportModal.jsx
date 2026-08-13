import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from './../../../service/GlobalApi';
import { useUser } from '../../auth.jsx';
import { useNavigate } from 'react-router-dom';
import { AIChatSession } from '../../../service/AIModal';
import { toast } from 'sonner';

const MAGIC_IMPORT_PROMPT = `You are a professional resume writer and data architect. 
The user will provide raw bio, project details, or an old resume text. 

Your task is to extract, rewrite professional bullet points using metric-driven achievements, and output ONLY a valid JSON object matching the exact schema below. Do NOT include markdown code block wrappers (\`\`\`json).

{
  "title": "Magic Imported Resume",
  "themeColor": "#6366f1",
  "firstName": "",
  "lastName": "",
  "jobTitle": "",
  "address": "",
  "phone": "",
  "email": "",
  "summary": "",
  "experience": [
    {
      "title": "",
      "companyName": "",
      "city": "",
      "state": "",
      "startDate": "",
      "endDate": "",
      "currentlyWorking": false,
      "workSummary": "<ul><li>...</li></ul>"
    }
  ],
  "education": [
    {
      "universityName": "",
      "startDate": "",
      "endDate": "",
      "degree": "",
      "major": "",
      "description": ""
    }
  ],
  "skills": [
    {
      "name": "",
      "rating": 100
    }
  ]
}

Here is the raw text to parse:
{rawText}`;

function MagicImportModal({ renderTrigger }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [rawText, setRawText] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();

  const handleImport = async () => {
    if (!rawText.trim()) return;
    setLoading(true);

    try {
      // 1. Generate JSON with Gemini
      const prompt = MAGIC_IMPORT_PROMPT.replace('{rawText}', rawText);
      const result = await AIChatSession.sendMessage(prompt);
      let responseText = result.response.text();
      
      // Clean up response if it contains markdown code blocks
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsedData = JSON.parse(responseText);

      // 2. Create in Strapi DB
      const uuid = uuidv4();
      const payload = {
        data: {
          title: parsedData.title || "Magic Imported Resume",
          resumeId: uuid,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName,
          themeColor: parsedData.themeColor || "#6366f1",
          firstName: parsedData.firstName || "",
          lastName: parsedData.lastName || "",
          jobTitle: parsedData.jobTitle || "",
          address: parsedData.address || "",
          phone: parsedData.phone || "",
          email: parsedData.email || "",
          summary: parsedData.summary || "",
          experience: parsedData.experience || [],
          education: parsedData.education || [],
          skills: parsedData.skills || []
        }
      };

      const resp = await GlobalApi.CreateNewResume(payload);
      
      if (resp && resp.data.data.documentId) {
        toast.success("Magic Import successful!");
        setOpenDialog(false);
        navigation('/dashboard/resume/' + resp.data.data.documentId + "/edit");
        
        // Popup asking if they want a portfolio too (simulate for V1)
        setTimeout(() => {
          toast('Resume created! Generate a Portfolio next?', {
            action: {
              label: 'Generate',
              onClick: () => console.log('Future: Auto-gen portfolio logic')
            },
          });
        }, 1500);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to parse text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {renderTrigger ? (
        renderTrigger(() => setOpenDialog(true))
      ) : null}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-surface-container-lowest border-outline-variant/30 rounded-2xl max-w-2xl p-0 overflow-hidden">
          <DialogHeader className="p-6 border-b border-outline-variant/20 bg-surface">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-on-surface">
              <div className="w-10 h-10 rounded-full bg-stitch-primary/10 flex items-center justify-center text-stitch-primary">
                <Wand2 size={24} />
              </div>
              Magic Import
            </DialogTitle>
            <DialogDescription className="text-on-surface-variant mt-2">
              Our AI will instantly structure messy data into a perfect, ATS-ready format.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6">
            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-outline-variant/20 pb-2">
              <button className="px-4 py-2 font-label-md text-stitch-primary border-b-2 border-stitch-primary transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">content_paste</span>
                Paste Text
              </button>
              <button className="px-4 py-2 font-label-md text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed" title="Coming soon">
                <span className="material-symbols-outlined text-[18px]">link</span>
                LinkedIn URL
              </button>
              <button className="px-4 py-2 font-label-md text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2 opacity-50 cursor-not-allowed" title="Coming soon">
                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                Upload PDF
              </button>
            </div>

            <div className="my-4">
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full h-[250px] p-4 bg-surface text-on-surface border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-stitch-primary/50 focus:border-stitch-primary outline-none resize-none custom-scrollbar font-body-sm shadow-inner transition-all placeholder:text-outline"
                placeholder="Paste your raw LinkedIn dump, old resume text, or bio here..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={() => setOpenDialog(false)} variant="ghost" className="rounded-full text-on-surface-variant hover:bg-surface-variant">Cancel</Button>
              <div className="relative group">
                <div className={`absolute -inset-1 rounded-full bg-gradient-to-r from-stitch-primary to-purple-600 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse ${loading || !rawText ? 'hidden' : ''}`}></div>
                <Button 
                  disabled={!rawText || loading}
                  onClick={handleImport}
                  className="relative bg-stitch-primary hover:bg-stitch-primary/90 text-white rounded-full flex items-center gap-2 px-8 h-10 shadow-md transition-all active:scale-95"
                >
                  {loading ? <Loader2 className='animate-spin' /> : <><Wand2 size={16} /> Extract & Generate</>}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MagicImportModal;

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
        <DialogContent className="bg-surface border-outline-variant/30 rounded-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Wand2 className="text-stitch-primary" />
              Magic Import
            </DialogTitle>
            <DialogDescription className="text-on-surface-variant mt-2">
              Paste your messy LinkedIn dump, old resume, or a bio below. Our AI will instantly structure it into a perfect, ATS-ready JSON payload.
            </DialogDescription>
            
            <div className="my-4">
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full h-[250px] p-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl focus:ring-2 focus:ring-stitch-primary outline-none resize-none custom-scrollbar"
                placeholder="Paste your raw text here..."
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button onClick={() => setOpenDialog(false)} variant="ghost" className="rounded-full">Cancel</Button>
              <Button 
                disabled={!rawText || loading}
                onClick={handleImport}
                className="bg-stitch-primary hover:bg-stitch-primary/90 text-white rounded-full flex items-center gap-2 px-6"
              >
                {loading ? <Loader2 className='animate-spin' /> : <><Wand2 size={16} /> Extract & Generate</>}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MagicImportModal;

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, LayoutTemplate } from 'lucide-react';
import HeroForm from './forms/HeroForm';
import AboutForm from './forms/AboutForm';
import ProjectsForm from './forms/ProjectsForm';
import SkillsForm from './forms/SkillsForm';
import ContactForm from './forms/ContactForm';
import { Link, useParams } from 'react-router-dom';

export default function PortfolioFormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const { portfolioId } = useParams();

  return (
    <div>
      <div className='flex justify-between items-center mb-5'>
        <div className='flex gap-5'>
          <Link to={'/dashboard'}>
            <Button><LayoutTemplate/> Theme</Button>
          </Link>
        </div>
        <div className='flex gap-2'>
          {activeFormIndex > 1 && (
            <Button size="sm" onClick={() => setActiveFormIndex(activeFormIndex - 1)}>
              <ArrowLeft />
            </Button>
          )}
          <Button 
            disabled={activeFormIndex >= 5} // 5 total forms
            className="flex gap-2" size="sm" 
            onClick={() => setActiveFormIndex(activeFormIndex + 1)}
          >
            Next <ArrowRight />
          </Button>
        </div>
      </div>

      {/* Forms Pagination */}
      {activeFormIndex === 1 && <HeroForm />}
      {activeFormIndex === 2 && <AboutForm />}
      {activeFormIndex === 3 && <ProjectsForm />}
      {activeFormIndex === 4 && <SkillsForm />}
      {activeFormIndex === 5 && <ContactForm />}
    </div>
  );
}

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { updatePortfolioData } from '@/store/portfolioSlice';

const ContactForm = () => {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.present.portfolios[portfolioId]);
  
  if (!portfolioData) return null;
  const contact = portfolioData.contactSection || { heading: "", subheading: "", email: "", socialLinks: [] };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updatePortfolioData({ id: portfolioId, data: { contactSection: { ...contact, [name]: value } } }));
  };

  return (
    <div className='space-y-6'>
      <div className="space-y-4">
         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Information</h4>
         
         <div className="space-y-1.5">
           <label className='text-[13px] font-semibold text-gray-700 dark:text-gray-300'>Heading</label>
           <Input name="heading" value={contact.heading || ""} onChange={handleChange} placeholder="e.g. Get in touch" className="h-9 text-sm" />
         </div>
         
         <div className="space-y-1.5">
           <label className='text-[13px] font-semibold text-gray-700 dark:text-gray-300'>Subheading</label>
           <Input name="subheading" value={contact.subheading || ""} onChange={handleChange} placeholder="e.g. My inbox is always open." className="h-9 text-sm" />
         </div>
         
         <div className="space-y-1.5">
           <label className='text-[13px] font-semibold text-gray-700 dark:text-gray-300'>Email Address</label>
           <Input name="email" value={contact.email || ""} onChange={handleChange} placeholder="e.g. hello@example.com" className="h-9 text-sm" />
         </div>
      </div>
    </div>
  );
}

export default React.memo(ContactForm);

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { updatePortfolioData } from '@/store/portfolioSlice';

const ContactForm = () => {
  const { portfolioId } = useParams();
  const dispatch = useDispatch();
  const portfolioData = useSelector((state) => state.portfolio.portfolios[portfolioId]);
  
  if (!portfolioData) return null;
  const contact = portfolioData.contactSection || { heading: "", subheading: "", email: "", socialLinks: [] };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updatePortfolioData({ id: portfolioId, data: { contactSection: { ...contact, [name]: value } } }));
  };

  return (
    <div className='p-5 shadow-lg rounded-lg border-t-indigo-500 border-t-4 mt-10 bg-white'>
      <h2 className='font-bold text-lg'>Contact Section</h2>
      <p>Tell visitors how to reach you</p>

      <div className='grid grid-cols-1 gap-4 mt-5'>
        <div>
          <label className='text-sm font-semibold'>Heading</label>
          <Input name="heading" value={contact.heading || ""} onChange={handleChange} placeholder="e.g. Get in touch" />
        </div>
        <div>
          <label className='text-sm font-semibold'>Subheading</label>
          <Input name="subheading" value={contact.subheading || ""} onChange={handleChange} placeholder="e.g. My inbox is always open." />
        </div>
        <div>
          <label className='text-sm font-semibold'>Email Address</label>
          <Input name="email" value={contact.email || ""} onChange={handleChange} placeholder="e.g. hello@example.com" />
        </div>
      </div>
    </div>
  );
}

export default React.memo(ContactForm);

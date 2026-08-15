import React from 'react';
import { useParams } from 'react-router-dom';
import SharedThemeBuilder from '@/components/custom/SharedThemeBuilder';

export default function PortfolioThemeBuilder() {
    const { portfolioId } = useParams();
    return <SharedThemeBuilder type="portfolio" documentId={portfolioId} />;
}

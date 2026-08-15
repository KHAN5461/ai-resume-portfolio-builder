import React from 'react';
import { useParams } from 'react-router-dom';
import SharedThemeBuilder from '@/components/custom/SharedThemeBuilder';

export default function ThemeBuilder() {
    const { resumeId } = useParams();
    return <SharedThemeBuilder type="resume" documentId={resumeId} />;
}

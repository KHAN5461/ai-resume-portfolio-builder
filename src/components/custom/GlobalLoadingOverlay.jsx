import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsAnyLoading } from '../../store/loadingSlice';

const GlobalLoadingOverlay = () => {
  const isAnyLoading = useSelector(selectIsAnyLoading);

  if (!isAnyLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-stitch-primary z-[9999] animate-pulse" />
  );
};

export default GlobalLoadingOverlay;

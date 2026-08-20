import React from 'react';
import Header from '../components/custom/Header';

function Home() {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <Header />
      <iframe 
        src="/prismo/index.html" 
        className="w-full flex-grow border-none"
        title="Prismo Landing Page"
      />
    </div>
  );
}

export default Home;

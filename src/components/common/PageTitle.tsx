import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export function PageTitle({ title, subtitle }: PageTitleProps): JSX.Element {
  return (
    <div className="text-center mb-12 space-y-6">
      <div className="w-px h-20 bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent mx-auto" />
      
      <h1 className="text-4xl font-light tracking-wider text-white/90">
        <span className="font-mono text-indigo-400">&lt;</span>
        {title}
        <span className="font-mono text-indigo-400">/&gt;</span>
      </h1>
      
      {subtitle && (
        <p className="text-white/50 font-light">{subtitle}</p>
      )}
    </div>
  );
} 

import React from 'react';
import { Holiday, WidgetConfig } from '../types';

interface WidgetPreviewProps {
  holiday: Holiday | null;
  config: WidgetConfig;
}

export const WidgetPreview: React.FC<WidgetPreviewProps> = ({ holiday, config }) => {
  if (!holiday) {
    return (
      <div className="w-full aspect-square max-w-[280px] bg-slate-100 rounded-[32px] flex items-center justify-center text-slate-400 text-sm p-8 text-center border-2 border-dashed border-slate-200">
        Add a holiday to see widget preview
      </div>
    );
  }

  const getThemeStyles = () => {
    switch (config.theme) {
      case 'dark': return 'bg-slate-900 text-white';
      case 'light': return 'bg-white text-slate-900 shadow-xl';
      case 'glass': return 'glass text-slate-900 shadow-xl';
      default: return 'bg-white';
    }
  };

  const getFontSize = () => {
    switch (config.fontSize) {
      case 'sm': return 'text-2xl';
      case 'base': return 'text-4xl';
      case 'lg': return 'text-5xl';
      case 'xl': return 'text-6xl';
      default: return 'text-4xl';
    }
  };

  const days = Math.max(0, Math.floor((new Date(holiday.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className={`w-full aspect-square max-w-[280px] rounded-[40px] p-6 flex flex-col justify-between overflow-hidden relative ${getThemeStyles()}`}>
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-3xl mb-1">{holiday.emoji}</span>
          <span className="text-xs font-bold uppercase tracking-widest opacity-60">{holiday.category}</span>
        </div>
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${config.accentColor}20`, color: config.accentColor }}
        >
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: config.accentColor }} />
        </div>
      </div>

      <div className="relative z-10 mt-auto">
        <h4 className="text-sm font-semibold opacity-70 mb-1 line-clamp-1">{holiday.name}</h4>
        <div className="flex items-baseline gap-1">
          <span className={`${getFontSize()} font-black leading-none`}>{days}</span>
          <span className="text-sm font-bold opacity-60">DAYS</span>
        </div>
        {config.showSeconds && (
           <div className="mt-2 h-1 w-full bg-black/5 rounded-full overflow-hidden">
             <div className="h-full animate-[progress_10s_linear_infinite]" style={{ backgroundColor: config.accentColor, width: '60%' }} />
           </div>
        )}
      </div>

      {/* Decorative Background */}
      <div 
        className="absolute bottom-0 right-0 w-32 h-32 -mr-12 -mb-12 rounded-full opacity-20 blur-2xl"
        style={{ backgroundColor: holiday.color }}
      />
      <div 
        className="absolute top-0 left-0 w-24 h-24 -ml-8 -mt-8 rounded-full opacity-10 blur-xl"
        style={{ backgroundColor: config.accentColor }}
      />
    </div>
  );
};

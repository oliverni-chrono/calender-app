
import React, { useEffect, useState } from 'react';
import { Holiday } from '../types';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

interface HolidayCardProps {
  holiday: Holiday;
  onClick: () => void;
}

export const HolidayCard: React.FC<HolidayCardProps> = ({ holiday, onClick }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number } | null>(null);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const target = new Date(holiday.date);
      const diff = target.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setTimeLeft({ days, hours });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 60000);
    return () => clearInterval(timer);
  }, [holiday.date]);

  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-slate-100 overflow-hidden"
    >
      <div 
        className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-10 group-hover:scale-125 transition-transform duration-500"
        style={{ backgroundColor: holiday.color }}
      />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl" role="img" aria-label="emoji">{holiday.emoji}</span>
            <span 
              className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `${holiday.color}20`, color: holiday.color }}
            >
              {holiday.category}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
            {holiday.name}
          </h3>
          <div className="flex items-center text-slate-500 text-sm gap-2">
            <Calendar size={14} />
            <span>{new Date(holiday.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-end justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-black text-slate-900 leading-none">{timeLeft?.days || 0}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Days</p>
          </div>
          <div className="h-8 w-[1px] bg-slate-100" />
          <div className="text-center">
            <p className="text-3xl font-black text-slate-900 leading-none">{timeLeft?.hours || 0}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Hours</p>
          </div>
        </div>
        
        <div className="bg-slate-50 p-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );
};

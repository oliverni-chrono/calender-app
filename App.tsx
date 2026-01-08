
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Settings, Home, Calendar, ArrowLeft, Trash2, Sparkles, Wand2, Globe, Heart, Sun, MapPin, Loader2, Check } from 'lucide-react';
import { Holiday, Screen, WidgetConfig, CelebrationIdea, GlobalHoliday } from './types';
import { INITIAL_HOLIDAYS, DEFAULT_WIDGET_CONFIG, CATEGORIES, COLORS } from './constants';
import { Button } from './components/Button';
import { HolidayCard } from './components/HolidayCard';
import { WidgetPreview } from './components/WidgetPreview';
import { getCelebrationIdeas, getGlobalHolidays } from './services/geminiService';

const generateId = () => {
  try {
    return crypto.randomUUID();
  } catch (e) {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
};

const COUNTRIES = [
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵' },
  { name: 'Brazil', code: 'BR', flag: '🇧🇷' },
  { name: 'France', code: 'FR', flag: '🇫🇷' },
  { name: 'India', code: 'IN', flag: '🇮🇳' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'South Korea', code: 'KR', flag: '🇰🇷' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪' },
];

const UPLIFTING_MESSAGES = [
  "Your next big adventure is just around the corner!",
  "Moments turn into memories, and memories last a lifetime.",
  "The best part of travel is the anticipation.",
  "Make every countdown count!",
  "Life is a journey, enjoy the stops along the way.",
];

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    const saved = localStorage.getItem('holiday_horizon_data');
    return saved ? JSON.parse(saved) : INITIAL_HOLIDAYS;
  });
  const [selectedHolidayId, setSelectedHolidayId] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [widgetConfig, setWidgetConfig] = useState<WidgetConfig>(() => {
    const saved = localStorage.getItem('holiday_horizon_config');
    return saved ? JSON.parse(saved) : DEFAULT_WIDGET_CONFIG;
  });
  const [aiIdeas, setAiIdeas] = useState<CelebrationIdea[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);

  // Global Holiday State
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [globalHolidays, setGlobalHolidays] = useState<GlobalHoliday[]>([]);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Persistence
  useEffect(() => {
    localStorage.setItem('holiday_horizon_data', JSON.stringify(holidays));
  }, [holidays]);

  useEffect(() => {
    localStorage.setItem('holiday_horizon_config', JSON.stringify(widgetConfig));
  }, [widgetConfig]);

  const selectedHoliday = useMemo(() => 
    holidays.find(h => h.id === selectedHolidayId) || null,
  [holidays, selectedHolidayId]);

  const sortedHolidays = useMemo(() => {
    return [...holidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [holidays]);

  const nextHoliday = useMemo(() => {
    const now = new Date().getTime();
    const upcoming = sortedHolidays.filter(h => new Date(h.date).getTime() > now);
    return upcoming.length > 0 ? upcoming[0] : sortedHolidays[0];
  }, [sortedHolidays]);

  const message = useMemo(() => 
    UPLIFTING_MESSAGES[Math.floor(Math.random() * UPLIFTING_MESSAGES.length)], 
  []);

  const handleAddHoliday = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newHoliday: Holiday = {
      id: generateId(),
      name: formData.get('name') as string,
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as any,
      color: formData.get('color') as string,
      emoji: formData.get('emoji') as string || '🎉',
    };
    setHolidays(prev => [...prev, newHoliday]);
    setScreen('list');
  };

  const addGlobalHoliday = (gh: GlobalHoliday) => {
    const newHoliday: Holiday = {
      id: generateId(),
      name: gh.name,
      date: new Date(gh.date).toISOString(),
      description: gh.description,
      category: 'Holiday',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      emoji: gh.emoji,
    };
    setHolidays(prev => [...prev, newHoliday]);
    setAddedIds(prev => new Set([...prev, gh.name + gh.date]));
  };

  const deleteHoliday = (id: string) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
    setIsConfirmingDelete(false);
    setSelectedHolidayId(null);
    setScreen('list');
  };

  const fetchIdeas = async () => {
    if (!selectedHoliday) return;
    setIsLoadingIdeas(true);
    const ideas = await getCelebrationIdeas(selectedHoliday.name);
    setAiIdeas(ideas);
    setIsLoadingIdeas(false);
  };

  const fetchCountryHolidays = async (countryName: string) => {
    setSelectedCountry(countryName);
    setIsLoadingGlobal(true);
    const results = await getGlobalHolidays(countryName);
    setGlobalHolidays(results);
    setIsLoadingGlobal(false);
  };

  const navigateToList = () => {
    setIsConfirmingDelete(false);
    setSelectedHolidayId(null);
    setScreen('list');
  };

  const renderWelcome = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Playful background elements */}
      <div className="absolute top-10 left-10 text-indigo-200 animate-bounce delay-100"><Sun size={48} /></div>
      <div className="absolute top-20 right-20 text-pink-200 animate-pulse"><Heart size={32} /></div>
      <div className="absolute bottom-20 left-1/4 text-sky-200 animate-bounce delay-500"><MapPin size={40} /></div>
      <div className="absolute bottom-10 right-10 text-amber-200 animate-pulse delay-200"><Globe size={56} /></div>

      <div className="relative z-10 space-y-8 max-w-lg animate-in fade-in zoom-in duration-700">
        <div className="inline-block relative">
          <div className="absolute -inset-4 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="relative bg-white p-8 rounded-[3.5rem] shadow-2xl border-4 border-indigo-50">
            <Calendar className="w-20 h-20 text-indigo-600" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Holiday <span className="text-indigo-600">Horizon</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium italic">
            "{message}"
          </p>
        </div>

        <div className="space-y-4 w-full">
          <Button fullWidth size="lg" className="h-16 text-lg" onClick={() => setScreen('list')}>
            <Calendar className="mr-2" size={20} />
            View Your Holidays
          </Button>
          <Button fullWidth variant="secondary" size="lg" className="h-16 text-lg" onClick={() => setScreen('global')}>
            <Globe className="mr-2" size={20} />
            Explore Global Holidays
          </Button>
        </div>
        
        <p className="text-slate-400 text-sm font-medium">
          Start counting down to your next joyful moment.
        </p>
      </div>
    </div>
  );

  const renderGlobal = () => (
    <div className="min-h-screen bg-white pb-32">
      <header className="sticky top-0 z-30 glass px-6 py-6 flex items-center gap-4 border-b border-slate-100">
        <button onClick={() => setScreen('welcome')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">Global Explorer</h2>
      </header>

      <div className="p-6 space-y-8 max-w-4xl mx-auto">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <MapPin size={20} />
            <h3 className="text-lg font-bold uppercase tracking-wider text-xs">Pick a Country</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {COUNTRIES.map(c => (
              <button
                key={c.code}
                onClick={() => fetchCountryHolidays(c.name)}
                className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${
                  selectedCountry === c.name 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl scale-105' 
                  : 'bg-slate-50 text-slate-700 border-transparent hover:border-slate-200'
                }`}
              >
                <span className="text-3xl">{c.flag}</span>
                <span className="text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">{c.name}</span>
              </button>
            ))}
          </div>
        </section>

        {selectedCountry && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Holidays in {selectedCountry}</h3>
              {isLoadingGlobal && <Loader2 size={24} className="text-indigo-600 animate-spin" />}
            </div>

            {isLoadingGlobal ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-slate-50 rounded-[2rem] animate-pulse" />
                ))}
              </div>
            ) : globalHolidays.length > 0 ? (
              <div className="space-y-4">
                {globalHolidays.map((gh, i) => {
                  const isAdded = addedIds.has(gh.name + gh.date);
                  return (
                    <div key={i} className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center">
                          {gh.emoji}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">{gh.name}</h4>
                          <p className="text-indigo-600 font-bold text-sm uppercase tracking-wide">
                            {new Date(gh.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-slate-500 text-sm mt-1 line-clamp-1">{gh.description}</p>
                        </div>
                      </div>
                      <Button 
                        variant={isAdded ? "secondary" : "primary"}
                        onClick={() => !isAdded && addGlobalHoliday(gh)}
                        className="shrink-0 rounded-2xl"
                        size="sm"
                        disabled={isAdded}
                      >
                        {isAdded ? (
                          <><Check size={16} className="mr-1" /> Added</>
                        ) : (
                          <><Plus size={16} className="mr-1" /> Add</>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Sparkles size={48} className="mx-auto mb-4 opacity-20" />
                <p>Select a country to discover its major holidays</p>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );

  const renderList = () => (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 glass px-6 py-6 mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your Holidays</h2>
          <p className="text-slate-500 text-sm">{holidays.length} upcoming events</p>
        </div>
      </header>

      <div className="px-6 space-y-4">
        {sortedHolidays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedHolidays.map(holiday => (
              <HolidayCard 
                key={holiday.id} 
                holiday={holiday} 
                onClick={() => {
                  setSelectedHolidayId(holiday.id);
                  setIsConfirmingDelete(false);
                  setScreen('detail');
                  setAiIdeas([]);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <Calendar size={64} className="mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-600">No holidays yet</p>
            <p className="text-sm text-slate-400">Click the + button to add your first one!</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAdd = () => (
    <div className="min-h-screen bg-white p-6 pb-32">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={navigateToList} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">Add Holiday</h2>
      </header>

      <form onSubmit={handleAddHoliday} className="space-y-6 max-w-lg mx-auto">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Name</label>
          <input 
            required
            name="name"
            type="text" 
            placeholder="e.g. Hawaii Vacation 🏝️" 
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 text-slate-900 font-medium transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Date</label>
            <input 
              required
              name="date"
              type="date" 
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 text-slate-900 font-medium transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Emoji</label>
            <input 
              name="emoji"
              type="text" 
              placeholder="🎉" 
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 text-slate-900 font-medium transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <label key={cat} className="flex-1 min-w-[100px]">
                <input type="radio" name="category" value={cat} className="sr-only peer" defaultChecked={cat === 'Trip'} />
                <div className="px-4 py-3 text-center rounded-xl bg-slate-50 border-2 border-transparent peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-checked:text-indigo-600 text-slate-600 font-medium cursor-pointer transition-all">
                  {cat}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Theme Color</label>
          <div className="flex flex-wrap gap-3">
            {COLORS.map(color => (
              <label key={color} className="relative cursor-pointer group">
                <input type="radio" name="color" value={color} className="sr-only peer" defaultChecked={color === '#6366f1'} />
                <div 
                  className="w-10 h-10 rounded-full border-2 border-transparent peer-checked:border-slate-900 peer-checked:scale-110 transition-all shadow-sm"
                  style={{ backgroundColor: color }}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Description</label>
          <textarea 
            name="description"
            rows={3}
            placeholder="Add some details..." 
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 text-slate-900 font-medium transition-all resize-none"
          />
        </div>

        <Button fullWidth size="lg" type="submit" className="mt-8">
          Create Countdown
        </Button>
      </form>
    </div>
  );

  const renderDetail = () => {
    if (!selectedHoliday) return null;

    const days = Math.max(0, Math.floor((new Date(selectedHoliday.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

    return (
      <div className="min-h-screen bg-slate-50 pb-24">
        <header className="p-6 flex justify-between items-center relative z-20">
          <button onClick={navigateToList} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex items-center gap-2">
            {isConfirmingDelete ? (
              <div className="flex items-center gap-2 animate-in slide-in-from-right-4 duration-300">
                <Button variant="ghost" size="sm" onClick={() => setIsConfirmingDelete(false)}>Cancel</Button>
                <Button variant="danger" size="sm" onClick={() => deleteHoliday(selectedHoliday.id)}>Confirm Delete</Button>
              </div>
            ) : (
              <button 
                onClick={() => setIsConfirmingDelete(true)}
                className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
              >
                <Trash2 size={24} />
              </button>
            )}
          </div>
        </header>

        <div className="px-6 space-y-8 max-w-2xl mx-auto">
          <div className="text-center">
            <span className="text-7xl mb-4 block" role="img" aria-label="emoji">{selectedHoliday.emoji}</span>
            <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedHoliday.name}</h2>
            <p className="text-slate-500 font-medium">{new Date(selectedHoliday.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>

          <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-100 text-center relative overflow-hidden group">
             <div 
              className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 rounded-full opacity-10 group-hover:scale-110 transition-transform duration-700"
              style={{ backgroundColor: selectedHoliday.color }}
            />
            
            <p className="text-8xl font-black text-slate-900 tracking-tighter mb-2">{days}</p>
            <p className="text-xl font-bold text-slate-400 uppercase tracking-[0.2em]">Days to go</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">About this {selectedHoliday.category}</h3>
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <p className="text-slate-600 leading-relaxed">
                {selectedHoliday.description || "No description provided for this special event."}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                Celebration Ideas
              </h3>
              {aiIdeas.length === 0 && !isLoadingIdeas && (
                <button 
                  onClick={fetchIdeas}
                  className="text-indigo-600 text-sm font-bold hover:underline"
                >
                  Generate with AI
                </button>
              )}
            </div>

            {isLoadingIdeas ? (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center space-y-3">
                <Wand2 className="w-8 h-8 text-indigo-400 animate-pulse" />
                <p className="text-slate-400 font-medium">Magic in progress...</p>
              </div>
            ) : aiIdeas.length > 0 ? (
              <div className="space-y-3">
                {aiIdeas.map((idea, i) => (
                  <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-all">
                    <h4 className="font-bold text-slate-900 mb-1">{idea.title}</h4>
                    <p className="text-sm text-slate-600">{idea.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-100/50 p-6 rounded-3xl border border-dashed border-slate-200 text-center">
                <p className="text-slate-400 text-sm">Need some inspiration? Let Gemini help you plan the perfect celebration.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderConfig = () => (
    <div className="min-h-screen bg-slate-50 p-6 pb-32">
       <header className="flex items-center gap-4 mb-8">
        <button onClick={navigateToList} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-slate-900">Widget Customization</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div className="flex flex-col items-center gap-8 order-2 lg:order-1">
          <div className="w-full flex flex-col items-center">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Live Preview</p>
             <WidgetPreview holiday={nextHoliday} config={widgetConfig} />
          </div>
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 max-w-sm">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600 shrink-0">
               <Sparkles size={16} />
            </div>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Widgets allow you to see your countdown directly on your home screen. Customize the look to match your personal style.
            </p>
          </div>
        </div>

        <div className="space-y-8 order-1 lg:order-2">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Visual Style</h3>
            <div className="grid grid-cols-3 gap-3">
              {(['light', 'dark', 'glass'] as const).map(theme => (
                <button
                  key={theme}
                  onClick={() => setWidgetConfig({...widgetConfig, theme})}
                  className={`px-4 py-3 rounded-2xl font-bold capitalize transition-all border-2 ${
                    widgetConfig.theme === theme 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' 
                    : 'bg-white text-slate-600 border-transparent hover:border-slate-200 shadow-sm'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Accent Color</h3>
            <div className="flex flex-wrap gap-3">
              {COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => setWidgetConfig({...widgetConfig, accentColor: color})}
                  className={`w-12 h-12 rounded-full border-4 transition-all shadow-sm ${
                    widgetConfig.accentColor === color ? 'border-slate-900 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Display Options</h3>
            <div className="space-y-3">
               <label className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-indigo-100 transition-all">
                 <span className="font-bold text-slate-700">Compact Mode</span>
                 <input 
                  type="checkbox" 
                  checked={widgetConfig.compactMode}
                  onChange={(e) => setWidgetConfig({...widgetConfig, compactMode: e.target.checked})}
                  className="w-6 h-6 rounded-md text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                 />
               </label>
               <label className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-indigo-100 transition-all">
                 <span className="font-bold text-slate-700">Show Progress Bar</span>
                 <input 
                  type="checkbox" 
                  checked={widgetConfig.showSeconds}
                  onChange={(e) => setWidgetConfig({...widgetConfig, showSeconds: e.target.checked})}
                  className="w-6 h-6 rounded-md text-indigo-600 focus:ring-indigo-500 cursor-pointer" 
                 />
               </label>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Font Size</h3>
            <div className="grid grid-cols-4 gap-2">
              {(['sm', 'base', 'lg', 'xl'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setWidgetConfig({...widgetConfig, fontSize: size})}
                  className={`py-3 rounded-2xl font-bold uppercase text-xs transition-all border-2 ${
                    widgetConfig.fontSize === size 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg' 
                    : 'bg-white text-slate-400 border-transparent hover:border-slate-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <Button fullWidth size="lg" onClick={navigateToList} className="mt-4">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto selection:bg-indigo-100 selection:text-indigo-700">
      {screen === 'welcome' && renderWelcome()}
      {screen === 'list' && renderList()}
      {screen === 'add' && renderAdd()}
      {screen === 'detail' && renderDetail()}
      {screen === 'config' && renderConfig()}
      {screen === 'global' && renderGlobal()}

      {screen !== 'welcome' && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4">
          <div className="glass shadow-2xl rounded-3xl p-2 flex items-center gap-2">
            {/* Fix: Changed Home button to target 'list' instead of 'welcome' to avoid unreachable active state and resolve TS error */}
            <button 
              onClick={() => {
                setIsConfirmingDelete(false);
                setScreen('list');
              }}
              className={`p-4 rounded-2xl transition-all ${screen === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <Home size={24} />
            </button>
            <button 
              onClick={() => {
                setIsConfirmingDelete(false);
                setScreen('add');
              }}
              className={`p-4 rounded-2xl transition-all ${screen === 'add' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <Plus size={24} />
            </button>
            <button 
              onClick={() => {
                setIsConfirmingDelete(false);
                setScreen('global');
              }}
              className={`p-4 rounded-2xl transition-all ${screen === 'global' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <Globe size={24} />
            </button>
            <button 
              onClick={() => {
                setIsConfirmingDelete(false);
                setScreen('config');
              }}
              className={`p-4 rounded-2xl transition-all ${screen === 'config' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <Settings size={24} />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default App;

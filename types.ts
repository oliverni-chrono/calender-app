
export interface Holiday {
  id: string;
  name: string;
  date: string; // ISO string
  description: string;
  category: 'Trip' | 'Celebration' | 'Holiday' | 'Personal';
  color: string;
  emoji: string;
}

export interface WidgetConfig {
  theme: 'light' | 'dark' | 'glass';
  accentColor: string;
  showSeconds: boolean;
  compactMode: boolean;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
}

export type Screen = 'welcome' | 'list' | 'add' | 'detail' | 'config' | 'global';

export interface CelebrationIdea {
  title: string;
  description: string;
}

export interface GlobalHoliday {
  name: string;
  date: string;
  description: string;
  emoji: string;
}

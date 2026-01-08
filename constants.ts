
import { Holiday, WidgetConfig } from './types';

export const INITIAL_HOLIDAYS: Holiday[] = [
  {
    id: '1',
    name: 'Summer in Santorini',
    date: new Date(new Date().getFullYear(), 7, 15).toISOString(),
    description: 'A beautiful escape to the Greek islands.',
    category: 'Trip',
    color: '#0ea5e9',
    emoji: '🏝️'
  },
  {
    id: '2',
    name: 'Christmas Eve',
    date: new Date(new Date().getFullYear(), 11, 24).toISOString(),
    description: 'Warm cocoa and family gatherings.',
    category: 'Holiday',
    color: '#ef4444',
    emoji: '🎄'
  }
];

export const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  theme: 'glass',
  accentColor: '#6366f1',
  showSeconds: false,
  compactMode: false,
  fontSize: 'base'
};

export const CATEGORIES = ['Trip', 'Celebration', 'Holiday', 'Personal'] as const;

export const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', 
  '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899'
];

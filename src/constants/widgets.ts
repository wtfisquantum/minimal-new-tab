import type { ElementType } from 'react';
import {
  Image as ImageIcon,
  ExternalLink,
  Calendar as CalendarIcon,
  Cloud,
  FileText,
  Layers,
} from 'lucide-react';

export interface WidgetDef {
  id: string;
  label: string;
  icon: ElementType;
  soon: boolean;
}

export const widget_list: WidgetDef[] = [
  { id: 'news', label: 'Latest Tech News', icon: ImageIcon, soon: false },
  { id: 'shortcuts', label: 'Quick Shortcuts', icon: ExternalLink, soon: false },
  { id: 'todos', label: 'Today\'s Todo List', icon: CalendarIcon, soon: false },
  { id: 'weather', label: 'Weather', icon: Cloud, soon: true },
  { id: 'notes', label: 'Quick Notes', icon: FileText, soon: true },
  { id: 'github', label: 'GitHub Stats', icon: Layers, soon: true },
];

export const default_picks = ['news', 'shortcuts', 'todos'];

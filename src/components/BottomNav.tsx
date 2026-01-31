import { BookOpen, MessageSquare, Brain, Languages, Grid, LucideIcon } from 'lucide-react';

export interface TabItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

const TABS: TabItem[] = [
  { id: 'grammar', icon: BookOpen, label: 'Grammar' },
  { id: 'vocab', icon: MessageSquare, label: 'Vocabulary' },
  { id: 'quiz', icon: Brain, label: 'Quiz' },
  { id: 'translate', icon: Languages, label: 'Translate' },
  { id: 'match', icon: Grid, label: 'Match' },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-4xl mx-auto flex justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
                activeTab === tab.id ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-500'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

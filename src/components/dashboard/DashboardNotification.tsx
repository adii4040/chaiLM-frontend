import { Info } from 'lucide-react';

interface DashboardNotificationProps {
  message: string | null;
}

export default function DashboardNotification({ message }: DashboardNotificationProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-chailm-panel border border-chailm-accentBlue/40 text-chailm-textMain px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 text-xs font-medium z-50 animate-in fade-in slide-in-from-bottom-2">
      <Info className="w-4 h-4 text-chailm-accentBlue" />
      <span>{message}</span>
    </div>
  );
}

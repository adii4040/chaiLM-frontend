import { Cpu } from 'lucide-react';

export default function AuthLoaderSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-chailm-bg text-chailm-textMain font-sans">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-chailm-panel border border-chailm-border flex items-center justify-center text-chailm-accentBlue animate-pulse">
          <Cpu className="w-6 h-6" />
        </div>
        <div className="text-xs font-mono text-chailm-textMuted tracking-wider uppercase animate-pulse">
          Authenticating Grounded Session...
        </div>
      </div>
    </div>
  );
}

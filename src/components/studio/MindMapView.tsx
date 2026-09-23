import { useState } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import type { MindMapData } from '../../modules/studio/dto/studioDto';
import {
  MindMapFlow,
  THEMES,
  type MindMapTheme,
} from './mindmap';

export interface MindMapViewProps {
  data: MindMapData;
}

export default function MindMapView({ data }: MindMapViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState<MindMapTheme>(() => {
    const saved = localStorage.getItem('chailm_mindmap_theme');
    if (
      saved &&
      (saved === 'light' || saved === 'dark' || saved === 'midnight' || saved === 'warm')
    ) {
      return saved as MindMapTheme;
    }
    return 'light';
  });

  const handleThemeChange = (newTheme: MindMapTheme) => {
    setTheme(newTheme);
    localStorage.setItem('chailm_mindmap_theme', newTheme);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  if (!data || (!data.rootNode && !data.mapTitle)) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center text-[#5C6169]">
        <p className="text-sm">No mind map data available.</p>
      </div>
    );
  }

  const currentTheme = THEMES[theme] || THEMES.light;

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 w-screen h-screen transition-colors duration-300'
          : `w-full h-full min-h-[550px] relative rounded-2xl overflow-hidden border ${currentTheme.toolbarBorder} transition-colors duration-300`
      }
      style={{ backgroundColor: currentTheme.canvasBg }}
    >
      <ReactFlowProvider>
        <MindMapFlow
          data={data}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
          theme={theme}
          onChangeTheme={handleThemeChange}
        />
      </ReactFlowProvider>
    </div>
  );
}

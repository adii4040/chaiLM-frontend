import { useState } from 'react';
import { Panel } from '@xyflow/react';
import {
  Network,
  ChevronDown,
  Rows,
  Columns,
  RotateCcw,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { THEMES, type MindMapTheme } from './mindMapTheme';
import { mono } from '../../landing/tokens';

export interface MindMapToolbarProps {
  branchCount: number;
  totalSubNodes: number;
  theme: MindMapTheme;
  orientation: 'LR' | 'TB';
  isFullscreen: boolean;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onChangeTheme: (theme: MindMapTheme) => void;
  onToggleOrientation: () => void;
  onResetLayout: () => void;
  onToggleFullscreen: () => void;
}

export function MindMapToolbar({
  branchCount,
  totalSubNodes,
  theme,
  orientation,
  isFullscreen,
  onExpandAll,
  onCollapseAll,
  onChangeTheme,
  onToggleOrientation,
  onResetLayout,
  onToggleFullscreen,
}: MindMapToolbarProps) {
  const [showThemePicker, setShowThemePicker] = useState(false);
  const currentTheme = THEMES[theme] || THEMES.light;
  const CurrentThemeIcon = currentTheme.icon;

  return (
    <Panel position="top-center" className="mt-2 sm:mt-3 z-30">
      <div
        className={`px-2.5 sm:px-3.5 py-1.5 rounded-full border shadow-lg flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap select-none ${currentTheme.toolbarBg} ${currentTheme.toolbarBorder} ${currentTheme.toolbarText}`}
      >
        {/* Branches counter */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-xs font-mono font-bold pr-1.5 sm:pr-2 border-r border-current/15 shrink-0" style={mono}>
          <Network className="w-3.5 h-3.5 text-purple-500 shrink-0" />
          <span>{branchCount}</span>
          <span className="hidden sm:inline">Branches</span>
          <span className="opacity-65 font-normal">({totalSubNodes})</span>
        </div>

        {/* Expand / Collapse Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onExpandAll}
            className={`px-2 sm:px-2.5 py-1 rounded-full border text-[10px] sm:text-[11px] font-mono font-semibold transition cursor-pointer ${currentTheme.buttonBg} ${currentTheme.buttonText} ${currentTheme.buttonHover} ${currentTheme.toolbarBorder}`}
            title="Expand all branch sub-nodes"
          >
            <span>Expand</span>
            <span className="hidden sm:inline">&nbsp;All</span>
          </button>
          <button
            type="button"
            onClick={onCollapseAll}
            className={`px-2 sm:px-2.5 py-1 rounded-full border text-[10px] sm:text-[11px] font-mono font-semibold transition cursor-pointer ${currentTheme.buttonBg} ${currentTheme.buttonText} ${currentTheme.buttonHover} ${currentTheme.toolbarBorder}`}
            title="Collapse all sub-nodes"
          >
            <span>Collapse</span>
            <span className="hidden sm:inline">&nbsp;All</span>
          </button>
        </div>

        <div className="h-3.5 w-px bg-current/15 shrink-0" />

        {/* Tool & Theme Controls */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Theme Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowThemePicker((prev) => !prev)}
              className={`px-2 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-mono font-semibold ${currentTheme.buttonBg} ${currentTheme.buttonText} ${currentTheme.buttonHover} ${currentTheme.toolbarBorder}`}
              title={`Change Theme (Current: ${currentTheme.name})`}
            >
              <CurrentThemeIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">{currentTheme.name.split(' ')[0]}</span>
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>

            {showThemePicker && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowThemePicker(false)}
                />
                <div
                  className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-44 rounded-2xl border shadow-2xl p-1.5 z-50 space-y-0.5 animate-in fade-in zoom-in-95 duration-150 ${currentTheme.toolbarBg} ${currentTheme.toolbarBorder}`}
                >
                  {(Object.keys(THEMES) as MindMapTheme[]).map((themeKey) => {
                    const t = THEMES[themeKey];
                    const Icon = t.icon;
                    const isActive = theme === themeKey;
                    return (
                      <button
                        key={themeKey}
                        type="button"
                        onClick={() => {
                          onChangeTheme(themeKey);
                          setShowThemePicker(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer ${
                          isActive
                            ? 'bg-purple-600 text-white font-bold'
                            : `${currentTheme.buttonHover} ${currentTheme.toolbarText}`
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5" />
                          <span>{t.name}</span>
                        </div>
                        {isActive && <span className="text-[10px]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Layout Direction Toggle */}
          <button
            type="button"
            onClick={onToggleOrientation}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${currentTheme.buttonBg} ${currentTheme.buttonText} ${currentTheme.buttonHover} ${currentTheme.toolbarBorder}`}
            title={`Switch to ${orientation === 'LR' ? 'Vertical' : 'Horizontal'} Layout`}
          >
            {orientation === 'LR' ? (
              <Rows className="w-3.5 h-3.5" />
            ) : (
              <Columns className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Reset / Center View */}
          <button
            type="button"
            onClick={onResetLayout}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${currentTheme.buttonBg} ${currentTheme.buttonText} ${currentTheme.buttonHover} ${currentTheme.toolbarBorder}`}
            title="Reset View & Center Canvas"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${currentTheme.buttonBg} ${currentTheme.buttonText} ${currentTheme.buttonHover} ${currentTheme.toolbarBorder}`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mind Map'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </Panel>
  );
}

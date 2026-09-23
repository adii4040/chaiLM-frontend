import { Sun, Moon, Zap, Coffee } from 'lucide-react';

export type MindMapTheme = 'light' | 'dark' | 'midnight' | 'warm';

export interface ThemeConfig {
  id: MindMapTheme;
  name: string;
  icon: typeof Sun;
  canvasBg: string;
  dotColor: string;
  rootCard: string;
  rootBorder: string;
  rootText: string;
  branchCard: string;
  branchText: string;
  branchSubCountBg: string;
  branchSubCountText: string;
  subCard: string;
  subCardBorder: string;
  subText: string;
  detailText: string;
  detailBorder: string;
  toolbarBg: string;
  toolbarBorder: string;
  toolbarText: string;
  buttonBg: string;
  buttonText: string;
  buttonHover: string;
  miniMapBg: string;
  miniMapMask: string;
  miniMapBorder: string;
  controlsClass: string;
}

export const THEMES: Record<MindMapTheme, ThemeConfig> = {
  light: {
    id: 'light',
    name: 'Light Paper',
    icon: Sun,
    canvasBg: '#FAFBF9',
    dotColor: '#CBCFC9',
    rootCard: 'bg-white',
    rootBorder: 'border-purple-300',
    rootText: 'text-[#14171A]',
    branchCard: 'bg-white',
    branchText: 'text-[#14171A]',
    branchSubCountBg: 'bg-[#FAFBF9] hover:bg-[#F0F2EE] border-[#CBCFC9]',
    branchSubCountText: 'text-[#14171A]',
    subCard: 'bg-white',
    subCardBorder: 'border-[#CBCFC9]',
    subText: 'text-[#14171A]',
    detailText: 'text-[#5C6169]',
    detailBorder: 'border-[#F0F2EE]',
    toolbarBg: 'bg-white/90 backdrop-blur-md',
    toolbarBorder: 'border-[#CBCFC9]',
    toolbarText: 'text-[#14171A]',
    buttonBg: 'bg-[#F5F6F4]',
    buttonText: 'text-[#14171A]',
    buttonHover: 'hover:bg-[#E2E4E1]',
    miniMapBg: '#FFFFFF',
    miniMapMask: 'rgba(245, 246, 244, 0.75)',
    miniMapBorder: 'border-[#CBCFC9]',
    controlsClass: 'bg-white! border-[#CBCFC9]!',
  },
  dark: {
    id: 'dark',
    name: 'Obsidian Slate',
    icon: Moon,
    canvasBg: '#0F172A',
    dotColor: '#334155',
    rootCard: 'bg-[#1E293B]',
    rootBorder: 'border-purple-500',
    rootText: 'text-slate-100',
    branchCard: 'bg-[#1E293B]',
    branchText: 'text-slate-100',
    branchSubCountBg: 'bg-[#0F172A] hover:bg-[#334155] border-slate-700',
    branchSubCountText: 'text-slate-200',
    subCard: 'bg-[#1E293B]',
    subCardBorder: 'border-slate-700',
    subText: 'text-slate-100',
    detailText: 'text-slate-400',
    detailBorder: 'border-slate-800',
    toolbarBg: 'bg-[#1E293B]/95 backdrop-blur-md',
    toolbarBorder: 'border-slate-700',
    toolbarText: 'text-slate-100',
    buttonBg: 'bg-[#0F172A]',
    buttonText: 'text-slate-200',
    buttonHover: 'hover:bg-[#334155]',
    miniMapBg: '#1E293B',
    miniMapMask: 'rgba(15, 23, 42, 0.85)',
    miniMapBorder: 'border-slate-700',
    controlsClass: 'bg-[#1E293B]! border-slate-700! text-slate-100!',
  },
  midnight: {
    id: 'midnight',
    name: 'Cyber Neon',
    icon: Zap,
    canvasBg: '#090D16',
    dotColor: '#1E293B',
    rootCard: 'bg-[#0F172A]',
    rootBorder: 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)]',
    rootText: 'text-white',
    branchCard: 'bg-[#0F172A]',
    branchText: 'text-white',
    branchSubCountBg: 'bg-[#090D16] hover:bg-[#1E293B] border-slate-700',
    branchSubCountText: 'text-cyan-300',
    subCard: 'bg-[#0F172A]',
    subCardBorder: 'border-slate-800',
    subText: 'text-slate-100',
    detailText: 'text-slate-400',
    detailBorder: 'border-slate-800/60',
    toolbarBg: 'bg-[#0F172A]/90 backdrop-blur-md',
    toolbarBorder: 'border-slate-700',
    toolbarText: 'text-white',
    buttonBg: 'bg-[#090D16]',
    buttonText: 'text-slate-300',
    buttonHover: 'hover:bg-[#1E293B] hover:text-cyan-300',
    miniMapBg: '#0F172A',
    miniMapMask: 'rgba(9, 13, 22, 0.85)',
    miniMapBorder: 'border-slate-700',
    controlsClass: 'bg-[#0F172A]! border-slate-700! text-cyan-300!',
  },
  warm: {
    id: 'warm',
    name: 'Warm Parchment',
    icon: Coffee,
    canvasBg: '#F8F5EE',
    dotColor: '#D8D1BE',
    rootCard: 'bg-[#FFFDF9]',
    rootBorder: 'border-amber-400',
    rootText: 'text-[#2D2A26]',
    branchCard: 'bg-[#FFFDF9]',
    branchText: 'text-[#2D2A26]',
    branchSubCountBg: 'bg-[#F2ECE1] hover:bg-[#E8E0D2] border-[#D8D1BE]',
    branchSubCountText: 'text-[#2D2A26]',
    subCard: 'bg-[#FFFDF9]',
    subCardBorder: 'border-[#E0D8C7]',
    subText: 'text-[#2D2A26]',
    detailText: 'text-[#7C756B]',
    detailBorder: 'border-[#F2ECE1]',
    toolbarBg: 'bg-[#FFFDF9]/95 backdrop-blur-md',
    toolbarBorder: 'border-[#D8D1BE]',
    toolbarText: 'text-[#2D2A26]',
    buttonBg: 'bg-[#F2ECE1]',
    buttonText: 'text-[#2D2A26]',
    buttonHover: 'hover:bg-[#E8E0D2]',
    miniMapBg: '#FFFDF9',
    miniMapMask: 'rgba(248, 245, 238, 0.75)',
    miniMapBorder: 'border-[#D8D1BE]',
    controlsClass: 'bg-[#FFFDF9]! border-[#D8D1BE]!',
  },
};

export interface BranchPalette {
  primary: string;
  stroke: string;
  bg: string;
  badge: string;
  accentBar: string;
  dot: string;
}

export const PALETTES: BranchPalette[] = [
  {
    primary: '#8B5CF6', // Purple
    stroke: '#A78BFA',
    bg: '#F5F3FF',
    badge: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800',
    accentBar: 'bg-purple-600',
    dot: 'bg-purple-600',
  },
  {
    primary: '#10B981', // Emerald
    stroke: '#6EE7B7',
    bg: '#ECFDF5',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
    accentBar: 'bg-emerald-600',
    dot: 'bg-emerald-600',
  },
  {
    primary: '#3B82F6', // Blue
    stroke: '#93C5FD',
    bg: '#EFF6FF',
    badge: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800',
    accentBar: 'bg-blue-600',
    dot: 'bg-blue-600',
  },
  {
    primary: '#F59E0B', // Amber
    stroke: '#FCD34D',
    bg: '#FFFBEB',
    badge: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
    accentBar: 'bg-amber-600',
    dot: 'bg-amber-600',
  },
  {
    primary: '#F43F5E', // Rose
    stroke: '#FDA4AF',
    bg: '#FFF1F2',
    badge: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800',
    accentBar: 'bg-rose-600',
    dot: 'bg-rose-600',
  },
  {
    primary: '#06B6D4', // Cyan
    stroke: '#67E8F9',
    bg: '#ECFEFF',
    badge: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-800',
    accentBar: 'bg-cyan-600',
    dot: 'bg-cyan-600',
  },
];

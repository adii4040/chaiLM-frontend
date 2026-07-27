export interface SandboxTakeaway {
  text: string;
  citation: string;
  type: 'youtube' | 'pdf';
  videoId?: string;
  timeSec?: number;
  page?: number;
}

export interface SandboxDemo {
  id: string;
  label: string;
  query: string;
  summary: string;
  takeaways: SandboxTakeaway[];
}

export interface InspectorState {
  type: 'youtube' | 'pdf';
  videoId?: string;
  timeSec?: number;
  formattedTime?: string;
  page?: number;
  title: string;
}

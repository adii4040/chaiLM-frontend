import type { StructuredAnswer, SourceItem } from '../../query/dto/queryDto';

export type WorkspaceSourceStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | string;
export type StudioOutlineStatus = 'NOT_STARTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | string;

export interface WorkspaceSourceItem {
  sourceId: string;
  title: string;
  sourceType: 'pdf' | 'youtube' | 'website' | string;
  sourceUrl: string;
  status?: WorkspaceSourceStatus;
  errorMessage?: string | null;
  cloudinaryUrl?: string | null;
  videoId?: string | null;
  studioOutlineStatus?: StudioOutlineStatus;
  studioOutlineError?: string | null;
  summaryOutline?: any | null;
  indexedAt?: string | null;
  // playback convenience attributes
  startSeconds?: number | null;
  formattedTimestamp?: string | null;
  pageNumber?: number | null;
}

export interface HydratedChatMessage {
  id: string;
  role: 'user' | 'assistant';
  query?: string | null;
  answer?: StructuredAnswer | null;
  sources?: SourceItem[];
  createdAt?: string;
}

export interface WorkspaceData {
  workspaceId: string;
  title: string;
  sources: WorkspaceSourceItem[];
  history: HydratedChatMessage[];
}

export interface WorkspaceDataResponse {
  message: string;
  data: WorkspaceData;
}

export interface WorkspaceSummaryItem {
  workspaceId: string;
  sessionId?: string; // Backwards-compatible alias
  title: string;
  sourceCount: number;
  sourcesSummary: WorkspaceSourceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface GetAllWorkspacesResponse {
  message: string;
  data: WorkspaceSummaryItem[];
}

export interface CreateWorkspacePayload {
  title: string;
  userId?: string;
}

export interface CreateWorkspaceResponse {
  message: string;
  data: {
    workspaceId: string;
    title: string;
    sources: WorkspaceSourceItem[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface DeleteWorkspaceResponse {
  message: string;
  data: {
    workspaceId: string;
  };
}

export type SourceType = 'pdf' | 'youtube' | 'website';

export interface IndexUrlPayload {
  type: 'youtube' | 'website';
  url: string;
  workspaceId: string;
  userId?: string;
  sessionId?: string; // Backwards compatible
}

export interface IndexPdfPayload {
  file: File;
  type: 'pdf';
  workspaceId: string;
  userId?: string;
  sessionId?: string; // Backwards compatible
}

export type IndexerPayload = IndexUrlPayload | IndexPdfPayload;

export interface IndexResultData {
  workspaceId: string;
  sourceId: string;
  type: SourceType;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | string;
  studioOutlineStatus: 'NOT_STARTED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | string;
  title?: string;
  chunksIndexed?: number;
  sourceUrl?: string;
  cloudinaryUrl?: string | null;
}

export interface IndexerResponse {
  message: string;
  data: IndexResultData;
}

export type {
  WorkspaceSourceItem as SessionSourceItem,
  WorkspaceData as SessionSourcesData,
  WorkspaceDataResponse as SessionSourcesResponse,
} from '../../workspace/dto/workspaceDto';

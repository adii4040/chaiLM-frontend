import type { StructuredAnswer, SourceItem } from '../../query/dto/queryDto';
import type { SessionSourceItem } from '../../indexer/dto/indexerDto';

export interface HydratedChatMessage {
  id: string;
  role: 'user' | 'assistant';
  query?: string | null;
  answer?: StructuredAnswer | null;
  sources?: SourceItem[];
  createdAt?: string;
}

export interface HydratedSessionData {
  sessionId: string;
  title?: string;
  sources: SessionSourceItem[];
  history: HydratedChatMessage[];
}

export interface SessionDataResponse {
  message: string;
  data: HydratedSessionData;
}

export interface WorkspaceSummarySource {
  title: string;
  sourceType: string;
}

export interface WorkspaceSummaryItem {
  sessionId: string;
  title: string;
  sourceCount: number;
  sourcesSummary: WorkspaceSummarySource[];
  createdAt: string;
  updatedAt: string;
}

export interface GetAllSessionsResponse {
  message: string;
  data: WorkspaceSummaryItem[];
}

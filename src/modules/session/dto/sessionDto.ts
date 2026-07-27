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
  sources: SessionSourceItem[];
  history: HydratedChatMessage[];
}

export interface SessionDataResponse {
  message: string;
  data: HydratedSessionData;
}

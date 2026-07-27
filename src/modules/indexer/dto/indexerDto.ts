export type SourceType = 'pdf' | 'youtube' | 'website';

export interface IndexUrlPayload {
  type: SourceType;
  url: string;
  sessionId: string;
}

export interface IndexPdfPayload {
  file: File;
  type: 'pdf';
  sessionId: string;
}

export type IndexerPayload = IndexUrlPayload | IndexPdfPayload;

export interface IndexResultData {
  success: boolean;
  chunksIndexed: number;
  sourceType: SourceType;
  title: string;
  sourceUrl: string;
  cloudinaryUrl?: string | null;
  publicId?: string | null;
}

export interface IndexerResponse {
  message: string;
  data: IndexResultData;
}

export interface SessionSourceItem {
  title: string;
  sourceType: SourceType | string;
  sourceUrl: string;
  cloudinaryUrl?: string | null;
  indexedAt?: string | null;
}

export interface SessionSourcesData {
  sessionId: string;
  sources: SessionSourceItem[];
}

export interface SessionSourcesResponse {
  message: string;
  data: SessionSourcesData;
}

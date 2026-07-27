export interface Citation {
  sourceType: 'youtube' | 'pdf' | 'website' | 'unknown';
  pageNumber: number | null;
  startSeconds: number | null;
  formattedTimestamp: string | null;
}

export interface AnswerSegment {
  content: string;
  citation: Citation | null;
}

export interface StructuredAnswer {
  summary: string;
  segments: AnswerSegment[];
}

export interface QueryTranslations {
  rewritten: string;
  stepBack: string;
  subQueries: string[];
}

export interface SourceTimestamp {
  startSeconds: number;
  formattedTimestamp: string;
  timeUrl: string;
}

export interface SourceItem {
  text: string;
  sourceType: 'youtube' | 'pdf' | 'website' | string;
  sourceUrl: string;
  cloudinaryUrl?: string | null;
  title: string;
  pageNumber?: number | null;
  videoId?: string | null;
  timestamp?: SourceTimestamp | null;
  rrfScore?: number;
  rerankScore?: number;
}

export interface QueryRequest {
  query: string;
  sessionId: string;
  selectedSourceIds?: string[];
}

export interface QueryResultData {
  query: string;
  answer: StructuredAnswer;
  translations: QueryTranslations;
  hyde?: string;
  sources: SourceItem[];
}

export interface QueryResponse {
  message: string;
  data: QueryResultData;
}

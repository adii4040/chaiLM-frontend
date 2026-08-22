export interface AnswerCitation {
  sourceId: string | null;
  sourceUrl: string | null;
  sourceType: 'youtube' | 'pdf' | 'website' | 'unknown';
  pageNumber: number | null;
  startSeconds: number | null;
  formattedTimestamp: string | null;
  timeUrl: string | null;
}

export type Citation = AnswerCitation;

export interface AnswerSegment {
  content: string;
  citation: AnswerCitation | null;
}

export interface AnswerSection {
  sectionTitle: string;
  sourceId: string | null;
  summary: string;
  segments: AnswerSegment[];
}

export interface StructuredAnswer {
  overallSummary?: string;
  sections?: AnswerSection[];
  // Backwards compatibility fallbacks
  summary?: string;
  segments?: AnswerSegment[];
}

export interface QueryTranslations {
  rewritten?: string;
  stepBack?: string;
  subQueries?: string[];
}

export interface SourceTimestamp {
  startSeconds?: number;
  formattedTimestamp?: string;
  timeUrl?: string;
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
  workspaceId: string;
  sessionId?: string; // Backwards compatible
  selectedSourceIds?: string[];
}

export interface QueryResultData {
  query: string;
  answer: StructuredAnswer;
  translations?: QueryTranslations;
  hyde?: string;
  sources: SourceItem[];
}

export interface QueryResponse {
  message: string;
  data: QueryResultData;
}

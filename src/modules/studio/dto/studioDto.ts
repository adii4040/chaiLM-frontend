export type StudioArtifactType =
  | 'study_guide'
  | 'flashcards'
  | 'quiz'
  | 'mindmap'
  | 'audio_overview';

export interface StudyGuideTheme {
  themeTitle: string;
  overview: string;
  keyPoints: string[];
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface StudyGuideData {
  title: string;
  executiveSummary: string;
  keyThemes: StudyGuideTheme[];
  glossary: GlossaryTerm[];
  keyTakeaways: string[];
  reviewChecklist: string[];
}

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  hint: string;
  sourceReference: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface FlashcardDeckData {
  deckTitle: string;
  cards: Flashcard[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  sourceReference: string;
}

export interface QuizData {
  quizTitle: string;
  questions: QuizQuestion[];
}

export interface MindMapSubBranch {
  label: string;
  keyDetails: string[];
}

export interface MindMapBranch {
  label: string;
  subBranches: MindMapSubBranch[];
}

export interface MindMapData {
  mapTitle: string;
  rootNode: {
    label: string;
    branches: MindMapBranch[];
  };
}

export interface AudioDialogueTurn {
  speaker: 'Host 1' | 'Host 2';
  text: string;
  tone: string;
}

export interface AudioOverviewData {
  episodeTitle: string;
  summary: string;
  durationMinutesEstimate: number;
  dialogue: AudioDialogueTurn[];
}

export interface ChapterOutline {
  chapterIndex: number;
  chapterTitle: string;
  includedSegmentIds: number[];
  rangeLabel: string;
  rangeStart: number;
  rangeEnd: number;
  summary: string;
  takeaways: string[];
  terms: GlossaryTerm[];
}

export interface SummaryOutlineData {
  chapters: ChapterOutline[];
}

export interface StudioArtifact {
  _id?: string;
  artifactId: string;
  workspaceId: string;
  userId?: string;
  sourceId?: string;
  type: StudioArtifactType;
  title: string;
  data: StudyGuideData | FlashcardDeckData | QuizData | MindMapData | AudioOverviewData | any;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface StudioArtifactsResponse {
  success: boolean;
  count: number;
  artifacts: StudioArtifact[];
}

export interface StudioArtifactResponse {
  success: boolean;
  artifact: StudioArtifact;
}

export interface EnsureOutlinePayload {
  workspaceId: string;
  sourceId: string;
}

export interface EnsureOutlineResponse {
  status: 'COMPLETED' | 'PROCESSING' | string;
  sourceId: string;
  title?: string;
  chapterCount?: number;
  outline?: SummaryOutlineData;
  message?: string;
}

export interface GenerateArtifactBasePayload {
  workspaceId: string;
  sourceId?: string;
  title?: string;
  options?: Record<string, any>;
}

export interface GenerateFlashcardsPayload extends GenerateArtifactBasePayload {
  cardCount?: number;
}

export interface GenerateQuizPayload extends GenerateArtifactBasePayload {
  questionCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export class StudioRoutes {
  public static get BASE() {
    return '/api/studio';
  }

  public static LIST(workspaceId: string, type?: string, sourceId?: string) {
    const params = new URLSearchParams({ workspaceId });
    if (type) params.append('type', type);
    if (sourceId) params.append('sourceId', sourceId);
    return `/api/studio?${params.toString()}`;
  }

  public static GET_BY_ID(artifactId: string) {
    return `/api/studio/${artifactId}`;
  }

  public static DELETE(artifactId: string) {
    return `/api/studio/${artifactId}`;
  }

  public static get OUTLINE() {
    return '/api/studio/outline';
  }

  public static get STUDY_GUIDE() {
    return '/api/studio/study-guide';
  }

  public static get FLASHCARDS() {
    return '/api/studio/flashcards';
  }

  public static get QUIZ() {
    return '/api/studio/quiz';
  }

  public static get MINDMAP() {
    return '/api/studio/mindmap';
  }

  public static get AUDIO_OVERVIEW() {
    return '/api/studio/audio-overview';
  }
}

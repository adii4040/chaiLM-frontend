export class IndexerRoutes {
  public static get INDEX() {
    return '/api/indexer';
  }
  public static SESSION_SOURCES(sessionId: string) {
    return `/api/indexer/session/${sessionId}`;
  }
}

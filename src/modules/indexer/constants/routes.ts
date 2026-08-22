export class IndexerRoutes {
  public static get INDEX() {
    return '/api/indexer';
  }
  public static SESSION_SOURCES(workspaceId: string) {
    return `/api/workspace/${workspaceId}`;
  }
}

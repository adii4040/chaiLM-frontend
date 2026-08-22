export class WorkspaceRoutes {
  public static get WORKSPACE() {
    return '/api/workspace';
  }

  public static GET_WORKSPACE(workspaceId: string) {
    return `/api/workspace/${workspaceId}`;
  }

  public static DELETE_WORKSPACE(workspaceId: string) {
    return `/api/workspace/${workspaceId}`;
  }
}

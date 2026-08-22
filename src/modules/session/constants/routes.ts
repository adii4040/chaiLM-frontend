import { WorkspaceRoutes } from '../../workspace/constants/routes';

export class SessionRoutes {
  public static HYDRATE(sessionId: string) {
    return WorkspaceRoutes.GET_WORKSPACE(sessionId);
  }
}

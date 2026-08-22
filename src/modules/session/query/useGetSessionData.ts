import { useGetWorkspaceData } from '../../workspace/query/useGetWorkspaceData';

export const useGetSessionData = (sessionId: string) => {
  return useGetWorkspaceData(sessionId);
};

export { QUERY_KEY_WORKSPACE_DATA as QUERY_KEY_SESSION_DATA } from '../../workspace/constants/cacheKeys';

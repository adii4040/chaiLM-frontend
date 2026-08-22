import { useGetAllWorkspaces } from '../../workspace/query/useGetAllWorkspaces';

export function useGetAllSessions() {
  return useGetAllWorkspaces();
}

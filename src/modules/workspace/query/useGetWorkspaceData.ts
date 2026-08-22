import { useQuery } from '@tanstack/react-query';
import { WorkspaceRoutes, QUERY_KEY_WORKSPACE_DATA } from '../constants';
import type { WorkspaceDataResponse } from '../dto/workspaceDto';
import { apiService } from '../../../services/api';

export const useGetWorkspaceData = (workspaceId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY_WORKSPACE_DATA, workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null;
      return await apiService.get<WorkspaceDataResponse>(
        WorkspaceRoutes.GET_WORKSPACE(workspaceId)
      );
    },
    enabled: Boolean(workspaceId),
    refetchInterval: (query) => {
      const data = query.state.data as WorkspaceDataResponse | null;
      if (!data?.data?.sources) return false;
      const hasPendingOrProcessing = data.data.sources.some(
        (s) =>
          s.status === 'PENDING' ||
          s.status === 'PROCESSING' ||
          s.studioOutlineStatus === 'PROCESSING'
      );
      return hasPendingOrProcessing ? 3000 : false;
    },
  });
};

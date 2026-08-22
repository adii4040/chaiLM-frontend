import { useQuery } from '@tanstack/react-query';
import { WorkspaceRoutes, QUERY_KEY_ALL_WORKSPACES } from '../constants';
import type { GetAllWorkspacesResponse } from '../dto/workspaceDto';
import { apiService } from '../../../services/api';

export function useGetAllWorkspaces() {
  return useQuery<GetAllWorkspacesResponse>({
    queryKey: [QUERY_KEY_ALL_WORKSPACES],
    queryFn: async () => {
      return await apiService.get<GetAllWorkspacesResponse>(WorkspaceRoutes.WORKSPACE);
    },
  });
}

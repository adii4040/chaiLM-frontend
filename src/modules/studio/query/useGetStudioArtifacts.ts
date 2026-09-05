import { useQuery } from '@tanstack/react-query';
import { StudioRoutes, QUERY_KEY_STUDIO_ARTIFACTS } from '../constants';
import type { StudioArtifactsResponse, StudioArtifactType } from '../dto/studioDto';
import { apiService } from '../../../services/api';

export function useGetStudioArtifacts(
  workspaceId: string,
  type?: StudioArtifactType | string,
  sourceId?: string
) {
  return useQuery({
    queryKey: [QUERY_KEY_STUDIO_ARTIFACTS, workspaceId, type, sourceId],
    queryFn: async () => {
      if (!workspaceId) return null;
      return await apiService.get<StudioArtifactsResponse>(
        StudioRoutes.LIST(workspaceId, type, sourceId)
      );
    },
    enabled: Boolean(workspaceId),
    refetchInterval: (query) => {
      const data = query.state.data;
      const hasPendingAudio = data?.artifacts?.some(
        (a) => a.audioStatus === 'processing' || a.audioStatus === 'pending'
      );
      return hasPendingAudio ? 3000 : false;
    },
  });
}

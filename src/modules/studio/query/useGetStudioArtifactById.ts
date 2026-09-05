import { useQuery } from '@tanstack/react-query';
import { StudioRoutes, QUERY_KEY_STUDIO_ARTIFACT } from '../constants';
import type { StudioArtifactResponse } from '../dto/studioDto';
import { apiService } from '../../../services/api';

export function useGetStudioArtifactById(artifactId: string) {
  return useQuery({
    queryKey: [QUERY_KEY_STUDIO_ARTIFACT, artifactId],
    queryFn: async () => {
      if (!artifactId) return null;
      return await apiService.get<StudioArtifactResponse>(
        StudioRoutes.GET_BY_ID(artifactId)
      );
    },
    enabled: Boolean(artifactId),
    refetchInterval: (query) => {
      const art = query.state.data?.artifact;
      const isPendingAudio =
        art?.audioStatus === 'processing' || art?.audioStatus === 'pending';
      return isPendingAudio ? 3000 : false;
    },
  });
}

import { useQuery } from '@tanstack/react-query';
import { IndexerRoutes } from '../constants';
import type { SessionSourcesResponse } from '../dto/indexerDto';
import { apiService } from '../../../services/api';

export const QUERY_KEY_SESSION_SOURCES = 'QUERY_KEY_SESSION_SOURCES';

export const useGetSessionSources = (sessionId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY_SESSION_SOURCES, sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      return await apiService.get<SessionSourcesResponse>(
        IndexerRoutes.SESSION_SOURCES(sessionId)
      );
    },
    enabled: Boolean(sessionId),
  });
};

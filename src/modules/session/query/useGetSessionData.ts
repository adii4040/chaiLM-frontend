import { useQuery } from '@tanstack/react-query';
import { SessionRoutes } from '../constants/routes';
import type { SessionDataResponse } from '../dto/sessionDto';
import { apiService } from '../../../services/api';

export const QUERY_KEY_SESSION_DATA = 'QUERY_KEY_SESSION_DATA';

export const useGetSessionData = (sessionId: string) => {
  return useQuery({
    queryKey: [QUERY_KEY_SESSION_DATA, sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      return await apiService.get<SessionDataResponse>(
        SessionRoutes.HYDRATE(sessionId)
      );
    },
    enabled: Boolean(sessionId),
  });
};

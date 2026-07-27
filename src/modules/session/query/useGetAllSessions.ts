import { useQuery } from '@tanstack/react-query';
import type { GetAllSessionsResponse } from '../dto/sessionDto';
import { apiService } from '../../../services/api';

export function useGetAllSessions() {
  return useQuery<GetAllSessionsResponse>({
    queryKey: ['all-sessions'],
    queryFn: async () => {
      return await apiService.get<GetAllSessionsResponse>('/api/session');
    },
  });
}

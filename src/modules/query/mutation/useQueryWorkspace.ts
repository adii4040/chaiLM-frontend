import { useMutation } from '@tanstack/react-query';
import { QueryRoutes, MUTATION_QUERY_WORKSPACE } from '../constants';
import type { QueryRequest, QueryResponse } from '../dto/queryDto';
import { apiService } from '../../../services/api';

export const useQueryWorkspace = () => {
  return useMutation({
    mutationKey: [MUTATION_QUERY_WORKSPACE],
    mutationFn: async (payload: QueryRequest) => {
      return await apiService.post<QueryRequest, QueryResponse>(
        QueryRoutes.QUERY,
        payload
      );
    },
  });
};

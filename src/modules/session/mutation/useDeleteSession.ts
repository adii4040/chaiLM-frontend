import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../../../services/api';

export function useDeleteSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      return await apiService.delete(`/api/session/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-sessions'] });
    },
  });
}

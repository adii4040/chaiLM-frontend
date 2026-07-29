import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthRoutes, MUTATION_LOGOUT_USER, QUERY_GET_CURRENT_USER } from '../constants';
import { apiService } from '../../../services/api';

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATION_LOGOUT_USER],
    mutationFn: async () => {
      const response = await apiService.post(AuthRoutes.LOGOUT_USER);
      return response;
    },
    onSuccess: () => {
      queryClient.setQueryData([QUERY_GET_CURRENT_USER], null);
      queryClient.clear();
    },
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthRoutes, MUTATION_LOGIN_USER, QUERY_GET_CURRENT_USER } from '../constants';
import type { LoginRequestDto, AuthResponseDto } from '../dto/userDto';
import { apiService } from '../../../services/api';

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATION_LOGIN_USER],
    mutationFn: async (payload: LoginRequestDto) => {
      const response = await apiService.post<LoginRequestDto, AuthResponseDto>(
        AuthRoutes.LOGIN_USER,
        payload
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_GET_CURRENT_USER], data);
      queryClient.invalidateQueries({ queryKey: [QUERY_GET_CURRENT_USER] });
    },
  });
};

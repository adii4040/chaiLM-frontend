import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthRoutes, MUTATION_UPDATE_PROFILE, QUERY_GET_CURRENT_USER } from '../constants';
import type { AuthResponseDto } from '../dto/userDto';
import { apiService } from '../../../services/api';

export interface UpdateProfileRequestDto {
  fullname: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [MUTATION_UPDATE_PROFILE],
    mutationFn: async (payload: UpdateProfileRequestDto) => {
      const response = await apiService.patch<UpdateProfileRequestDto, AuthResponseDto>(
        AuthRoutes.UPDATE_PROFILE,
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

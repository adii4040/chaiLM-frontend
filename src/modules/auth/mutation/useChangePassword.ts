import { useMutation } from '@tanstack/react-query';
import { AuthRoutes, MUTATION_CHANGE_PASSWORD } from '../constants';
import { apiService } from '../../../services/api';

export interface ChangePasswordRequestDto {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponseDto {
  success: boolean;
  message: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationKey: [MUTATION_CHANGE_PASSWORD],
    mutationFn: async (payload: ChangePasswordRequestDto) => {
      const response = await apiService.post<ChangePasswordRequestDto, ChangePasswordResponseDto>(
        AuthRoutes.CHANGE_PASSWORD,
        payload
      );
      return response;
    },
  });
};

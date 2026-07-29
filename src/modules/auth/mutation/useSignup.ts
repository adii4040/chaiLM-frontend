import { useMutation } from '@tanstack/react-query';
import { AuthRoutes, MUTATION_REGISTER_USER } from '../constants';
import type { SignupRequestDto, AuthResponseDto } from '../dto/userDto';
import { apiService } from '../../../services/api';

export const useSignup = () => {
  return useMutation({
    mutationKey: [MUTATION_REGISTER_USER],
    mutationFn: async (payload: SignupRequestDto) => {
      const response = await apiService.post<SignupRequestDto, AuthResponseDto>(
        AuthRoutes.REGISTER_USER,
        payload
      );
      return response;
    },
  });
};

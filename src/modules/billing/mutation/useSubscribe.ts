import { useMutation } from '@tanstack/react-query';
import { BillingRoutes } from '../constants';
import type {
  CreateSubscriptionRequestDto,
  CreateSubscriptionResponseDto,
} from '../dto/billingDto';
import { apiService } from '../../../services/api';

export const useSubscribe = () => {
  return useMutation<
    CreateSubscriptionResponseDto,
    Error,
    CreateSubscriptionRequestDto
  >({
    mutationFn: async (payload: CreateSubscriptionRequestDto) => {
      const response = await apiService.post<
        CreateSubscriptionRequestDto,
        CreateSubscriptionResponseDto
      >(BillingRoutes.CREATE_SUBSCRIPTION, payload);
      return response;
    },
  });
};

export default useSubscribe;

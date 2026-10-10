import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BillingRoutes } from '../constants';
import { QUERY_GET_CURRENT_USER } from '../../auth/constants/cacheKeys';
import type {
  VerifySubscriptionRequestDto,
  VerifySubscriptionResponseDto,
} from '../dto/billingDto';
import { apiService } from '../../../services/api';

export const useVerifySubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<
    VerifySubscriptionResponseDto,
    Error,
    VerifySubscriptionRequestDto
  >({
    mutationFn: async (payload: VerifySubscriptionRequestDto) => {
      const response = await apiService.post<
        VerifySubscriptionRequestDto,
        VerifySubscriptionResponseDto
      >(BillingRoutes.VERIFY_SUBSCRIPTION, payload);
      return response;
    },
    onSuccess: () => {
      // Invalidate the current user cache so the new plan status takes immediate effect
      queryClient.invalidateQueries({ queryKey: [QUERY_GET_CURRENT_USER] });
    },
  });
};

export default useVerifySubscription;

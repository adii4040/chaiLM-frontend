import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BillingRoutes, QUERY_GET_MY_BILLING } from '../constants';
import { QUERY_GET_CURRENT_USER } from '../../auth/constants/cacheKeys';
import type { CancelSubscriptionResponseDto } from '../dto/billingDto';
import { apiService } from '../../../services/api';

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation<CancelSubscriptionResponseDto, Error, void>({
    mutationFn: async () => {
      const response = await apiService.post<void, CancelSubscriptionResponseDto>(
        BillingRoutes.CANCEL_SUBSCRIPTION
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_GET_MY_BILLING] });
      queryClient.invalidateQueries({ queryKey: [QUERY_GET_CURRENT_USER] });
    },
  });
};

export default useCancelSubscription;

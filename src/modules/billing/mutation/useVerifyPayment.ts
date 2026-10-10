import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BillingRoutes } from '../constants';
import { QUERY_GET_CURRENT_USER } from '../../auth/constants/cacheKeys';
import type {
  VerifyPaymentRequestDto,
  VerifyPaymentResponseDto,
} from '../dto/billingDto';
import { apiService } from '../../../services/api';

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    VerifyPaymentResponseDto,
    Error,
    VerifyPaymentRequestDto
  >({
    mutationFn: async (payload: VerifyPaymentRequestDto) => {
      const response = await apiService.post<
        VerifyPaymentRequestDto,
        VerifyPaymentResponseDto
      >(BillingRoutes.VERIFY_PAYMENT, payload);
      return response;
    },
    onSuccess: () => {
      // Invalidate current user cache or relevant billing queries upon verified payment
      queryClient.invalidateQueries({ queryKey: [QUERY_GET_CURRENT_USER] });
    },
  });
};

export default useVerifyPayment;

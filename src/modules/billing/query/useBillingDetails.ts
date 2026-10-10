import { useQuery } from '@tanstack/react-query';
import { BillingRoutes, QUERY_GET_MY_BILLING } from '../constants';
import type { GetBillingResponseDto } from '../dto/billingDto';
import { apiService } from '../../../services/api';

export const useBillingDetails = (enabled = true) => {
  return useQuery<GetBillingResponseDto>({
    queryKey: [QUERY_GET_MY_BILLING],
    queryFn: async () => {
      const response = await apiService.get<GetBillingResponseDto>(
        BillingRoutes.GET_MY_BILLING
      );
      return response;
    },
    enabled,
    staleTime: 60 * 1000,
  });
};

export default useBillingDetails;

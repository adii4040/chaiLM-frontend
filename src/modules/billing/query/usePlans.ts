import { useQuery } from '@tanstack/react-query';
import { BillingRoutes, QUERY_GET_PLANS } from '../constants';
import type { GetPlansResponseDto } from '../dto/billingDto';
import { apiService } from '../../../services/api';

export const usePlans = () => {
  return useQuery<GetPlansResponseDto>({
    queryKey: [QUERY_GET_PLANS],
    queryFn: async () => {
      const response = await apiService.get<GetPlansResponseDto>(
        BillingRoutes.GET_PLANS
      );
      return response;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export default usePlans;

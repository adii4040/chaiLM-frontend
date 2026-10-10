import { useQuery } from '@tanstack/react-query';
import { BillingRoutes, QUERY_GET_INVOICES } from '../constants';
import type { GetInvoicesResponseDto } from '../dto/billingDto';
import { apiService } from '../../../services/api';

export const useInvoices = (page = 1, limit = 20, enabled = true) => {
  return useQuery<GetInvoicesResponseDto>({
    queryKey: [QUERY_GET_INVOICES, page, limit],
    queryFn: async () => {
      const response = await apiService.get<GetInvoicesResponseDto>(
        `${BillingRoutes.GET_INVOICES}?page=${page}&limit=${limit}`
      );
      return response;
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export default useInvoices;

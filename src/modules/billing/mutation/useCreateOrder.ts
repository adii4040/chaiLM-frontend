import { useMutation } from '@tanstack/react-query';
import { BillingRoutes } from '../constants';
import type {
  CreateOrderRequestDto,
  CreateOrderResponseDto,
} from '../dto/billingDto';
import { apiService } from '../../../services/api';

export const useCreateOrder = () => {
  return useMutation<
    CreateOrderResponseDto,
    Error,
    CreateOrderRequestDto
  >({
    mutationFn: async (payload: CreateOrderRequestDto) => {
      const response = await apiService.post<
        CreateOrderRequestDto,
        CreateOrderResponseDto
      >(BillingRoutes.CREATE_ORDER, payload);
      return response;
    },
  });
};

export default useCreateOrder;

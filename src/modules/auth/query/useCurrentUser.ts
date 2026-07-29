import { useQuery } from '@tanstack/react-query';
import { AuthRoutes, QUERY_GET_CURRENT_USER } from '../constants';
import type { CurrentUserDto } from '../dto/userDto';
import { apiService } from '../../../services/api';

const useCurrentUser = () => {
  return useQuery<CurrentUserDto>({
    queryKey: [QUERY_GET_CURRENT_USER],
    queryFn: async () => {
      const response = await apiService.get<CurrentUserDto>(
        AuthRoutes.GET_CURRENT_USER
      );
      return response;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export default useCurrentUser;

import { useMutation } from '@tanstack/react-query';
import { IndexerRoutes, MUTATION_INDEX_DOCUMENT } from '../constants';
import type { IndexerPayload, IndexerResponse } from '../dto/indexerDto';
import { apiService } from '../../../services/api';

export const useIndexDocument = () => {
  return useMutation({
    mutationKey: [MUTATION_INDEX_DOCUMENT],
    mutationFn: async (payload: IndexerPayload) => {
      if ('file' in payload) {
        // PDF File upload via FormData
        const formData = new FormData();
        formData.append('file', payload.file);
        formData.append('type', 'pdf');
        formData.append('sessionId', payload.sessionId);

        return await apiService.post<FormData, IndexerResponse>(
          IndexerRoutes.INDEX,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // JSON payload for YouTube / Website indexing
        return await apiService.post<typeof payload, IndexerResponse>(
          IndexerRoutes.INDEX,
          payload
        );
      }
    },
  });
};

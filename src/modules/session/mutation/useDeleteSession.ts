import { useDeleteWorkspace } from '../../workspace/mutation/useDeleteWorkspace';

export function useDeleteSession() {
  return useDeleteWorkspace();
}

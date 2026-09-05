import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  StudioRoutes,
  QUERY_KEY_STUDIO_ARTIFACTS,
  MUTATION_ENSURE_OUTLINE,
  MUTATION_GENERATE_STUDY_GUIDE,
  MUTATION_GENERATE_FLASHCARDS,
  MUTATION_GENERATE_QUIZ,
  MUTATION_GENERATE_MINDMAP,
  MUTATION_GENERATE_AUDIO_OVERVIEW,
} from '../constants';
import type {
  EnsureOutlinePayload,
  EnsureOutlineResponse,
  GenerateArtifactBasePayload,
  GenerateAudioOverviewPayload,
  GenerateFlashcardsPayload,
  GenerateQuizPayload,
  StudioArtifactResponse,
} from '../dto/studioDto';
import { apiService } from '../../../services/api';
import { QUERY_KEY_WORKSPACE_DATA } from '../../workspace/constants';

export function useEnsureStudioOutline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_ENSURE_OUTLINE],
    mutationFn: async (payload: EnsureOutlinePayload) => {
      return await apiService.post<EnsureOutlinePayload, EnsureOutlineResponse>(
        StudioRoutes.OUTLINE,
        payload
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_WORKSPACE_DATA, variables.workspaceId],
      });
    },
  });
}

export function useGenerateStudyGuide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_GENERATE_STUDY_GUIDE],
    mutationFn: async (payload: GenerateArtifactBasePayload) => {
      return await apiService.post<GenerateArtifactBasePayload, StudioArtifactResponse>(
        StudioRoutes.STUDY_GUIDE,
        payload
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_STUDIO_ARTIFACTS, variables.workspaceId],
      });
    },
  });
}

export function useGenerateFlashcards() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_GENERATE_FLASHCARDS],
    mutationFn: async (payload: GenerateFlashcardsPayload) => {
      return await apiService.post<GenerateFlashcardsPayload, StudioArtifactResponse>(
        StudioRoutes.FLASHCARDS,
        payload
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_STUDIO_ARTIFACTS, variables.workspaceId],
      });
    },
  });
}

export function useGenerateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_GENERATE_QUIZ],
    mutationFn: async (payload: GenerateQuizPayload) => {
      return await apiService.post<GenerateQuizPayload, StudioArtifactResponse>(
        StudioRoutes.QUIZ,
        payload
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_STUDIO_ARTIFACTS, variables.workspaceId],
      });
    },
  });
}

export function useGenerateMindMap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_GENERATE_MINDMAP],
    mutationFn: async (payload: GenerateArtifactBasePayload) => {
      return await apiService.post<GenerateArtifactBasePayload, StudioArtifactResponse>(
        StudioRoutes.MINDMAP,
        payload
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_STUDIO_ARTIFACTS, variables.workspaceId],
      });
    },
  });
}

export function useGenerateAudioOverview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_GENERATE_AUDIO_OVERVIEW],
    mutationFn: async (payload: GenerateAudioOverviewPayload) => {
      return await apiService.post<GenerateAudioOverviewPayload, StudioArtifactResponse>(
        StudioRoutes.AUDIO_OVERVIEW,
        payload
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY_STUDIO_ARTIFACTS, variables.workspaceId],
      });
    },
  });
}

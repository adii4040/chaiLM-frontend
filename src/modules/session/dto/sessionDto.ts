export * from '../../workspace/dto';

// Backwards compatibility aliases
export type {
  WorkspaceSourceItem as SessionSourceItem,
  WorkspaceData as HydratedSessionData,
  WorkspaceDataResponse as SessionDataResponse,
  WorkspaceSummaryItem,
  GetAllWorkspacesResponse as GetAllSessionsResponse,
} from '../../workspace/dto';

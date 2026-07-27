import type { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { apiClient } from "../utils/apiClient";

export class ApiService {
  private async handleResponse<T>(
    resolver: Promise<AxiosResponse<T>>
  ): Promise<T> {
    try {
      const response = await resolver;
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{
        error?: string;
        message?: string;
      }>;

      const message =
        axiosError.response?.data?.error ??
        axiosError.response?.data?.message ??
        "Something went wrong";

      throw new Error(message, {
        cause: error,
      });
    }
  }

  public async get<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.handleResponse(
      apiClient.get(endpoint, config)
    );
  }

  public async post<TPayload, TResponse>(
    endpoint: string,
    payload?: TPayload,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.handleResponse(
      apiClient.post(endpoint, payload, config)
    );
  }

  public async patch<TPayload, TResponse>(
    endpoint: string,
    payload?: TPayload,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.handleResponse(
      apiClient.patch(endpoint, payload, config)
    );
  }

  public async put<TPayload, TResponse>(
    endpoint: string,
    payload?: TPayload,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    return this.handleResponse(
      apiClient.put(endpoint, payload, config)
    );
  }

  public async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.handleResponse(
      apiClient.delete(endpoint, config)
    );
  }
}

export const apiService = new ApiService();

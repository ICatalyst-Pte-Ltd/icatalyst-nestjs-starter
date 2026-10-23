import { isAxiosError } from 'axios';

interface HealthError {
  code?: string;
  message: string;
  statusCode?: number;
  statusText?: string;
}

export function transformError(error: unknown): unknown {
  return isAxiosError(error)
    ? ({
        code: error.code,
        message: error.message,
        statusCode: error.response?.status,
        statusText: error.response?.statusText,
      } satisfies HealthError)
    : error;
}

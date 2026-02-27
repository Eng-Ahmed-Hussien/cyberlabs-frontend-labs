import { httpClient } from '@/shared/api/httpClient';

export interface LoginResponse {
  success: boolean;
  username: string;
  role: 'USER' | 'ADMIN';
  flag?: string;
  exploited?: boolean;
  message?: string;
}

export const initLab1 = async (labId: string): Promise<void> => {
  await httpClient.post('/practice-labs/sql-injection/lab1/start', { labId });
};

export const loginLab1 = async (
  labId: string,
  username: string,
  password: string,
): Promise<LoginResponse> => {
  const res = await httpClient.post('/practice-labs/sql-injection/lab1/login', {
    labId,
    username,
    password,
  });
  return res.data;
};

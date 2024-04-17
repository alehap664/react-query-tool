import { QueryClient } from '@tanstack/react-query';
import { describe, expect, test } from 'vitest';

import { rqt } from '..';

const queryClient = new QueryClient();

describe('Test', () => {
  type TStudent = {
    id: string;
    first_name: string;
    last_name: string;
    age: number;
    email: string;
  };
  type Param = { page: string; limit: string };

  const query = rqt.query({
    key: 'example' as const,
    queryKey: (params?: Param) => [params?.page, params?.limit] as const,
    queryFn: async (params) => {
      const search = new URLSearchParams(params);
      const res = await fetch(
        `https://6503cbffc8869921ae242b7b.mockapi.io/api/v1/students?${search.toString()}`,
        { method: 'GET' }
      );
      return (await res.json()) as Array<TStudent>;
    }
  });

  test('Limit = 10', async () => {
    const data = await queryClient.fetchQuery(
      query.extend({ params: { page: '1', limit: '10' } })
    );
    expect(data.length).toEqual(10);
  });
  test('Limit = 20', async () => {
    const data = await queryClient.fetchQuery(
      query.extend({ params: { page: '1', limit: '20' } })
    );
    expect(data.length).toEqual(20);
  });
  test('get data cached with limit = 10', async () => {
    const cached =
      queryClient.getQueryData(query.getQueryKey({ page: '1', limit: '10' })) ??
      [];
    expect(cached.length).toEqual(10);
  });
  test('get data cached with limit = 20', async () => {
    const cached =
      queryClient.getQueryData(query.getQueryKey({ page: '1', limit: '20' })) ??
      [];
    expect(cached.length).toEqual(20);
  });
  test('get data cached with limit = 30', async () => {
    const cached =
      queryClient.getQueryData(query.getQueryKey({ page: '1', limit: '30' })) ??
      [];
    console.log({ cached });
    expect(cached.length).toEqual(0);
  });
});

import type { DataTag, DefaultError, QueryKey, UseQueryOptions } from '@tanstack/react-query';

import type { Param, TQueryMeta } from './types';

type THelperOptions<TData = unknown, TParams extends Param = Param, TKey = string, TQueryKey = QueryKey> = {
  key: TKey;
  queryFn: (params?: TParams) => Promise<TData>;
  queryKey?: (params?: TParams) => TQueryKey;
};
type TGetKeyOptions = {
  /**
   * @default true
   * */
  nullish?: boolean;
};
type TExtendOptions<
  TQueryFnData = unknown,
  TParams extends Param = Param,
  TData = TQueryFnData,
  TError = DefaultError,
  TQueryKey extends QueryKey = QueryKey
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn' | 'select' | 'meta'> & {
  params?: TParams;
  select?: (data: TQueryFnData) => TData;
  meta?: TQueryMeta<TQueryFnData, TError, TData, TQueryKey>;
};

const query = <TKey = string, TData = unknown, TParams extends Param = Param, TError = DefaultError, TQueryKey extends QueryKey = QueryKey>(
  options: THelperOptions<TData, TParams, TKey, TQueryKey>
) => {
  type TExtend<T = TData> = TExtendOptions<TData, TParams, T, TError, Readonly<[TKey, ...TQueryKey]>>;
  let defaultOptions = {};

  const { key, queryFn, queryKey } = options;

  const getQueryKey = (params?: TParams, opts: TGetKeyOptions = {}) => {
    const { nullish = true } = opts;
    let keys = [key] as unknown as TQueryKey;

    if (queryKey) keys = queryKey(params);
    const returnKeys = [key, ...keys] as DataTag<[TKey, ...TQueryKey], TData>;

    if (nullish) return returnKeys;
    return returnKeys.filter(Boolean) as never;
  };
  const getBaseQuery = (params?: TParams) => {
    return {
      queryKey: getQueryKey(params),
      queryFn: () => queryFn(params)
    };
  };
  const extend = <T = TData>(options: TExtend<T> = {}) => {
    const { params, ...rest } = options;
    return {
      ...getBaseQuery(params),
      ...(defaultOptions as TExtend<T>),
      ...rest
    };
  };

  const setDefaultOptions = <T = TData>(options: TExtend<T> = {}) => {
    defaultOptions = options;
  };

  return {
    key,
    defaultOptions: defaultOptions as Readonly<TExtend<TData>>,
    setDefaultOptions,
    fetch: queryFn,
    getQueryKey,
    extend
  };
};

export type { TExtendOptions as TQueryExtendOptions, THelperOptions as TQueryHelperOptions };

export { query };

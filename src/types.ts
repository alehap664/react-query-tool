/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultError, Mutation, MutationKey, Query, QueryKey } from '@tanstack/react-query';

import { mutation, query } from '.';

type Param = Record<string, unknown>;
type Variables = Record<string, unknown>;
type QueryHelper<TKey = string, TData = unknown, TParams extends Param = Param, TError = DefaultError, TQueryKey extends QueryKey = QueryKey> = ReturnType<
  typeof query<TKey, TData, TParams, TError, TQueryKey>
>;
type TMutationHelper<
  TKey = string,
  TData = unknown,
  TVariables extends Variables = Variables,
  TParams extends Param = Param,
  TError = DefaultError,
  TMutationKey extends MutationKey = MutationKey
> = ReturnType<typeof mutation<TKey, TData, TVariables, TParams, TError, TMutationKey>>;
type TQueryMeta<TQueryFnData = unknown, TError = DefaultError, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> = {
  onError?: (error: TError, query: Query<TQueryFnData, TError, TData, TQueryKey>) => void;
  onSuccess?: (data: TQueryFnData, query: Query<TQueryFnData, TError, TData, TQueryKey>) => void;
  onSettled?: (data: TQueryFnData | undefined, error: DefaultError | null, query: Query<TQueryFnData, TError, TData, TQueryKey>) => void;
};

type TMutationMeta<TData = unknown, TError = DefaultError, TVariables = Variables> = {
  onError?: (error: TError, variables: TVariables, context: unknown, mutation: Mutation<TData, TError, TVariables>) => Promise<TData> | TData;
  onSuccess?: (data: TData, variables: TVariables, context: unknown, mutation: Mutation<TData, TError, TVariables>) => Promise<TData> | TData;
  onMutate?: (variables: TVariables, mutation: Mutation<TData, TError, TVariables>) => Promise<TData> | TData;
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context: unknown,
    mutation: Mutation<TData, TError, TVariables>
  ) => Promise<TData> | TData;
};
type inferOptions<T extends (...args: any) => any = QueryHelper['extend'] | TMutationHelper['extend']> = Parameters<T>[0];

export type { inferOptions, Param, TMutationMeta, TQueryMeta, Variables };

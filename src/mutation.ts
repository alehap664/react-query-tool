import type { DefaultError, MutationKey, UseMutationOptions } from '@tanstack/react-query';
import type { ZodType } from 'zod';

import type { Param, Variables } from './types';

type TArgs<TVariables extends Variables = Variables, TParams extends Param = Param> = {
  variables?: TVariables;
  params?: TParams;
};
type THelperOptions<TData = unknown, TParams extends Param = Param, TVariables extends Variables = Variables, TKey = string, TMutationKey = MutationKey> = {
  key: TKey;
  mutationFn: (args: TArgs<TVariables, TParams>) => Promise<TData>;
  mutationKey?: (params?: TParams) => TMutationKey;
  validator?: ZodType<TVariables>;
};
type TGetKeyOptions = {
  /**
   * @default true
   * */
  nullish?: boolean;
};
type TExtendOptions<TData = unknown, TVariables extends Variables = Variables, TParams extends Param = Param, TError = DefaultError> = Omit<
  UseMutationOptions<TData, TError, TArgs<TVariables, TParams>>,
  'mutationKey' | 'mutationFn'
> & {
  params?: TParams;
};

const mutation = <
  TKey = string,
  TData = unknown,
  TVariables extends Variables = Variables,
  TParams extends Param = Param,
  TError = DefaultError,
  TMutationKey extends MutationKey = MutationKey
>(
  options: THelperOptions<TData, TParams, TVariables, TKey, TMutationKey>
) => {
  type TExtend = TExtendOptions<TData, TVariables, TParams, TError>;
  let defaultOptions: TExtend = {};

  const { key, mutationFn, mutationKey, validator } = options;

  const getMutationKey = (params?: TParams, opts: TGetKeyOptions = {}) => {
    const { nullish = true } = opts;
    let keys = [key] as unknown as TMutationKey;

    if (mutationKey) keys = mutationKey(params);
    const returnKeys = [key, ...keys] as const;

    if (nullish) return returnKeys;
    return returnKeys.filter(Boolean) as never;
  };
  const getMutation = (params?: TParams) => {
    const rootPrams = params;
    return {
      mutationKey: getMutationKey(rootPrams),
      mutationFn: ({ params, variables }: TArgs<TVariables, TParams>) => {
        return mutationFn({
          params: { ...rootPrams, ...params } as TParams,
          variables
        });
      }
    };
  };

  const extend = (options: TExtend = {}) => {
    const { params: optionsParams, onMutate, ...rest } = options;
    const { params: defaultParams, ...restDefault } = defaultOptions;
    let validatorOpts: TExtend = {};

    if (validator) {
      validatorOpts = {
        onMutate(variables) {
          onMutate?.(variables);
          validator.parse(variables);
        }
      };
    } else {
      validatorOpts = { onMutate };
    }

    return {
      ...getMutation({
        ...defaultParams,
        ...optionsParams
      } as TParams),
      ...restDefault,
      ...validatorOpts,
      ...rest
    };
  };

  const setDefaultOptions = (options: TExtend = {}) => {
    defaultOptions = options;
  };

  return {
    key,
    defaultOptions: defaultOptions as Readonly<TExtend>,
    setDefaultOptions,
    fetch: mutationFn,
    getMutationKey,
    extend
  };
};

export type { TExtendOptions as TExtendMutationOptions, TArgs as TMutationArgs, THelperOptions as TMutationHelperOptions };

export { mutation };

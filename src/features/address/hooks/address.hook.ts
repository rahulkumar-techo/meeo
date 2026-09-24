import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { addressApiService } from "../services/address.service";
import type {
  Address,
  UpdateAddressInput,
  AddressListResponse,
  AddressCreateResponse,
  AddressDetailResponse,
} from "../validations/address.validation";
import type { ApiResponse } from "@/types/api-response.type";

/**
 * Address Query Keys Factory
 */
export const ADDRESS_QUERY_KEYS = {
  all: ["addresses"] as const,
  lists: () => [...ADDRESS_QUERY_KEYS.all, "list"] as const,
  detail: (id: string) => [...ADDRESS_QUERY_KEYS.all, "detail", id] as const,
};

type QueryOptionsWithoutKeyAndFn<TData, TError = Error> = Omit<
  UseQueryOptions<TData, TError, TData, any>,
  "queryKey" | "queryFn"
>;

/**
 * 1. Hook to fetch all saved addresses
 */
export const useGetAddresses = <TData = AddressListResponse>(
  options?: QueryOptionsWithoutKeyAndFn<TData>
) => {
  return useQuery({
    queryKey: ADDRESS_QUERY_KEYS.lists(),
    queryFn: () => addressApiService.getAddresses() as Promise<TData>,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    ...options,
  });
};

/**
 * 2. Hook to create a new address
 */
export const useCreateAddress = (
  options?: UseMutationOptions<AddressCreateResponse, Error, Address>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Address) => addressApiService.createNewAddress(payload),
    onSuccess: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEYS.all });
      (options?.onSuccess as any)?.(...args);
    },
    ...options,
  });
};

/**
 * 3. Hook to update an existing address
 */
export const useUpdateAddress = (
  options?: UseMutationOptions<
    AddressDetailResponse,
    Error,
    { addressId: string; payload: UpdateAddressInput }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ addressId, payload }) =>
      addressApiService.updateAddress(addressId, payload),
    onSuccess: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEYS.all });
      (options?.onSuccess as any)?.(...args);
    },
    ...options,
  });
};

/**
 * 4. Hook to delete an address
 */
export const useDeleteAddress = (
  options?: UseMutationOptions<ApiResponse<void>, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (addressId: string) => addressApiService.deleteAddress(addressId),
    onSuccess: (...args: any[]) => {
      queryClient.invalidateQueries({ queryKey: ADDRESS_QUERY_KEYS.all });
      (options?.onSuccess as any)?.(...args);
    },
    ...options,
  });
};

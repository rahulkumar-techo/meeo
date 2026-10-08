import api from "@/apis";
import { ApiRoute } from "@/routes";
import { ApiResponse } from "@/types/api-response.type";
import type {
  Address,
  UpdateAddressInput,
  AddressCreateResponse,
  AddressListResponse,
  AddressDetailResponse,
} from "../validations/address.validation";

export const addressApiService = {
  /**
   * 1. Get all saved addresses of the current user
   * GET /api/v1/user/addresses
   */
  async getAddresses(): Promise<AddressListResponse> {
    const { data } = await api.get<AddressListResponse>(
      ApiRoute.ADDRESS.ADDRESSES
    );
    return data;
  },

  /**
   * 2. Create a new delivery address
   * POST /api/v1/user/addresses
   */
  async createNewAddress(payload: Address): Promise<AddressCreateResponse> {
    const { data } = await api.post<AddressCreateResponse>(
      ApiRoute.ADDRESS.ADDRESSES,
      payload
    );
    return data;
  },

  /**
   * 3. Update an existing address
   * PATCH /api/v1/user/addresses/:addressId
   */
  async updateAddress(
    addressId: string,
    payload: UpdateAddressInput
  ): Promise<AddressDetailResponse> {
    const { data } = await api.patch<AddressDetailResponse>(
      ApiRoute.ADDRESS.UPDATE_ADDRESS(addressId),
      payload
    );
    return data;
  },

  /**
   * 4. Delete an address
   * DELETE /api/v1/user/addresses/:addressId
   */
  async deleteAddress(addressId: string): Promise<ApiResponse<void>> {
    const { data } = await api.delete<ApiResponse<void>>(
      ApiRoute.ADDRESS.DELETE_ADDRESS(addressId)
    );
    return data;
  },
};

export const addressService = addressApiService;
export default addressApiService;
// Define the wrapper structure using a generic type parameter <T>
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface ProductCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string;
  status?: string;
  parentId?: string | null;
  sortOrder?: number;
}




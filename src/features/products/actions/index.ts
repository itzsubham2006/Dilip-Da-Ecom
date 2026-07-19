'use server';

import { getServerSession } from '@/features/auth/actions';
import { restaurantRepository } from '@/features/restaurants/repositories';
import { productRepository, categoryRepository } from '../repositories';
import type { Product, ProductFormData, Category, CategoryFormData, ProductsFilter } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function getMerchantRestaurantId(): Promise<string | null> {
  const { user } = await getServerSession();
  if (!user) return null;
  const restaurant = await restaurantRepository.findByOwnerId(user.id);
  return restaurant?.id ?? null;
}

export async function getProducts(filter: ProductsFilter = {}): Promise<ApiResponse<Product[]>> {
  const restaurantId = await getMerchantRestaurantId();
  if (!restaurantId) return { success: false, error: 'Unauthorized' };
  const products = await productRepository.findByRestaurant(restaurantId, filter);
  return { success: true, data: products };
}

export async function getProduct(productId: string): Promise<ApiResponse<Product>> {
  const restaurantId = await getMerchantRestaurantId();
  if (!restaurantId) return { success: false, error: 'Unauthorized' };
  const product = await productRepository.findById(productId);
  if (!product || product.restaurant_id !== restaurantId) return { success: false, error: 'Product not found' };
  return { success: true, data: product };
}

export async function createProduct(data: ProductFormData): Promise<ApiResponse<Product>> {
  const restaurantId = await getMerchantRestaurantId();
  if (!restaurantId) return { success: false, error: 'Unauthorized' };
  const product = await productRepository.create(restaurantId, data);
  if (!product) return { success: false, error: 'Failed to create product' };
  return { success: true, data: product };
}

export async function updateProduct(productId: string, data: Partial<ProductFormData>): Promise<ApiResponse<Product>> {
  const restaurantId = await getMerchantRestaurantId();
  if (!restaurantId) return { success: false, error: 'Unauthorized' };
  const existing = await productRepository.findById(productId);
  if (!existing || existing.restaurant_id !== restaurantId) return { success: false, error: 'Product not found' };
  const product = await productRepository.update(productId, restaurantId, data);
  if (!product) return { success: false, error: 'Failed to update product' };
  return { success: true, data: product };
}

export async function archiveProduct(productId: string): Promise<ApiResponse<void>> {
  const restaurantId = await getMerchantRestaurantId();
  if (!restaurantId) return { success: false, error: 'Unauthorized' };
  const ok = await productRepository.softDelete(productId, restaurantId);
  return ok ? { success: true } : { success: false, error: 'Failed to archive' };
}

export async function restoreProduct(productId: string): Promise<ApiResponse<void>> {
  const restaurantId = await getMerchantRestaurantId();
  if (!restaurantId) return { success: false, error: 'Unauthorized' };
  const ok = await productRepository.restore(productId, restaurantId);
  return ok ? { success: true } : { success: false, error: 'Failed to restore' };
}

export async function deleteProduct(productId: string): Promise<ApiResponse<void>> {
  const restaurantId = await getMerchantRestaurantId();
  if (!restaurantId) return { success: false, error: 'Unauthorized' };
  const ok = await productRepository.hardDelete(productId, restaurantId);
  return ok ? { success: true } : { success: false, error: 'Cannot delete: product has order history' };
}

export async function updateProductStock(productId: string, quantity: number): Promise<ApiResponse<Product>> {
  const restaurantId = await getMerchantRestaurantId();
  if (!restaurantId) return { success: false, error: 'Unauthorized' };
  const product = await productRepository.updateStock(productId, restaurantId, quantity);
  if (!product) return { success: false, error: 'Failed to update stock' };
  return { success: true, data: product };
}

export async function getCategories(includeInactive = false): Promise<ApiResponse<Category[]>> {
  const restaurantId = await getMerchantRestaurantId();
  if (!restaurantId) return { success: false, error: 'Unauthorized' };
  const categories = await categoryRepository.findByRestaurant(restaurantId, includeInactive);
  const products = await productRepository.findByRestaurant(restaurantId);
  const counts: Record<string, number> = {};
  for (const p of products) {
    if (p.category_id) counts[p.category_id] = (counts[p.category_id] ?? 0) + 1;
  }
  const withCounts = categories.map((c) => ({ ...c, product_count: counts[c.id] ?? 0 }));
  return { success: true, data: withCounts };
}

export async function createCategory(data: CategoryFormData): Promise<ApiResponse<Category>> {
  const restaurantId = await getMerchantRestaurantId();
  if (!restaurantId) return { success: false, error: 'Unauthorized' };
  const category = await categoryRepository.create(restaurantId, data);
  if (!category) return { success: false, error: 'Failed to create category' };
  return { success: true, data: category };
}

export async function updateCategory(categoryId: string, data: Partial<CategoryFormData>): Promise<ApiResponse<Category>> {
  const restaurantId = await getMerchantRestaurantId();
  if (!restaurantId) return { success: false, error: 'Unauthorized' };
  const existing = await categoryRepository.findById(categoryId);
  if (!existing || existing.restaurant_id !== restaurantId) return { success: false, error: 'Category not found' };
  const category = await categoryRepository.update(categoryId, restaurantId, data);
  if (!category) return { success: false, error: 'Failed to update category' };
  return { success: true, data: category };
}

export async function deleteCategory(categoryId: string): Promise<ApiResponse<void>> {
  const restaurantId = await getMerchantRestaurantId();
  if (!restaurantId) return { success: false, error: 'Unauthorized' };
  const existing = await categoryRepository.findById(categoryId);
  if (!existing || existing.restaurant_id !== restaurantId) return { success: false, error: 'Category not found' };
  const ok = await categoryRepository.delete(categoryId, restaurantId);
  return ok ? { success: true } : { success: false, error: 'Failed to delete category' };
}

export async function reorderCategories(ids: string[]): Promise<ApiResponse<void>> {
  const restaurantId = await getMerchantRestaurantId();
  if (!restaurantId) return { success: false, error: 'Unauthorized' };
  const ok = await categoryRepository.reorder(ids);
  return ok ? { success: true } : { success: false, error: 'Failed to reorder' };
}

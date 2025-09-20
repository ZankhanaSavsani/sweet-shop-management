import api from './api';

export interface Sweet {
  _id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export const getSweets = async (): Promise<Sweet[]> => {
  const response = await api.get('/sweets');
  return response.data.data.sweets;
};

export const searchSweets = async (params: {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Sweet[]> => {
  const response = await api.get('/sweets/search', { params });
  return response.data.data.sweets;
};

export const createSweet = async (sweet: Omit<Sweet, '_id'>): Promise<Sweet> => {
  const response = await api.post('/sweets', sweet);
  return response.data.data.sweet;
};

export const updateSweet = async (id: string, sweet: Partial<Sweet>): Promise<Sweet> => {
  const response = await api.put(`/sweets/${id}`, sweet);
  return response.data.data.sweet;
};

export const deleteSweet = async (id: string): Promise<void> => {
  await api.delete(`/sweets/${id}`);
};

export const purchaseSweet = async (id: string, quantity: number): Promise<Sweet> => {
  const response = await api.post(`/sweets/${id}/purchase`, { quantity });
  return response.data.data.sweet;
};

export const restockSweet = async (id: string, quantity: number): Promise<Sweet> => {
  const response = await api.post(`/sweets/${id}/restock`, { quantity });
  return response.data.data.sweet;
};
import axios from 'axios';
import { LoginCredentials, RegisterData } from '../types';

const AUTH_API = 'https://dummyjson.com';

// Authentication API
export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await axios.post(`${AUTH_API}/auth/login`, credentials);
    return response.data;
  },
  
  getUser: async (userId: number) => {
    const response = await axios.get(`${AUTH_API}/users/${userId}`);
    return response.data;
  },
};

// Fitness exercises - using a mock data approach since free fitness APIs require keys
export const exercisesApi = {
  getExercises: async () => {
    // Using DummyJSON products as exercise placeholders
    // In real app, you'd use ExerciseDB API with RapidAPI key
    const response = await axios.get(`${AUTH_API}/products?limit=20`);
    
    // Transform products to exercise-like data
    return response.data.products.map((product: any) => ({
      id: product.id.toString(),
      name: product.title,
      gifUrl: product.thumbnail,
      target: product.category,
      bodyPart: product.brand || 'General',
      equipment: product.tags?.[0] || 'Bodyweight',
      description: product.description,
      rating: product.rating,
    }));
  },
  
  getExerciseById: async (id: string) => {
    const response = await axios.get(`${AUTH_API}/products/${id}`);
    const product = response.data;
    return {
      id: product.id.toString(),
      name: product.title,
      gifUrl: product.thumbnail,
      target: product.category,
      bodyPart: product.brand || 'General',
      equipment: product.tags?.[0] || 'Bodyweight',
      description: product.description,
      rating: product.rating,
      price: product.price,
      stock: product.stock,
    };
  },
};

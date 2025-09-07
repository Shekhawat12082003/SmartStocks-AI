import { create } from 'zustand';
import api from '../lib/api';

const usePredictionStore = create((set) => ({
  latest: null,
  metrics: null,
  history: [],
  prediction: null,
  isLoading: false,
  loading: false,  // Keep for compatibility
  error: null,
  
  fetchLatest: async (ticker) => {
    set({ loading: true, isLoading: true, error: null });
    try {
      const res = await api.get(`/latest/${ticker}`);
      set({ latest: res.data, loading: false, isLoading: false });
    } catch (e) {
      set({ error: e.message, loading: false, isLoading: false });
    }
  },
  
  predict: async (params) => {
    set({ loading: true, isLoading: true, error: null });
    try {
      const res = await api.post('/predict', params);
      set({
        prediction: res.data,  // Store full prediction data
        latest: res.data.latest,
        metrics: res.data.metrics,
        history: res.data.history,
        loading: false,
        isLoading: false,
      });
    } catch (e) {
      set({ error: e.message, loading: false, isLoading: false });
    }
  },
}));

export default usePredictionStore;

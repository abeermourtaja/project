import { create } from 'zustand';
import api from '../services/api';
import { ENDPOINTS } from '../services/endpoints';
import type { Lecture, Paginated, LectureQuery } from '../types/lecture';

interface LecturesState {
  items: Lecture[];
  total: number;
  loading: boolean;
  error: string | null;
  query: LectureQuery;
}

interface LecturesActions {
  setQuery: (patch: Partial<LectureQuery>) => void;
  fetch: () => Promise<void>;
}

export const useLecturesStore = create<LecturesState & LecturesActions>((set, get) => ({
  items: [],
  total: 0,
  loading: false,
  error: null,
  query: { page: 1, pageSize: 10, search: '' },

  setQuery: (patch) => set((s) => ({ query: { ...s.query, ...patch } })),

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const { query } = get();
      const q = new URLSearchParams({
        page: String(query.page ?? 1),
        pageSize: String(query.pageSize ?? 10),
        q: query.search ?? '',
      }).toString();
      const { data } = await api.get<Paginated<Lecture>>(ENDPOINTS.lectures(`?${q}`));
      set({ items: data.items, total: data.total, loading: false });
    } catch (e: any) {
      set({ loading: false, error: e?.message ?? 'Failed to load' });
    }
  },
}));

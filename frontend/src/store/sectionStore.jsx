import { create } from "zustand";
import { axiosInstance } from "../axios/axios";
import toast from "react-hot-toast";

const sectionStore = create((set, get) => ({
  sections: [],
  currentSection: undefined,
  loading: false,
  error: null,

  createSection: async (data) => {
    set({ loading: true });
    try {
      await axiosInstance.post("/section", data);
      get().getSections();
      document.getElementById("createSection").close();
      toast.success("Section Created Successfully");
    } catch (error) {
      toast.error(error);
    } finally {
      set({ loading: false });
    }
  },

  getSections: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/section");
      set({ sections: res.data.data, error: null });
    } catch (error) {
      set({
        sections: [],
        error: error.response?.data?.message || "Failed to fetch sections",
      });
    } finally {
      set({ loading: false });
    }
  },

  getSection: async (id) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/section/${id}`);
      set({ currentSection: res.data.data });
    } catch (error) {
      toast.error(error);
    } finally {
      set({ loading: false });
    }
  },

  updateSection: async (id, data) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.put(`/section/${id}`, data);
      set((state) => ({
        sections: state.sections.map((sec) =>
          sec._id === id ? res.data.data : sec
        ),
      }));
      toast.success("Section Updated Successfully");
    } catch (error) {
      toast.error(error);
    } finally {
      set({ loading: false });
    }
  },

  delSection: async (id) => {
    try {
      await axiosInstance.delete(`section/${id}`);
      set((state) => ({
        sections: state.sections.filter((sec) => sec._id !== id),
      })),
        toast.success("Section Deleted Successfully");
    } catch (error) {
      toast.error(error);
    }
  },

  clearCurrentSection: () => {
    set({ currentSection: undefined });
  },
}));

export default sectionStore;

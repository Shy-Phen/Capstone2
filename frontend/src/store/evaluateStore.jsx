import { create } from "zustand";
import { axiosInstance } from "../axios/axios";
import { toast } from "react-hot-toast";

export const evaluateStore = create((set) => ({
  evaluated: [],
  isCreatingEval: false,
  currentEval: null,
  loading: false,
  currentAssessmentt: null,

  createEvaluation: async (data) => {
    set({ loading: true });
    try {
      await axiosInstance.post("/evaluate", data);
      toast.success("Evaluation created successfully");
    } catch (error) {
      console.error("Evaluation error:", error);
      toast.error(error.message || "Failed to create evaluation");
    } finally {
      set({ loading: false });
    }
  },

  getAllEvaluated: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/evaluate");
      console.log("This are the", res.data);
      set({ evaluated: res.data });
    } catch (error) {
      console.error("Error fetching evaluations:", error);
      toast.error("Failed to fetch evaluations");
    } finally {
      set({ loading: false });
    }
  },

  getOneAssessmentt: async (id) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/assessment-framework/${id}`);
      const assessment = res.data.assessmentFramework;

      set({
        currentAssessmentt: assessment,
      });
    } catch (error) {
      console.error("Error loading assessment:", error);
      toast.error("Failed to load assessment");
    } finally {
      set({ loading: false });
    }
  },

  deleteEvaluation: async (id) => {
    set({ loading: true });
    try {
      console.log(`Deleting assessment with ID: ${id}`); // Debugging
      await axiosInstance.delete(`/evaluate/${id}`);
      set((state) => ({
        evaluated: state.evaluated.filter((evalu) => evalu._id !== id),
      })),
        toast.success("Deleted succesfully");
      console.log("hah");
    } catch (error) {
      toast.error(error);
    } finally {
      set({ loading: false });
    }
  },

  getOneEvaluation: async (id) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/evaluate/${id}`);
      console.log("Fetched eval:", res.data.data);
      set({ currentEval: res.data.data });
    } catch (error) {
      console.log("Error in getting eval", error);
    } finally {
      set({ loading: false });
    }
  },
}));

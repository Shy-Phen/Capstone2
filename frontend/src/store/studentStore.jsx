import { create } from "zustand";
import { axiosInstance } from "../axios/axios";
import toast from "react-hot-toast";

export const studentStore = create((set, get) => ({
  loading: false,
  students: [],
  currentStudent: undefined,

  createStudent: async (data) => {
    set({ loading: true });
    try {
      await axiosInstance.post("/student", data);
      get().getStudents();
      toast.success("Student Created Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ loading: false });
    }
  },

  getStudents: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/student");
      set({ students: res.data.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ loading: false });
    }
  },

  getStudent: async (id) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/student/oneStud/${id}`);
      set({ currentStudent: res.data.data });
      console.log(id);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  sortstudentBySection: async (id) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get(`/student/studentBySection/${id}`);
      set({ students: res.data.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch students by section"
      );
    } finally {
      set({ loading: false });
    }
  },

  clearSectionFilter: () => {
    set({ studentBySection: [] });
  },

  updateStudentInfo: async (id, data) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.put(`/student/${id}`, data);
      set({ currentStudent: res.data.data });
      set((state) => ({
        students: state.students.map((stud) =>
          stud._id === id ? res.data.data : stud
        ),
      }));

      console.log(res.data.data);
      toast.success("Student Updated Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ loading: false });
    }
  },

  deleteStudent: async (id) => {
    try {
      await axiosInstance.delete(`/student/${id}`);
      set((state) => ({
        students: state.students.filter((stud) => stud._id !== id),
      })),
        toast.success("Student Deleted Successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  searchStudent: async (data) => {
    set({ loading: true });
    console.log(data);
    try {
      const res = await axiosInstance.post("/student/searchStudent", data);
      set({ students: res.data.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  clearCurrentStudent: () => {
    set({ currentStudent: undefined });
  },
}));

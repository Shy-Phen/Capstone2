import sectionStore from "../store/sectionStore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentStore } from "../store/studentStore";
import { useEffect } from "react";

const CreateAndStudent = () => {
  const { sections } = sectionStore();
  const {
    createStudent,
    updateStudentInfo,
    currentStudent,
    clearCurrentStudent,
  } = studentStore();

  const StudSchema = z.object({
    studentFullName: z.string().trim().min(3),
    section: z
      .string()
      .min(1, "Section is required")
      .refine(
        (value) => /^[0-9a-fA-F]{24}$/.test(value),
        "Section must be a valid ObjectId"
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(StudSchema) });

  useEffect(() => {
    if (currentStudent) {
      reset({
        studentFullName: currentStudent.studentFullName,
        section: currentStudent.section?._id || "",
      });
    } else {
      reset({
        studentFullName: "",
        section: "",
      });
    }
  }, [currentStudent, reset]);

  const onSubmit = (data) => {
    if (currentStudent) {
      updateStudentInfo(currentStudent._id, data);
    } else {
      createStudent(data);
    }
    handleClose();
  };

  const handleClose = () => {
    clearCurrentStudent();
    reset();
    document.getElementById("createUpdateStudent").close();
  };

  console.log("clicked id" + currentStudent);

  return (
    <dialog id="createUpdateStudent" className="modal">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>
        <h6 className="text-center font-semibold">
          {currentStudent ? "Update Student" : "Create Student"}
        </h6>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center mt-2 gap-4 content-around">
            <div className="w-full max-w-xs">
              <input
                type="text"
                placeholder="Enter Student Name"
                className="input input-bordered w-full"
                {...register("studentFullName")}
              />
              {errors.studentFullName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.studentFullName.message}
                </p>
              )}
            </div>

            <div className="w-full max-w-xs">
              <select
                className="select select-accent w-full"
                {...register("section")}
              >
                <option disabled value="">
                  Select Section
                </option>
                {sections.map((sec) => (
                  <option key={sec._id} value={sec._id}>
                    {sec.sectionName}
                  </option>
                ))}
              </select>
              {errors.section && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.section.message}
                </p>
              )}
            </div>

            <div>
              <button
                className="btn btn-active btn-primary"
                type="submit"
                disabled={isSubmitting}
              >
                {currentStudent
                  ? isSubmitting
                    ? "Updating..."
                    : "Update"
                  : isSubmitting
                  ? "Creating..."
                  : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default CreateAndStudent;

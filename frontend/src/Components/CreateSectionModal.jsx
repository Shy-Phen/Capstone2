import { useForm } from "react-hook-form";
import sectionStore from "../store/sectionStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";

const CreateSectionModal = () => {
  const sectionSchema = z.object({
    sectionName: z
      .string()
      .trim()
      .min(1, { message: "Section name is required" }),
  });

  const { createSection, currentSection, updateSection, clearCurrentSection } =
    sectionStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(sectionSchema),
  });

  useEffect(() => {
    if (currentSection) {
      reset(
        currentSection
          ? { sectionName: currentSection.sectionName }
          : { sectionName: undefined }
      );
    } else {
      reset();
    }
  }, [currentSection, reset]);

  const onSubmit = (data) => {
    if (currentSection) {
      updateSection(currentSection._id, data);
    } else {
      createSection(data);
    }
    handleClose();
  };

  const handleClose = () => {
    document.getElementById("createSection").close();
    reset({ sectionName: undefined });
    clearCurrentSection();
  };

  console.log(currentSection);
  return (
    <dialog id="createSection" className="modal">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={handleClose}
        >
          ✕
        </button>

        <div className="w-full">
          <form
            className="flex flex-row items-center gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col w-full max-w-xs relative mb-4">
              <label className="label">
                <span className="label-text">Section Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter Section Name"
                className="input input-bordered w-full"
                {...register("sectionName")}
              />

              {errors.sectionName && (
                <span className="text-red-500 text-sm mt-1 absolute -bottom-5 left-0">
                  {errors.sectionName.message}
                </span>
              )}
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="btn btn-primary btn-md mt-5"
            >
              {currentSection ? "Update" : " Create"}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default CreateSectionModal;

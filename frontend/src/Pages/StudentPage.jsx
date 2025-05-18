import { Pencil, PlusCircleIcon, Search, Trash } from "lucide-react";
import CreateSectionModal from "../Components/CreateSectionModal";
import ViewSectionsModal from "../Components/ViewSectionsModal";
import CreateAndStudent from "../Components/CreateAndUpdateStudent";
import { searchValidation } from "../Validations/searchStudentValidation";
import { useForm } from "react-hook-form";
import { studentStore } from "../store/studentStore";
import { useEffect } from "react";
import sectionStore from "../store/sectionStore";
import { zodResolver } from "@hookform/resolvers/zod";

const StudentPage = () => {
  const {
    getStudents,
    students,
    deleteStudent,
    getStudent,
    sortstudentBySection,
    searchStudent,
    searchResult,
  } = studentStore();
  const { getSections, sections } = sectionStore();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(searchValidation) });

  useEffect(() => {
    getStudents();
    getSections();
  }, [getStudents, getSections]);

  const openModal = (id) => document.getElementById(id).showModal();

  const onSubmit = (data) => {
    if (data) {
      searchStudent(data);
    }
    reset();
  };

  console.log(searchResult);

  return (
    <div className="ml-10 lg:ml-64 mt-16 h-screen overflow-auto bg-base-200">
      <div className="flex flex-col h-full w-full">
        <div className="h-20 border-b-2">
          <div className="flex flex-row h-full items-center justify-between py-5">
            <div className="w-32">
              <CreateSectionModal />
              <ViewSectionsModal />
              <CreateAndStudent />
              <button
                className="btn btn-primary btn-md ml-4"
                onClick={() => openModal("createSection")}
              >
                <h6 className="text-center flex items-center gap-1">
                  <PlusCircleIcon className="w-4 h-4" />
                  <span>Section</span>
                </h6>
              </button>
            </div>
            <div className="w-32">
              <button
                className="btn btn-primary btn-md"
                onClick={() => openModal("ViewSections")}
              >
                <h6 className="text-center flex items-center">Section List</h6>
              </button>
            </div>
          </div>
        </div>

        <div className="h-20">
          <div className="flex flex-row justify-center items-center h-full">
            <form
              className="flex items-center gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                type="text"
                placeholder="Search By Name"
                className="input input-bordered input-md w-full max-w-xs"
                {...register("query")}
              />
              {errors.query && <p>{errors.query.message}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-square btn-primary btn-md"
                aria-label="Search"
              >
                <Search />
              </button>
            </form>
            <div className="dropdown">
              <label tabIndex={0} className="btn m-1">
                Filter By Section
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <button onClick={() => getStudents()}>
                    Show All Students
                  </button>
                </li>
                {sections.map((section) => (
                  <li key={section._id}>
                    <button
                      onClick={() => {
                        sortstudentBySection(section._id);
                      }}
                    >
                      {section.sectionName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-row h-14 items-center justify-between mx-16">
            <h6 className="font-semibold">Student List</h6>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => openModal("createUpdateStudent")}
            >
              <h6 className="text-center flex items-center gap-1">
                <PlusCircleIcon className="w-4 h-4" />
                <span>Student</span>
              </h6>
            </button>
          </div>

          <div className="m-4">
            <div className="overflow-x-auto rounded-box border pt-2 border-base-content/5 bg-base-100">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Section</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center">
                        No Students Found
                      </td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student._id}>
                        <td>{student?.studentFullName}</td>
                        <td>{student?.section?.sectionName || "No Section"}</td>
                        <td>
                          <button
                            className="btn btn-square bg-red-500 mr-2 btn-sm"
                            onClick={() => deleteStudent(student._id)}
                            aria-label="Delete student"
                          >
                            <Trash className="size-4" />
                          </button>
                          <button
                            className="btn btn-square btn-primary btn-sm"
                            onClick={() => {
                              getStudent(student._id);
                              openModal("createUpdateStudent");
                            }}
                            aria-label="Edit student"
                          >
                            <Pencil className="size-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;

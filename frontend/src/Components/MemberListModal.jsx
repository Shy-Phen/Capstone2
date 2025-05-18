import { useEffect } from "react";
import sectionStore from "../store/sectionStore";
import { studentStore } from "../store/studentStore";
import { useFormContext } from "react-hook-form";

const MemberListModal = ({ isModalOpen, setIsModalOpen }) => {
  const { getStudents, sortstudentBySection, students } = studentStore();
  const { getSections, sections } = sectionStore();
  const { watch, setValue } = useFormContext();

  useEffect(() => {
    if (!isModalOpen) return;
    getStudents();
    getSections();
  }, [isModalOpen, getStudents, getSections]);

  const currentMembers = watch("members") || [];

  const handleCheckboxChange = (studentId, studentName, isChecked) => {
    if (isChecked) {
      setValue("members", [...currentMembers, { name: studentName, score: 0 }]);
    } else {
      setValue(
        "members",
        currentMembers.filter((member) => member.name !== studentName)
      );
    }
  };

  const handleSubmit = () => {
    document.getElementById("memberList").close();
    setIsModalOpen(false);
  };

  return (
    <dialog id="memberList" className="modal">
      <div className="modal-box">
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => {
            document.getElementById("memberList").close();
            setIsModalOpen(false);
          }}
        >
          ✕
        </button>

        <h3 className="font-bold text-lg">Select Member</h3>

        <div className="w-full h-80 mt-4 pt-2 border-t-2">
          <div className="flex justify-center my-2">
            <div className="dropdown dropdown-bottom">
              <label tabIndex={0} className="btn m-1">
                Filter by Section
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                {sections.map((sec) => (
                  <li key={sec._id}>
                    <button
                      type="button"
                      onClick={() => sortstudentBySection(sec._id)}
                    >
                      {sec.sectionName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="form-control border-t pt-2">
            {students.map((stud) => {
              const isChecked = currentMembers.some(
                (member) => member.name === stud.studentFullName
              );

              return (
                <label className="label cursor-pointer" key={stud._id}>
                  <span className="label-text">{stud.studentFullName}</span>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={isChecked}
                    onChange={(e) =>
                      handleCheckboxChange(
                        stud._id,
                        stud.studentFullName,
                        e.target.checked
                      )
                    }
                  />
                </label>
              );
            })}
          </div>

          <div className="flex justify-center items-center py-2">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={currentMembers.length === 0}
            >
              Confirm Members
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default MemberListModal;

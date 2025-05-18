import { Eye, Pencil, Trash2Icon } from "lucide-react";
import { assessmentFrameworkStore } from "../store/assessmentFrameworkStore";
import { useNavigate } from "react-router-dom";

const AssessmentCard = ({ assessment }) => {
  const { deleteAssessment, getOneAssessment } = assessmentFrameworkStore();

  const navigate = useNavigate();

  const handleEdit = (id) => {
    console.log("🖱️ Clicked Assessment ID:", id);

    getOneAssessment(id);
    navigate("/edit-rubric");
  };

  const handleView = (id) => {
    getOneAssessment(id);
    document.getElementById("viewModal").showModal();
  };
  return (
    <div className="rounded-lg p-10  shadow-lg hover:shadow-xl transition-shadow duration-300 border hover:scale-105 transform">
      <div className="absolute left-5 top-2">
        <h1 className="text-sm font-medium">
          {assessment.title[0].toUpperCase() + assessment.title.slice(1)}
        </h1>
      </div>
      <div className="absolute left-5 bottom-2">
        <h6 className="text-xs">
          {new Date(assessment.createdAt).toLocaleDateString()}
        </h6>
      </div>
      <div className="absolute grid grid-cols-3 bottom-2 right-5 gap-2">
        <button
          className="flex justify-center items-center bg-blue-400 rounded size-5"
          onClick={() => {
            handleEdit(assessment._id);
          }}
        >
          <Pencil className="size-4" />
        </button>
        <button
          className="flex justify-center items-center bg-red-400/80 rounded size-5 "
          onClick={() => {
            deleteAssessment(assessment._id);
            console.log("Assessment ID:", assessment._id); // Debugging
          }}
        >
          <Trash2Icon className="size-4" />
        </button>
        <button
          className="flex justify-center items-center bg-blue-500 rounded size-5 "
          onClick={() => {
            handleView(assessment._id);
          }}
        >
          <Eye className="size-4" />
        </button>
      </div>
    </div>
  );
};
export default AssessmentCard;

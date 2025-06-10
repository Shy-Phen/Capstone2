import { PencilIcon, WandSparklesIcon } from "lucide-react";
import { assessmentFrameworkStore } from "../store/assessmentFrameworkStore";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import AssessmentCard from "../Components/AssessmentCard.jsx";

import ViewRubric from "../Components/ViewRubric";
import { useNavigate } from "react-router-dom";

const AssessmentFramework = () => {
  const { getAllAssessmentFramework, loading, assessments } =
    assessmentFrameworkStore();

  useEffect(() => {
    getAllAssessmentFramework();
  }, [getAllAssessmentFramework]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = assessments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(assessments.length / itemsPerPage);

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const navigate = useNavigate();

  const handleCreateRub = () => {
    navigate("/createRubric");
  };

  return (
    <div className="ml-10 lg:ml-64 h-screen overflow-auto bg-base-200">
      {assessments.length === 0 && !loading && (
        <div className="flex justify-center items-center size-full">
          <h1 className=" text-4xl">Create Rubric</h1>
        </div>
      )}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-screen ">
            <Loader className="size-10 animate-spin" />
          </div>
        ) : (
          assessments.length !== 0 && (
            <div className="grid grid-cols-1 ">
              <div className="mt-8 mb-5 h-8 place-items-center">
                <div className="h-10"></div>
                <div className="bg-base-100 shadow-md rounded ">
                  <h1 className="text-lg m-2">List of Rubrics</h1>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 m-8 gap-4">
                {currentItems.map((assessment) => (
                  <AssessmentCard
                    key={assessment._id}
                    assessment={assessment}
                  />
                ))}
              </div>
            </div>
          )
        )}
      </div>

      <ViewRubric />
      <div className="flex sm:flex-row md:flex-col absolute right-5 bottom-5 gap-2">
        {totalPages > 1 && (
          <div>
            <div className="join">
              <button
                onClick={goToPrevPage}
                className="join-item btn"
                disabled={currentPage === 1}
              >
                «
              </button>
              <button className="join-item btn">{currentPage}</button>
              <button
                onClick={goToNextPage}
                className="join-item btn"
                disabled={currentPage === totalPages}
              >
                »
              </button>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <div className="flex justify-center items-center rounded">
            <button
              onClick={() => navigate("/generate-rubric")}
              className="btn btn-outline btn-secondary btn-xs sm:btn-sm md:btn-md"
            >
              <WandSparklesIcon className="size-5 bg-blue" />
              Generate
            </button>
          </div>
          <div className="flex justify-center items-center rounded ">
            <button
              className="btn btn-outline btn-secondary btn-xs sm:btn-sm md:btn-md"
              onClick={handleCreateRub}
            >
              <PencilIcon className="size-5 rounded bg-blue" />{" "}
              <h2 className="mr-3">Create</h2>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentFramework;

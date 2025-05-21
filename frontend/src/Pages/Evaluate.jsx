import { evaluateStore } from "../store/evaluateStore";
import { useEffect, useState } from "react";
import { Loader, PlusCircleIcon } from "lucide-react";
import EvaluatedCard from "../Components/EvaluatedCard";
import { useNavigate } from "react-router-dom";

const Evaluate = () => {
  const { evaluated, loading, getAllEvaluated } = evaluateStore();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = evaluated.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(evaluated.length / itemsPerPage);

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    getAllEvaluated();
  }, [getAllEvaluated]);

  const handleNavigate = () => {
    navigate("/create");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (!Array.isArray(evaluated)) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-white text-4xl">Failed to load evaluations</h1>
      </div>
    );
  }

  return (
    <div className="ml-10 lg:ml-64 h-screen overflow-auto bg-base-200">
      <div className="h-14"></div>
      {evaluated.length === 0 && (
        <div className="flex justify-center items-center h-full w-full">
          <h1 className=" text-4xl">No evaluation found</h1>
        </div>
      )}

      {evaluated.length > 0 && (
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 m-8 gap-4">
            {currentItems.map((evalu) => (
              <EvaluatedCard key={evalu._id} evalu={evalu} />
            ))}
          </div>
        </div>
      )}

      <div className="flex sm:flex-row md:flex-col absolute right-5 bottom-5 gap-3">
        {totalPages > 1 && (
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
        )}
        <div className="">
          <button
            className="flex justify-center items-center w-12 h-12 rounded-full bg-black hover:bg-white transition-colors"
            onClick={handleNavigate}
          >
            <PlusCircleIcon className="w-8 h-8 text-white hover:text-black transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Evaluate;

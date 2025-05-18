import { assessmentFrameworkStore } from "../store/assessmentFrameworkStore";
import { EyeIcon } from "lucide-react";

const SearchRubricCard = ({ rubricData }) => {
  const { getOneAssessment, currentAssessment } = assessmentFrameworkStore();

  const handleView = async (id) => {
    await getOneAssessment(id);
    document.getElementById("viewRubric").showModal();
  };

  return (
    <div className="rounded-lg p-6 shadow-lg hover:shadow-xl h-40 w-full flex flex-col justify-between">
      <dialog id="viewRubric" className="modal">
        <div className="modal-box max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">{currentAssessment?.title}</h3>

          <table className="w-full border-collapse rounded-lg mt-8">
            <thead className="border ">
              <tr>
                <th className="border-r">Criteria</th>
                {currentAssessment?.scoringScale?.map((level) => (
                  <th key={level._id} className="text-sm border-r">
                    {level.score} - {level.description}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="border border-black">
              {currentAssessment?.criteriaArray?.map((cri) => (
                <tr key={cri._id} className="border">
                  <td className="text-sm font-semibold border">
                    {cri.criterion}
                  </td>

                  {cri.descriptor.map((index) => (
                    <td
                      key={`${cri._id}-${index}`}
                      className="text-xs border text-left p-2"
                    >
                      {" "}
                      {index}.
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </dialog>

      <h2 className="text-sm font-semibold mb-2">
        Group/Project name:{" "}
        <span className="text-sm text-blue-300">{rubricData.title}</span>
      </h2>

      <div className="flex items-center gap-8">
        <p className="text-sm text-slate-400">
          {new Date(rubricData.createdAt).toLocaleDateString()}
        </p>

        <button
          className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => {
            handleView(rubricData._id);
          }}
        >
          <EyeIcon className="size-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default SearchRubricCard;

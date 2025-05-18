import { assessmentFrameworkStore } from "../store/assessmentFrameworkStore";
import { themeStore } from "../store/themesStore";

const ViewRubEvalPage = () => {
  const { currentAssessment } = assessmentFrameworkStore();
  const { theme } = themeStore();

  return (
    <dialog id="viewModal" className="modal">
      <div className="modal-box max-w-5xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-0 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">{currentAssessment?.title}</h3>

        <table className="w-full border-collapse rounded mt-4">
          <thead
            className={`border ${
              theme === "night" ? "bg-base-300" : "bg-accent"
            }`}
          >
            <tr>
              <th className="border-r font-semibold">Criteria</th>
              {currentAssessment?.scoringScale?.map((level) => (
                <th key={level._id} className="text-sm border-r">
                  {level.score} - {level.description}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="border">
            {currentAssessment?.criteria?.map((cri) => (
              <tr key={cri._id} className="border">
                <td className="text-sm font-semibold border text-center ">
                  {cri.criteria}
                </td>

                {cri.descriptor.map((index) => (
                  <td
                    key={`${cri._id}-${index}`}
                    className="text-xs border text-left p-2"
                  >
                    {index}.
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </dialog>
  );
};

export default ViewRubEvalPage;

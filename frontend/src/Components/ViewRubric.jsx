import { assessmentFrameworkStore } from "../store/assessmentFrameworkStore";
import { File } from "lucide-react";
import { axiosInstance } from "../axios/axios";
import { themeStore } from "../store/themesStore";

const ViewRubric = () => {
  const { currentAssessment } = assessmentFrameworkStore();
  const { theme } = themeStore();

  const handleDownload = async (id) => {
    try {
      const res = await axiosInstance.get(`/downloadReport/${id}`, {
        responseType: "blob",
      });

      // Create a blob URL from the response data
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element to trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `rubric-${id}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      if (error.response?.status === 404) {
        alert("Rubric not found");
      } else if (error.response?.status === 403) {
        alert("You do not have permission to download this rubric");
      } else {
        alert("An error occurred during download");
      }
    }
  };

  return (
    <dialog id="viewModal" className="modal">
      <div className="modal-box max-w-5xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-0 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">{currentAssessment?.title}</h3>
        <h1 className="font-semibold mt-2">
          Posible Points: {currentAssessment?.total}
        </h1>

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
            {currentAssessment?.criteriaArray?.map((cri) => (
              <tr key={cri._id} className="border">
                <td className="text-sm font-semibold border text-center ">
                  {cri.criterion}
                </td>

                {cri.descriptor.map((index) => (
                  <td
                    key={`${cri._id}-${index}`}
                    className="text-xs border text-left p-2"
                  >
                    {index}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="w-full grid place-content-end mt-2 ">
          <button
            onClick={() => {
              handleDownload(currentAssessment?._id);
            }}
            className="btn btn-neutral btn-sm"
          >
            Download <File className="size-4" />
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ViewRubric;

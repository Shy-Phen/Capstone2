import { useRef, useEffect } from "react";
import domtoimage from "dom-to-image";
import { Download, Undo2 } from "lucide-react";
import { evaluateStore } from "../store/evaluateStore";
import { useNavigate, useParams } from "react-router-dom";

const ViewPage = () => {
  const { id } = useParams();
  const { currentEval, getOneEvaluation } = evaluateStore();

  useEffect(() => {
    if (id) getOneEvaluation(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const navigate = useNavigate();
  const componentRef = useRef(null);
  const handleDownload = () => {
    const node = componentRef.current;

    const options = {
      quality: 1,
      width: node.clientWidth,
      height: node.clientHeight,
      style: {
        margin: "0",
        padding: "0",
      },
    };

    domtoimage
      .toPng(node, options)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.download = "evaluation-details.png";
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error("Error generating image", error);
      });
  };

  return (
    <div className="ml-4 sm:ml-10 lg:ml-64 mt-14 p-4 min-h-screen bg-base-200">
      <div
        className="max-w-5xl mx-auto bg-white rounded-lg shadow-md my-6"
        ref={componentRef}
      >
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Evaluation Details
          </h1>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Project name / Group Name
                </p>
                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {currentEval?.title}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {new Date(currentEval?.createdAt).toDateString()}
                </p>
              </div>
            </div>
          </div>
          <div
            className={
              currentEval?.members?.length === 1
                ? "w-auto mb-8 border-gray-700 rounded-md"
                : "w-auto mb-8 border border-gray-700 rounded-md"
            }
          >
            <div className="overflow-x-auto scrollbar-hide">
              {currentEval?.members?.length > 1 ? (
                <table className="table text-black">
                  <thead className="text-black border">
                    <tr>
                      <th>Student Name</th>
                      <th>Individual Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEval?.members?.map((mem, index) => (
                      <tr key={index}>
                        <td>{mem.name}</td>
                        <td>{mem.score === 0 ? "N/A" : mem.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="w-full ml-4">
                  <div className="flex-row">
                    <h3 className=" text-black">
                      <span className="font-semibold">Student Name: </span>
                      {currentEval?.members?.map((mem, index) => (
                        <span key={index}>{mem.name}</span>
                      ))}
                    </h3>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="overflow-x-auto scrollbar-hide border border-black rounded-lg">
              <table className="w-full rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="p-4 text-left font-medium rounded-tl-lg w-1/3">
                      Criteria
                    </th>
                    {currentEval?.assessmentFramework?.scoringScale?.map(
                      (scale) => (
                        <th
                          key={scale._id}
                          className="p-3 text-left border-l border-gray-600"
                        >
                          <div className="flex flex-col">
                            <div className="pb-2 border-b border-gray-600 text-sm font-normal">
                              {scale.description}
                            </div>
                            <div className="pt-2 font-semibold">
                              {scale.score}
                            </div>
                          </div>
                        </th>
                      )
                    )}
                    <th className="p-4 text-left font-medium rounded-tr-lg w-24">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentEval?.assessmentFramework?.criteriaArray.map(
                    (cri) => (
                      <tr key={cri._id} className=" border-black text-black">
                        <td className="p-4 border-r border-black">
                          <div className="flex items-center">
                            <span className="text-gray-500 text-xl mr-2">
                              •
                            </span>
                            {cri.criterion}
                          </div>
                        </td>
                        {cri?.descriptor?.map((desc, index) => (
                          <td
                            key={index}
                            className="p-3 text-left border-r border-black"
                          >
                            {desc}
                          </td>
                        ))}
                        <td className="p-4 text-left font-medium">
                          {currentEval.criteriaAndScore.find(
                            (score) => score._id === cri._id
                          )?.score || cri.score}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <h1 className="text-xl text-black">
            Total Score: {currentEval?.criteriaTotalScore}{" "}
            {` / ${currentEval?.assessmentFramework?.total}`}
          </h1>
        </div>
      </div>

      <div className="flex justify-end mt-8 max-w-5xl mx-auto">
        <button className="btn btn-primary mr-2" onClick={handleDownload}>
          <Download size={18} />
          Download
        </button>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/evaluate")}
        >
          <Undo2 size={18} />
          <span>Back</span>
        </button>
      </div>
    </div>
  );
};

export default ViewPage;

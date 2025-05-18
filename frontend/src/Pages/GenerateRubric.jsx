import { SendHorizonalIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promptValidator } from "../Validations/GenerateValidation";
import { useNavigate } from "react-router-dom";
import { assessmentFrameworkStore } from "../store/assessmentFrameworkStore";
import { axiosInstance } from "../axios/axios";
import TableSkeleton from "../utils/tableSkeleton";

const GenerateRubric = () => {
  const navigate = useNavigate();
  const { createAssessment } = assessmentFrameworkStore();

  const [rubric, setRubric] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, error: useFormError },
  } = useForm({
    resolver: zodResolver(promptValidator),
  });

  const onSubmit = async (data) => {
    setError(null);

    try {
      setLoading(true);
      console.log("Generated rubric:", data);
      const res = await axiosInstance.post("/generate-rubric", data);
      setRubric(res.data.generatedRubric);
    } catch (err) {
      if (err.status === 429) {
        setError("Rate limit exceeded");
      } else {
        setError("Something went wrong");
      }
      console.error("Error:", err);
      reset();
    } finally {
      setLoading(false);
      reset();
    }
  };

  const saveGeneratedRubic = async () => {
    try {
      await createAssessment(rubric);
    } catch (error) {
      setError("Error in saving rubric", error);
      console.log(error);
    } finally {
      setRubric(null);
      navigate("/assessment-framework");
    }
  };

  const handleCancel = () => {
    setRubric(null);
    navigate("/assessment-framework");
  };

  return (
    <div className="ml-10 lg:ml-64 h-screen overflow-auto mt-0">
      <div className="mt-20 flex flex-col items-center ">
        {loading && <TableSkeleton />}
        {!rubric && !loading && (
          <div className="w-full flex flex-col items-center lg:mt-10">
            <div className="m-5 flex-col items-center">
              <h2 className="text-5xl myfont text-center">
                <span className="text-blue-600">Generate</span> a rubric in one
                prompt
              </h2>
              <p className="text-xl text-center lg:px-48 pt-2">
                Stop wasting time crafting rubrics from scratch—just prompt and
                go.
              </p>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-row gap-2 w-full items-center justify-center"
            >
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered input-primary w-full max-w-xs"
                {...register("userPrompt")}
              />
              {useFormError}
              <button
                disabled={isSubmitting}
                type="submit"
                className="btn btn-outline btn-primary"
              >
                {isSubmitting ? "..." : <SendHorizonalIcon />}
              </button>
            </form>
            <div className="mt-8 flex justify-center items-center">
              {!error ? (
                <h2 className="text-sm text-center">
                  <span className="bebas-neue-regular">Example prompt:</span>
                  <span className="font-thin">
                    <ul>
                      <li>
                        -Write a 4-level rubric for an elementary school art
                        assignment on color theory.
                      </li>
                      <li>
                        -Generate a 5-point rubric for grading college-level
                        research papers in psychology.
                      </li>
                    </ul>
                  </span>
                </h2>
              ) : (
                <div className="flex flex-row  justify-center items-center  gap-4 bg-red-50 border-l-4 border-red-500 p-2 mb-6 rounded-md">
                  <h3 className="text-lg font-medium text-red-700">Error:</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {rubric && !loading && (
          <div className=" w-full p-2 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold pb-3 mb-4 border-b border-gray-200">
              Generated Rubric: {rubric?.title} - {rubric?.total}
            </h2>

            <div className="overflow-auto border-x border-t border-gray-400 rounded-md">
              <table className="table">
                <thead>
                  <tr className="font-semibold border-collapse border-gray-400">
                    <th>Criteria</th>

                    {rubric?.scoringScale.map((scale, i) => (
                      <th key={i}>
                        {scale.description} ({scale.score})
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rubric?.criteriaArray.map((criterion, index) => (
                    <tr key={index} className="border-b border-gray-400">
                      <td>{criterion.criterion}</td>
                      {rubric.scoringScale.map((_, i) => (
                        <td key={i}>{criterion.descriptor[i]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {rubric && !loading && (
          <div className="flex flex-row gap-4 my-3">
            <button className="btn btn-neutral" onClick={handleCancel}>
              Go back
            </button>
            <button className="btn btn-secondary" onClick={saveGeneratedRubic}>
              Save Rubric
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateRubric;

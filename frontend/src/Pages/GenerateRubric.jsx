import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { promptValidator } from "../Validations/GenerateValidation";
import { useNavigate } from "react-router-dom";
import { assessmentFrameworkStore } from "../store/assessmentFrameworkStore";
import { axiosInstance } from "../axios/axios";
import TableSkeleton from "../utils/TableSkeleton";
import { promptSample } from "../utils/SamplePrompt";

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
    setValue,
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

  const handleSamplePrompt = (p) => {
    setValue("userPrompt", p, { shouldValidate: true });
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
            <div className="w-full md:px-48 h-28 m-2">
              <div className="flex justify-center border rounded-2xl size-full">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col w-full"
                >
                  <textarea
                    placeholder="Type here..."
                    className="w-full scrollbar-hide bg-transparent placeholder-gray-400 resize-none focus:outline-none textarea-md px-4 leading-relaxed "
                    {...register("userPrompt")}
                  />

                  {useFormError}
                  <div className="flex items-end justify-end w-full mt-1 py-1 pr-3 border-t">
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="btn btn-outline btn-primary btn-sm"
                    >
                      <Send className="size-5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="mt-8 flex justify-center items-center">
              {!error ? (
                <div className="flex flex-col justify-center items-center mx-8">
                  <h2 className="text-sm text-center">
                    <span className="bebas-neue-regular">Example prompt:</span>
                  </h2>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    {promptSample.map((p, i) => (
                      <div
                        className="rounded-lg border drop-shadow-md shadow-red-400 mx-2 text-center px-1 hover:bg-blue-500"
                        key={i}
                      >
                        <button
                          className="w-full py-2"
                          onClick={() => handleSamplePrompt(p)}
                        >
                          <p className="text-xs text-center">{p}</p>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
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
                    <th className="border-l border-gray-400">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rubric?.criteriaArray.map((criterion, index) => (
                    <tr key={index} className="border-b border-gray-400">
                      <td>{criterion.criterion}</td>
                      {rubric.scoringScale.map((_, i) => (
                        <td key={i}>{criterion.descriptor[i]}</td>
                      ))}
                      <td className="border-l border-gray-400"></td>
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

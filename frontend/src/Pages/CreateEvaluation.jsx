import { evaluateStore } from "../store/evaluateStore";
import MemberListModal from "../Components/MemberListModal";
import { assessmentFrameworkStore } from "../store/assessmentFrameworkStore";
import { useEffect, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { evalValidationForm } from "../Validations/evaluationFormValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const CreateEvaluation = () => {
  const { getAllAssessmentFramework, assessments } = assessmentFrameworkStore();
  const { getOneAssessmentt, currentAssessmentt, createEvaluation, loading } =
    evaluateStore();

  const methods = useForm({
    resolver: zodResolver(evalValidationForm),
    defaultValues: {
      title: "",
      members: [],
      assessmentFramework: "",
      criteriaTotalScore: 0,
      criteriaAndScore: [],
    },
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const [activeTab, setActiveTab] = useState("1");
  const [selected, setSelected] = useState(false);
  const [isModalopen, setIsModalOpen] = useState(false);

  const members = watch("members") || [];

  useEffect(() => {
    getAllAssessmentFramework();
  }, [getAllAssessmentFramework]);

  const handleSelectedAssessment = (id) => {
    getOneAssessmentt(id);

    setValue("assessmentFramework", id);
    setSelected(true);
  };

  // After selection, set up criteria and score array
  useEffect(() => {
    if (currentAssessmentt?.criteria) {
      const initialCriteriaScores = currentAssessmentt.criteria.map(
        (criterion) => ({
          criteriaName: criterion.criteria,
          score: undefined,
        })
      );
      setValue("criteriaAndScore", initialCriteriaScores);
    }
  }, [currentAssessmentt, setValue]);

  // Handle member score changes
  const handleMemberScoreChange = (index, value) => {
    const updatedMembers = [...members];
    updatedMembers[index].score = value === "" ? 0 : Number(value);
    setValue("members", updatedMembers);
  };

  // Function to calculate total score from criteriaAndScore
  const calculateTotalScore = (criteriaAndScore) => {
    return criteriaAndScore.reduce((total, item) => {
      return total + (item.score || 0);
    }, 0);
  };

  const navigate = useNavigate();
  const onSubmit = (data) => {
    // Calculate the total score at submission time
    const totalScore = calculateTotalScore(data.criteriaAndScore);
    const formData = {
      ...data,
      criteriaTotalScore: totalScore,
    };
    console.log("Form submitted:", formData);
    createEvaluation(formData);

    navigate("/evaluate");
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="ml-10 lg:ml-64 max-h-screen h-screen bg-base-200 flex flex-col p-5"
      >
        <MemberListModal
          isModalOpen={isModalopen}
          setIsModalOpen={setIsModalOpen}
        />

        {loading && (
          <div className="flex items-center justify-center h-screen ">
            <Loader className="size-10 animate-spin" />
          </div>
        )}

        {activeTab === "1" && (
          <div className="flex-grow flex flex-col items-center pt-20">
            <div className="mb-2 w-full max-w-2xl text-center m-2">
              <p className=" bebas-neue-regular text-xl">
                Enter the group name or project name below, then select a
                student to evaluate.
              </p>
            </div>

            <div className="rounded-lg pt-4 w-full max-w-2xl">
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Group/project name"
                  className="input input-bordered w-full"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-red-500">{errors.title.message}</p>
                )}

                <div className="flex justify-center">
                  <button
                    type="button"
                    className="btn btn-active btn-primary"
                    onClick={() => {
                      setIsModalOpen(true);
                      document.getElementById("memberList").showModal();
                    }}
                  >
                    Add member
                  </button>
                </div>

                <div className="w-full md:mt-2 h-56 overflow-auto">
                  {members.length > 0 ? (
                    <div className="bg-base-100 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Selected Members:</h3>
                      <ul className="space-y-2">
                        {members.map((member, index) => (
                          <li
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span>{member.name}</span>
                            <button
                              type="button"
                              className="btn btn-xs btn-error"
                              onClick={() => {
                                const updatedMembers = members.filter(
                                  (_, i) => i !== index
                                );
                                setValue("members", updatedMembers);
                              }}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      No members selected yet
                    </div>
                  )}
                  {errors.members && (
                    <p className="text-red-500">{errors.members.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "2" && (
          <div className="flex-grow flex flex-col items-center pt-20">
            {!selected && (
              <div className="mb-8 w-full max-w-2xl text-center mt-8">
                <p className="bebas-neue-regular text-2xl">
                  Click the button below to select a rubric you want to use.
                </p>
              </div>
            )}
            {!selected ? (
              <div className="w-full flex justify-center items-center mt-4">
                <div className="dropdown dropdown-bottom">
                  <label tabIndex={0} className="btn btn-primary m-1">
                    Select a rubric for evaluation
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    {assessments.map((assessment) => (
                      <li key={assessment._id}>
                        <button
                          type="button"
                          onClick={() =>
                            handleSelectedAssessment(assessment._id)
                          }
                          className="hover:bg-gray-100 p-2 rounded"
                        >
                          {assessment.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center">
                <div className="text-center">
                  <h1 className="text-xl bebas-neue-regular">
                    Assign points to each criterion according to the scale
                    provided.
                  </h1>
                </div>

                <div className="rounded-lg w-full max-w-4xl mx-auto">
                  <div className="max-h-[65vh] overflow-y-auto pr-2">
                    {currentAssessmentt?.criteriaArray.map((cri, index) => (
                      <div
                        key={cri._id}
                        className="mb-6 shadow-lg rounded-md p-4"
                      >
                        <h2 className="text-lg font-semibold mb-4 overflow-x-auto ">
                          {index + 1}. {cri.criterion}
                        </h2>

                        <Controller
                          control={control}
                          name={`criteriaAndScore.${index}._id`}
                          defaultValue={cri._id}
                          render={({ field }) => (
                            <input type="hidden" {...field} />
                          )}
                        />

                        <Controller
                          control={control}
                          name={`criteriaAndScore.${index}.criteriaName`}
                          defaultValue={cri.criterion}
                          render={({ field }) => (
                            <input type="hidden" {...field} />
                          )}
                        />

                        <div className="pl-4 space-y-2 border-t pt-4">
                          {currentAssessmentt?.scoringScale.map((scale) => (
                            <label
                              className="flex items-center gap-4 w-full cursor-pointer"
                              key={scale._id}
                            >
                              <Controller
                                control={control}
                                name={`criteriaAndScore.${index}.score`}
                                render={({ field }) => (
                                  <input
                                    type="radio"
                                    className="radio radio-info"
                                    checked={field.value === scale.score}
                                    onChange={() => field.onChange(scale.score)}
                                  />
                                )}
                              />
                              <span className="font-medium w-8">
                                {scale.score}
                              </span>
                              <span className="flex-grow">
                                {scale.description}
                              </span>
                            </label>
                          ))}
                        </div>

                        {errors?.criteriaAndScore?.[index]?.score && (
                          <p className="text-red-500 mt-1">
                            Please select a score for this criterion
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "3" && (
          <div className="flex-grow flex flex-col items-center pt-20">
            <div className="mb-2 w-full max-w-2xl text-center">
              {members.length === 1 ? (
                <></>
              ) : (
                <>
                  <h2 className="text-xl font-semibold mb-2">
                    Member Individual Score
                  </h2>
                  <p className="text-gray-600">(Optional)</p>
                </>
              )}
            </div>

            <div className="rounded-lg w-full max-w-2xl bg-base-100 max-h-[50vh] overflow-auto p-4 shadow-lg">
              {members.length > 0 ? (
                members.length === 1 ? (
                  <div className="text-center py-10 text-gray-500">
                    <p className="mt-2 font-bold">
                      Click Submit button to save!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {members.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-2 border-b"
                      >
                        <div className="flex-grow">
                          <span className="font-medium">{member.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">
                            Score:
                          </label>
                          <input
                            type="number"
                            className="input input-bordered w-24"
                            value={member.score || ""}
                            onChange={(e) =>
                              handleMemberScoreChange(index, e.target.value)
                            }
                            min="0"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No members have been added yet.</p>
                  <p className="mt-2">Go to step 1 to add members.</p>
                </div>
              )}
            </div>

            <div className="mt-2 w-full max-w-2xl flex justify-end">
              <button type="submit" className="btn btn-primary">
                Submit Evaluation
              </button>
            </div>
          </div>
        )}

        <div className="flex-none w-full flex justify-center mt-4">
          <div className="join">
            <button
              type="button"
              className={`join-item btn ${activeTab === "1" && "btn-active"}`}
              onClick={() => setActiveTab("1")}
            >
              1
            </button>
            <button
              type="button"
              className={`join-item btn ${activeTab === "2" && "btn-active"}`}
              onClick={() => setActiveTab("2")}
            >
              2
            </button>
            <button
              type="button"
              className={`join-item btn ${activeTab === "3" && "btn-active"}`}
              onClick={() => setActiveTab("3")}
            >
              3
            </button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default CreateEvaluation;

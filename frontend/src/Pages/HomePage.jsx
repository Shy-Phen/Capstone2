import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { statsStore } from "../store/statsStore";
import { useEffect } from "react";
import ViewRubric from "../Components/ViewRubric";
import { assessmentFrameworkStore } from "../store/assessmentFrameworkStore";
import StatsCard from "../Components/StatsCard";

const HomePage = () => {
  const { fetchStats, getEval, getRub, fetchEval, fetchRub, stats, loading } =
    statsStore();

  const { getOneAssessment } = assessmentFrameworkStore();

  useEffect(() => {
    fetchStats();
    getEval();
    getRub();
  }, [fetchStats, getEval, getRub]);

  const { authUser } = useAuthStore();

  const navigate = useNavigate();

  const handleSeeAll = () => {
    navigate("/assessment-framework");
  };

  const handleView = async (id) => {
    navigate(`/view/${id}`);
  };

  const handleseeAllEval = () => {
    navigate("/evaluate");
  };

  const handleViewRub = (id) => {
    getOneAssessment(id);
    <ViewRubric />;
    document.getElementById("viewModal").showModal();
  };

  console.log("meow " + JSON.stringify(stats));

  console.log(fetchEval);
  return (
    <div className="ml-10 lg:ml-64 mt-10 h-screen overflow-auto bg-base-200">
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <Loader className="size-10 animate-spin" />
        </div>
      )}
      <ViewRubric />
      <div className="flex pl-12 pb-2 items-center">
        <h1 className="mt-10 text-xl lg:text-3xl">
          Hello, <span className="text-blue-400">{authUser?.username}</span>
        </h1>
      </div>
      <div className="w-full h-full">
        <div className="grid gap-8 mx-3 lg:mx-11 rounded">
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard stats={stats} />
          </div>

          <div className="w-full rounded">
            <div className="flex justify-between px-2 items-center w-full h-8 mb-4">
              <h1 className="font-semibold">Recent Rubrics</h1>
              <button
                className="btn btn-active btn-primary btn-xs sm:btn-sm md:btn-md"
                onClick={handleSeeAll}
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto rounded-box border pt-2 border-base-content/5 bg-base-100">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fetchRub?.rub?.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No Rubrics Created Yet
                      </td>
                    </tr>
                  ) : (
                    fetchRub?.rub?.map((item) => (
                      <tr className="p-2" key={item._id}>
                        <td>{item.title}</td>
                        <td>{new Date(item.createdAt).toDateString()}</td>
                        <td>
                          <button
                            className="btn btn-active btn-primary btn-xs sm:btn-sm md:btn-md"
                            onClick={() => handleViewRub(item._id)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between px-2 items-center w-full h-8 my-4">
              <h1 className="font-semibold">Recent Evaluations</h1>
              <button
                className="btn btn-active btn-primary btn-xs sm:btn-sm md:btn-md"
                onClick={handleseeAllEval}
              >
                View All
              </button>
            </div>
            <div className="overflow-x-auto rounded-box border pt-2 border-base-content/5 bg-base-100">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fetchEval?.evaluate?.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No Evaluations Found
                      </td>
                    </tr>
                  ) : (
                    fetchEval?.evaluate?.map((item) => (
                      <tr className="p-2" key={item._id}>
                        <td>{item.title}</td>
                        <td>{new Date(item.createdAt).toDateString()}</td>
                        <td>
                          <button
                            className="btn btn-active btn-primary btn-xs sm:btn-sm md:btn-md"
                            onClick={() => {
                              handleView(item._id);
                            }}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

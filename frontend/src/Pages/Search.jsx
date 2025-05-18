import { useState } from "react";
import { axiosInstance } from "../axios/axios";
import toast from "react-hot-toast";
import SearchEvalCard from "../Components/SearchEvalCard";
import SearchRubricCard from "../Components/SearchRubricCard";

const Search = () => {
  const [activetab, setActiveTab] = useState("rubric");
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleTab = (tab) => {
    setActiveTab(tab);
    setResult([]);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/search/${activetab}/${searchTerm}`);
      if (activetab === "rubric") return setResult(res.data.rubric);
      if (activetab === "evaluated") return setResult(res.data.evaluate);
    } catch (err) {
      if (err.response.status === 404) {
        setResult(null);
        return toast.error(`No ${activetab} found please enter a valid word`);
      }

      toast.error("An error occured, please try again later");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-10 lg:ml-64 mt-14 h-screen overflow-hidden bg-base-200">
      <div className="flex h-full w-auto justify-center items-center">
        <div className="h-[500px] w-[800px] flex flex-col">
          <div className="grid place-items-center  h-20 w-full">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                placeholder={"Search by title"}
                value={searchTerm}
                className="input input-bordered input-primary w-full max-w-xs"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                disabled={searchTerm.trim() === ""}
                className="btn btn-primary"
              >
                Search
              </button>
            </form>
          </div>
          <div className="grid place-items-center h-16">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleTab("rubric")}
                className={`rounded ${
                  activetab === "rubric"
                    ? "btn btn-active btn-primary"
                    : "btn btn-active btn-neutral"
                }`}
              >
                Rubric
              </button>
              <button
                onClick={() => handleTab("evaluated")}
                className={`rounded text-sm ${
                  activetab === "evaluated"
                    ? "btn btn-active btn-primary"
                    : "btn btn-active btn-neutral"
                }`}
              >
                Evaluated
              </button>
            </div>
          </div>
          {result === null && (
            <div>
              <h1> No result found</h1>{" "}
            </div>
          )}
          <div className="flex-1 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 p-4 carousel carousel-vertical">
            {loading ? (
              <p>Loading...</p>
            ) : activetab === "evaluated" ? (
              result?.map((item) => (
                <SearchEvalCard key={item._id} EvalData={item} />
              ))
            ) : (
              result?.map((item) => (
                <SearchRubricCard key={item._id} rubricData={item} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;

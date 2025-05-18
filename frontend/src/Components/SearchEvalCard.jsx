import { EyeIcon } from "lucide-react";

import { useNavigate } from "react-router-dom";

const SearchEvalCard = ({ EvalData }) => {
  const navigate = useNavigate();

  const handleView = async (id) => {
    navigate(`/view/${id}`);
  };

  return (
    <div className="rounded-lg p-6 shadow-lg hover:shadow-xl h-40 w-full flex flex-col justify-between">
      <h2 className="text-sm font-semibold mb-2">
        Group/Project name:{" "}
        <span className="text-sm text-blue-300">{EvalData.title}</span>
      </h2>

      <p className="text-xs mb-4 truncate">
        Member: <span className="font-medium">{EvalData.member}</span>
      </p>

      <div className="flex items-center gap-8">
        <p className="text-sm text-slate-400">
          {new Date(EvalData.createdAt).toLocaleDateString()}
        </p>

        <button
          className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => handleView(EvalData._id)}
        >
          <EyeIcon className="size-4" />
        </button>
      </div>
    </div>
  );
};

export default SearchEvalCard;

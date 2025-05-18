import { Trash2, View } from "lucide-react";
import { evaluateStore } from "../store/evaluateStore";
import { useNavigate } from "react-router-dom";

const EvaluatedCard = ({ evalu }) => {
  const { deleteEvaluation } = evaluateStore();
  const navigate = useNavigate();

  const handleView = async (id) => {
    navigate(`/view/${id}`);
  };

  return (
    <div className="rounded-lg p-6  shadow-lg hover:shadow-xl transition-shadow duration-300 border hover:scale-105 transform">
      <h2 className="text-sm font-semibold mb-2">
        {evalu.title[0].toUpperCase() + evalu.title.slice(1)}
      </h2>

      <div className="grid grid-cols-2 h-8 mb-4">
        {evalu?.members?.slice(0, 4).map((mem, i) => (
          <p key={i} className="text-xs">
            {mem?.name}
          </p>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm">
          {new Date(evalu.createdAt).toLocaleDateString()}
        </p>

        <div className="flex gap-3">
          <button
            aria-label="Delete evaluation"
            className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={() => {
              if (evalu._id) {
                deleteEvaluation(evalu._id);
              } else {
                console.error("Evaluation ID is missing");
              }
            }}
          >
            <Trash2 className="size-4 text-white" />
          </button>

          <button
            aria-label="View evaluation"
            className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => handleView(evalu._id)}
          >
            <View className="size-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluatedCard;

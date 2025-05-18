import { GraduationCapIcon, FileChartColumn, FileCheck2 } from "lucide-react";

const StatsCard = ({ stats }) => {
  const items = [
    {
      name: "Total Rubrics",
      total: stats.totalRubrics,
      icon: <FileChartColumn className="size-8" />,
    },
    {
      name: "Total Evaluations ",
      total: stats.totalEvaluations,
      icon: <FileCheck2 className="size-8" />,
    },
    {
      name: "Total Students",
      total: stats.totalStudent,
      icon: <GraduationCapIcon className="size-8" />,
    },
  ];
  return (
    <>
      {items.map((item) => (
        <div
          key={item.name}
          className="w-full h-20 rounded-md border border-none shadow-sm flex overflow-hidden bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500"
        >
          <div className="flex-1 flex flex-col py-2 pl-5">
            <h2 className="text-sm lg:text-xl text-white">{item.name}</h2>
            <h1 className="font-bold text-2xl text-white">{item.total}</h1>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="rounded-full p-2 border white">{item.icon}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default StatsCard;

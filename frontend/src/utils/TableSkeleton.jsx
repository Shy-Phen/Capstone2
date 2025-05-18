const TableSkeleton = () => {
  return (
    <div className="w-full p-2 rounded-lg shadow-sm animate-pulse mt-5">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>

      <div className="overflow-x-auto border-x border-t border-gray-200 rounded-md">
        <table className="table w-full">
          <thead>
            <tr className="border-collapse border-gray-200">
              <th className="bg-gray-100">
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </th>
              {/* Placeholder for 4 scoring columns */}
              {[...Array(4)].map((_, i) => (
                <th key={i} className="bg-gray-100">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Placeholder for 3 criteria rows */}
            {[...Array(3)].map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-200">
                <td>
                  <div className="h-5 bg-gray-200 rounded w-28"></div>
                </td>
                {[...Array(4)].map((_, colIndex) => (
                  <td key={colIndex}>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className=" w-full flex justify-center items-center">
        <span className="loading loading-dots loading-lg items-center"></span>
      </div>
    </div>
  );
};

export default TableSkeleton;

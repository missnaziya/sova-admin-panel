import React from 'react';

const TextureTableSkeleton: React.FC = () => {
  const rows = Array.from({ length: 10 }); // Simulating 10 rows

  return (
    <div className="animate-pulse mt-4">
      <table className="w-full border text-left mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, index) => (
            <tr key={index}>
              {/* Row number */}
              <td className="p-2 border">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
              </td>
              {/* Category */}
              <td className="p-2 border">
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
              </td>
              {/* Type */}
              <td className="p-2 border">
                <div className="h-4 w-28 bg-gray-300 rounded"></div>
              </td>
              {/* Image */}
              <td className="p-2 border">
                <div className="w-[60px] h-[60px] bg-gray-300 rounded"></div>
              </td>
              {/* Actions */}
              <td className="p-2 border">
                <div className="flex gap-2"> 
                  <div className="w-12 h-6 bg-red-300 rounded"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TextureTableSkeleton;

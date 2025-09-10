import React from 'react';

const SkeletonTableLoader: React.FC = () => {
  const rows = Array.from({ length: 6 }); // simulate 6 rows

  return (
    <div className="animate-pulse mt-4">
      <table className="w-full border text-left mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Subcategory</th>
            <th className="p-2 border">Product Name</th>
            <th className="p-2 border">Shape</th>
            <th className="p-2 border">Model URL</th>
            <th className="p-2 border">Image</th>
            <th className="p-2 border">Dimensions (H×W×D)</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((_, i) => (
            <tr key={i}>
              {/* Category */}
              <td className="p-2 border">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </td>
              {/* Subcategory */}
              <td className="p-2 border">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </td>
              {/* Product Name */}
              <td className="p-2 border">
                <div className="h-4 bg-gray-300 rounded w-28"></div>
              </td>
              {/* Shape */}
              <td className="p-2 border">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </td>
              {/* Model URL */}
              <td className="p-2 border">
                <div className="h-4 bg-blue-300 rounded w-24"></div>
              </td>
              {/* Image */}
              <td className="p-2 border">
                <div className="w-[60px] h-[60px] bg-gray-300 rounded"></div>
              </td>
              {/* Dimensions */}
              <td className="p-2 border">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </td>
              {/* Actions */}
              <td className="p-2 border">
                <div className="flex gap-2">
                  <div className="w-12 h-6 bg-yellow-300 rounded"></div>
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

export default SkeletonTableLoader;

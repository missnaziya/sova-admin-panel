import React from 'react';
const ColorSkeletonTable = () => {
  return (
    <tbody>
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="border-b">
          {/* # */}
          <td className="px-4 py-3">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          </td>

          {/* Name */}
          <td className="px-4 py-3">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          </td>

          {/* Color block */}
          <td className="px-4 py-3">
            <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
          </td>

          {/* Created At */}
          <td className="px-4 py-3">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
          </td>

          {/* Actions */}
          <td className="px-4 py-3">
            <div className="flex gap-2">
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};


export default ColorSkeletonTable;

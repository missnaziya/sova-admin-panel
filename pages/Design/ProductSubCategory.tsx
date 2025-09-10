import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface SubCategory {
  _id: string;
  id: string;
  name: string;
}

interface Category {
  id: string;
  _id: string;
  name: string;
  subcategories?: SubCategory[];
}

const ProductSubCategory: React.FC = () => {
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch categories (with their subcategories)
  useEffect(() => {
    axios
      .get("https://sova-admin.cyberxinfosolution.com/api/model-category/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("res.data.",res.data)
        setCategories(res.data.categories);
      })
      .catch(() => toast.error("Failed to load categories"));
  }, [token]);

  // Update subcategories when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setSubCategories([]);
      return;
    }
    const categoryObj = categories.find((cat) => cat?.id === selectedCategory);
    setSubCategories(categoryObj?.subcategories || []);
  }, [selectedCategory, categories]);

  return (
    <div>
      {/* Dropdown for selecting category */}
      <div className="mb-4">
        <label className="block font-semibold mb-2">Select Category</label>
        <select
          className="border p-2 rounded w-full"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">-- Select a Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory list */}
      {selectedCategory ? (
        subCategories.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2">Name</th>
              </tr>
            </thead>
            <tbody>
              {subCategories.map((sub) => (
                <tr key={sub._id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {sub.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No subcategories found.</p>
        )
      ) : (
        <p className="text-gray-500">Please select a category.</p>
      )}
    </div>
  );
};

export default ProductSubCategory;

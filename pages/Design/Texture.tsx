import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PaginationControls from "../../components/Pagination";
import TextureTableSkeleton from "../../components/skeleton/TextureSkeletonTable";

interface Texture {
  id: string;
  category: string;
  type: string;
  image: string;
}

interface Category {
  _id: string;
  name: string;
}

const Texture: React.FC = () => {
  const token = localStorage.getItem("token");
  const [textures, setTextures] = useState<Texture[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [form, setForm] = useState<Texture>({
    id: "",
    category: "",
    type: "",
    image: "",
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [limit, setLimit] = useState(10); // Items per page
  const [page, setPage] = useState(1); // Current page
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading

        // Fetch Textures
        const texturesRes = await fetch(
          "https://sova-admin.cyberxinfosolution.com/api/texture/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const texturesData = await texturesRes.json();

        if (
          texturesData.success &&
          Array.isArray(texturesData.TexturesCategories)
        ) {
          const flatTextures: Texture[] =
            texturesData.TexturesCategories.flatMap((category: any) =>
              category.textures.map((texture: any) => ({
                id: texture._id,
                category: category.categoryName,
                type: texture.textureType,
                image: texture.textureUrl,
              }))
            );
          setTextures(flatTextures);
        } else {
          toast.error("Failed to fetch textures");
        }

        // Fetch Categories
        const categoryRes = await fetch(
          "https://sova-admin.cyberxinfosolution.com/admin/api/texture-category/"
        );
        const categoryData = await categoryRes.json();
        if (categoryData.success) {
          setCategoriesList(categoryData.categories);
        } else {
          toast.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("API error");
      } finally {
        setLoading(false); // Done loading
      }
    };

    fetchData();
  }, []);

  const handleEdit = (index: number) => {
    setForm(textures[index]);
    setEditIndex(index);
    setIsAdding(false);
  };

  const handleDelete = async (index: number) => {
    const textureToDelete = textures[index];

    if (
      !window.confirm(
        `Are you sure you want to delete texture: ${textureToDelete.type}?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `https://sova-admin.cyberxinfosolution.com/admin/api/texture/${textureToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && (data.success || data.status === true)) {
        const updated = [...textures];
        updated.splice(index, 1);
        setTextures(updated);
        toast.success("Texture deleted successfully");
      } else {
        toast.error(data.message || "Failed to delete texture");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.category || !form.type) {
      toast.error("Category and Type are required");
      return;
    }

    try {
      const formData = new FormData();
      const selectedFile = (
        document.querySelector('input[type="file"]') as HTMLInputElement
      )?.files?.[0];

      if (!selectedFile && editIndex === null) {
        toast.error("Please select a file");
        return;
      }

      const selectedCategory = categoriesList.find(
        (cat) => cat.name === form.category
      );

      formData.append("textureCategory", selectedCategory?._id || "");
      formData.append("textureType", form.type);
      if (selectedFile) formData.append("image", selectedFile);

      const url =
        editIndex !== null
          ? `https://sova-admin.cyberxinfosolution.com/admin/api/texture/${form.id}`
          : "https://sova-admin.cyberxinfosolution.com/admin/api/texture/add";

      const method = editIndex !== null ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success || data.status === true) {
        toast.success(
          editIndex !== null ? "Texture updated" : "Texture uploaded"
        );
        setIsAdding(false);
        setEditIndex(null);
        setForm({ id: "", category: "", type: "", image: "" });
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Request failed");
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
    setIsAdding(false);
    setForm({ id: "", category: "", type: "", image: "" });
  };

  return (
    <>
      <div className="">
        {editIndex !== null || isAdding ? (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 bg-white rounded shadow mt-10">
            <h3 className="text-xl font-semibold mb-4">
              {editIndex !== null ? "Edit Texture" : "Add Texture"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Category</label>
                <select
                  className="border p-2 w-full rounded"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="">Select category</option>
                  {categoriesList.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-medium">Type</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Image Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setForm({ ...form, image: reader.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="block border p-2 w-full rounded"
                />
                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview"
                    className="mt-2 h-20 border rounded shadow"
                  />
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  {editIndex !== null ? "Update Texture" : "Add Texture"}
                </button>
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Texture List</h3>
              <button
                onClick={() => {
                  setForm({ id: "", category: "", type: "", image: "" });
                  setEditIndex(null);
                  setIsAdding(true);
                }}
                className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Add Texture
              </button>
            </div>
            {!loading ? (
              <table className="w-full border text-left">
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
                  {textures
                    .slice((page - 1) * limit, page * limit)
                    .map((texture, index) => {
                      const actualIndex = (page - 1) * limit + index;
                      return (
                        <tr key={texture.id}>
                          <td className="p-2 border">{actualIndex + 1}</td>
                          <td className="p-2 border">{texture.category}</td>
                          <td className="p-2 border">{texture.type}</td>
                          <td className="p-2 border">
                            <img
                              src={texture.image}
                              alt={texture.type}
                              className="h-12"
                            />
                          </td>
                          <td className="p-2 border">
                            <button
                              onClick={() => handleEdit(actualIndex)}
                              className="bg-gray-500 text-white px-2 py-1 mr-2 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(actualIndex)}
                              className="bg-red-600 text-white px-2 py-1 rounded"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            ) : (
              <TextureTableSkeleton />
            )}
            <PaginationControls
              limit={limit}
              setLimit={setLimit}
              page={page}
              setPage={setPage}
              pages={Math.ceil(textures.length / limit)}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Texture;

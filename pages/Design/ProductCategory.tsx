import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ProductCategory {
  _id?: string;
  name: string;
  shape: string;
  model_url: string;
  image2d_url: string;
  height: number;
  width: number;
  depth: number;
}

interface SubCategory {
  _id: string;
  name: string;
  data: ProductCategory[];
}

interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

const ProductCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingProductCategory, setEditingProductCategory] = useState<ProductCategory | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const token = localStorage.getItem("token"); // Replace with real token

  const emptyProductCategory: ProductCategory = {
    name: '',
    shape: '',
    model_url: '',
    image2d_url: '',
    height: 0,
    width: 0,
    depth: 0
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://sova-admin.cyberxinfosolution.com/api/model-category/all',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ProductCategory: ProductCategory) => {
    setEditingProductCategory(ProductCategory);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this ProductCategory?')) return;
    try {
      const response = await axios.delete(
        `https://sova-admin.cyberxinfosolution.com/admin/api/models/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success('ProductCategory deleted successfully!');
        fetchCategories();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductCategory) return;

    try {
      const url = editingProductCategory._id
        ? `https://sova-admin.cyberxinfosolution.com/admin/api/models/update/${editingProductCategory._id}`
        : 'https://sova-admin.cyberxinfosolution.com/admin/api/models/create';

      const method = editingProductCategory._id ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: editingProductCategory,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(`ProductCategory ${editingProductCategory._id ? 'updated' : 'added'} successfully!`);
        fetchCategories();
        setEditingProductCategory(null);
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  const startAddProductCategory = () => {
    setEditingProductCategory(emptyProductCategory);
    setIsAdding(true);
  };

  const cancelForm = () => {
    setEditingProductCategory(null);
    setIsAdding(false);
  };

  if (loading) return <p>Loading Product categories...</p>;

  return (
    <div className=" mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          {editingProductCategory ? (editingProductCategory._id ? 'Edit ProductCategory' : 'Add ProductCategory') : 'Product Categories List'}
        </h3>
        {!editingProductCategory && !isAdding && (
          <button
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={startAddProductCategory}
          >
            Add ProductCategory
          </button>
        )}
      </div>

      {/* Table */}
      {!editingProductCategory && !isAdding && (
        <table className="w-full border text-left mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Subcategory</th>
              <th className="p-2 border">ProductCategory Name</th>
              <th className="p-2 border">Shape</th>
              <th className="p-2 border">Model URL</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Dimensions (H×W×D)</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) =>
              category.subCategories.map((sub) =>
                sub.data.map((ProductCategory) => (
                  <tr key={ProductCategory._id}>
                    <td className="p-2 border">{category.name}</td>
                    <td className="p-2 border">{sub.name}</td>
                    <td className="p-2 border">{ProductCategory.name}</td>
                    <td className="p-2 border">{ProductCategory.shape}</td>
                    <td className="p-2 border">
                      <a href={ProductCategory.model_url} target="_blank" rel="noopener noreferrer">
                        View Model
                      </a>
                    </td>
                    <td className="p-2 border">
                      <img
                        src={ProductCategory.image2d_url}
                        alt={ProductCategory.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    </td>
                    <td className="p-2 border">
                      {ProductCategory.height}×{ProductCategory.width}×{ProductCategory.depth}
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleEdit(ProductCategory)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ProductCategory._id!)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      )}

      {/* Add/Edit Form */}
      {(editingProductCategory || isAdding) && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-gray-100 p-6 rounded shadow-md grid grid-cols-2 gap-4"
        >
          <input
            type="text"
            value={editingProductCategory?.name || ''}
            onChange={(e) => setEditingProductCategory({ ...editingProductCategory!, name: e.target.value })}
            placeholder="ProductCategory Name"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            value={editingProductCategory?.shape || ''}
            onChange={(e) => setEditingProductCategory({ ...editingProductCategory!, shape: e.target.value })}
            placeholder="Shape"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            value={editingProductCategory?.model_url || ''}
            onChange={(e) => setEditingProductCategory({ ...editingProductCategory!, model_url: e.target.value })}
            placeholder="Model URL"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            value={editingProductCategory?.image2d_url || ''}
            onChange={(e) => setEditingProductCategory({ ...editingProductCategory!, image2d_url: e.target.value })}
            placeholder="Image URL"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            value={editingProductCategory?.height || 0}
            onChange={(e) => setEditingProductCategory({ ...editingProductCategory!, height: +e.target.value })}
            placeholder="Height"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            value={editingProductCategory?.width || 0}
            onChange={(e) => setEditingProductCategory({ ...editingProductCategory!, width: +e.target.value })}
            placeholder="Width"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            value={editingProductCategory?.depth || 0}
            onChange={(e) => setEditingProductCategory({ ...editingProductCategory!, depth: +e.target.value })}
            placeholder="Depth"
            className="p-2 border rounded"
            required
          />
          <div className="col-span-2 flex justify-end gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {editingProductCategory?._id ? 'Save Changes' : 'Add ProductCategory'}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProductCategory;

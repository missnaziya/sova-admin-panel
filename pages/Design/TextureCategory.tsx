import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface TextureCategory {
  id: string;
  name: string;
  description: string; // optional: your backend must support it if you want to use this
}

const TextureCategory: React.FC = () => {
  const [categories, setCategories] = useState<TextureCategory[]>([]);
  const [form, setForm] = useState<TextureCategory>({ id: '', name: '', description: '' });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  console.log("process.env.REACT_APP_API_URL",process.env.REACT_APP_API_URLb );
  
  // ✅ Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}admin/api/texture-category/`);
        const data = await res.json();
        if (data.success && Array.isArray(data.categories)) {
          const mapped = data.categories.map((cat: any) => ({
            id: cat._id,
            name: cat.name,
            description: cat.description || '', // optional fallback
          }));
          setCategories(mapped);
        } else {
          toast.error('Failed to load categories');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error fetching categories');
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = (index: number) => {
    setForm(categories[index]);
    setEditIndex(index);
    setIsAdding(false);
  };

const handleDelete = async (index: number) => {
  const categoryToDelete = categories[index];

  try {
    const response = await fetch(
      `https://sova-admin.cyberxinfosolution.com/admin/api/texture-category/${categoryToDelete.id}`,
      {
        method: 'DELETE',
      }
    );

    const data = await response.json();

    if (data.success) {
      const updated = [...categories];
      updated.splice(index, 1);
      setCategories(updated);
      toast.success('Category deleted successfully');
    } else {
      toast.error(data.message || 'Failed to delete category');
    }
  } catch (error) {
    console.error(error);
    toast.error('Error deleting category');
  }
};


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.name) {
    toast.error('Name is required');
    return;
  }

  try {
    if (editIndex !== null) {         
      const response = await fetch(   
        `https://sova-admin.cyberxinfosolution.com/admin/api/texture-category/${form.id}`,  
        {
          method: 'PUT',
          headers: {  
            'Content-Type': 'application/json',  
          },
          body: JSON.stringify({
              name: form.name, // Only "name" is expected
              description:form.description, 
          }),
        }  
      );

      const data = await response.json();  

      if (data.success) {  
        const updated = [...categories];  
        updated[editIndex] = { ...categories[editIndex], name: form.name, description:form.description,  };  
        setCategories(updated);  
        toast.success('Category updated successfully');  
      } else {
        toast.error(data.message || 'Failed to update category');  
      }
 } else if (isAdding) {    
  const response = await fetch(
    `https://sova-admin.cyberxinfosolution.com/admin/api/texture-category`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
      }),
    }
  );

  const data = await response.json();

  if (data.success && data.category) {
    const newCategory = {
      id: data.category._id,
      name: data.category.name,
      description: data.category.description || '',
    };
    setCategories([...categories, newCategory]);
    toast.success('Category added successfully');
  } else {
    toast.error(data.message || 'Failed to add category');
  }
}

    // Reset form state
    setForm({ id: '', name: '', description: '' });
    setEditIndex(null);
    setIsAdding(false);
  } catch (err) {
    console.error(err);
    toast.error('Something went wrong during update');
  }
};

  const handleCancel = () => {
    setEditIndex(null);
    setIsAdding(false);
    setForm({ id: '', name: '', description: '' });
  };

  return (
  <div className="">
  {(editIndex !== null || isAdding) ? (
    <div>
      <h3 className="text-2xl font-semibold mb-4">
        {editIndex !== null ? 'Edit Category' : 'Add Category'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:border-blue-300"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring focus:border-blue-300"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            type="submit"
            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
          >
            {editIndex !== null ? 'Update Category' : 'Add Category'}
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>  
  ) : (    
    <div>   
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">   
        <h3 className="text-2xl font-semibold">Texture Category List</h3>
        <button
          onClick={() => {
            setForm({ id: '', name: '', description: '' });
            setEditIndex(null);
            setIsAdding(true);
          }}
          className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Add Category
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat.id}>
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{cat.name}</td>
                <td className="p-2 border">{cat.description}</td>
                <td className="p-2 border whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-blue-500 text-white px-3 py-1 mr-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
</div>

  );
};

export default TextureCategory;

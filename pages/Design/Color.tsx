import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatDate } from '../../utills/common';
import PaginationControls from '../../components/Pagination';
import ColorSkeletonTable from '../../components/skeleton/ColorSkeletonTable';

interface Color {
  _id: string;
  name: string;
  hexCode: string;
  category?: string;
  createdAt?: string;
}

const Color: React.FC = () => {
  const [colors, setColors] = useState<Color[]>([]);
  const [form, setForm] = useState<Color>({ _id: '', name: '', hexCode: '', category: '' });
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false); // Loader state

  const getData = async () => {
    try {
      setLoading(true); // start loader
      const response = await axios.get(
        'https://sova-admin.cyberxinfosolution.com/admin/api/model-color/all'
      );
      const data = response.data;
      if (data.success && data.colors) {
        setColors(data.colors);
      } else {
        toast.error('Failed to fetch colors');
      }
    } catch (error) {
      toast.error('Error fetching colors');
    } finally {
      setLoading(false); // stop loader
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleEdit = (index: number) => {
    const c = colors[index];
    setForm({
      _id: c._id,
      name: c.name,
      hexCode: c.hexCode,
      category: c.category || '',
    });
    setEditIndex(index);
    setIsAdding(false);
  };

  const handleDelete = async (index: number) => {
    const colorToDelete = colors[index];

    try {
      setLoading(true); // show loader while deleting
      const response = await axios.delete(
        `https://sova-admin.cyberxinfosolution.com/admin/api/model-color/remove/${colorToDelete._id}`
      );

      const result = response.data;

      if (result.success) {
        const updated = [...colors];
        updated.splice(index, 1);
        setColors(updated);
        toast.success('Color deleted successfully.');
      } else {
        toast.error(result.message || 'Failed to delete color');
      }
    } catch (error) {
      toast.error('Error deleting color');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.hexCode) {
      toast.error('Name and Hex Code are required');
      return;
    }

    try {
      setLoading(true);
      const payload = { name: form.name, hexCode: form.hexCode };
      const url = editIndex !== null
        ? `https://sova-admin.cyberxinfosolution.com/admin/api/model-color/update/${form._id}`
        : 'https://sova-admin.cyberxinfosolution.com/admin/api/model-color/add';

      const method = editIndex !== null ? 'put' : 'post';
      const response = await axios[method](url, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      const result = response.data;

      if (result.success) {
        toast.success(editIndex !== null ? 'Color updated' : 'Color added');
        getData();
        setForm({ _id: '', name: '', hexCode: '', category: '' });
        setEditIndex(null);
        setIsAdding(false);
      } else {
        toast.error(result.message || 'Operation failed');
      }
    } catch (error) {
      toast.error('Error submitting data');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
    setIsAdding(false);
    setForm({ _id: '', name: '', hexCode: '', category: '' });
  };

  const totalPages = Math.ceil(colors.length / limit);
  const paginatedColors = colors.slice((page - 1) * limit, page * limit);

  return (
    <>
      <div className="">
        {/* {loading && (
          // <div className="flex justify-center py-10">
          //   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          // </div>
        )} */}

        {!loading && (editIndex !== null || isAdding) ? (
          <div className='max-w-5xl mx-auto px-4 sm:px-6 py-6 bg-white rounded shadow mt-10'>
            <h3 className="text-xl font-semibold mb-4">
              {editIndex !== null ? 'Edit Color' : 'Add Color'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Name</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-medium">Hex Code</label>
                <input
                  type="color"
                  className="border p-2 w-full rounded h-10"
                  value={form.hexCode}
                  onChange={(e) => setForm({ ...form, hexCode: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  {editIndex !== null ? 'Update Color' : 'Add Color'}
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
        ) :  (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Color List</h3>
              <button
                onClick={() => {
                  setForm({ _id: '', name: '', hexCode: '', category: '' });
                  setEditIndex(null);
                  setIsAdding(true);
                }}
                className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Add Color
              </button>
            </div>
        {  !loading ?  <table className="w-full border text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">#</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">Color</th>
                  <th className="p-2 border">Created At</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedColors.map((color, index) => {
                  const actualIndex = (page - 1) * limit + index;
                  return (
                    <tr key={color._id}>
                      <td className="p-2 border">{actualIndex + 1}</td>
                      <td className="p-2 border">{color.name}</td>
                      <td className="p-2 border">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-6 rounded border" style={{ backgroundColor: color.hexCode }}></div>
                        </div>
                      </td>
                      <td className="p-2 border">{formatDate(color.createdAt) || '-'}</td>
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
            </table> :  
          <ColorSkeletonTable/>
            
            }
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && (
        <PaginationControls
          limit={limit}
          setLimit={setLimit}
          page={page}
          setPage={setPage}
          pages={totalPages}
        />
      )}
    </>
  );
};

export default Color;

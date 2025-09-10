import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';

const ShopManager: React.FC = () => {   
  const [shops, setShops] = useState<any[]>([]);   
  const [name, setName] = useState('');
  const [categories, setCategories] = useState('');   
  const [subcategories, setSubcategories] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [shopToDeleteIndex, setShopToDeleteIndex] = useState<number | null>(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);


  const fetchShops = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/shop/all`
        // 'https://sova-admin.cyberxinfosolution.com/api/shop/all'
      );

      const data = response.data;
      if (data.success && data.categories) {
        setShops(data.categories);
      } else {
        toast.error('Failed to fetch shops');
      }
    } catch (error) {
      toast.error('Error fetching shops');
    }
  };
  
  useEffect(() => {
    fetchShops();
  }, []);

const handleAddOrUpdate = async () => {
  if (!name.trim()) {
    toast.error('Shop name cannot be empty');
    return;
  }

  const categoryArray = categories
    .split(',')
    .map((cat) => cat.trim())
    .filter((cat) => cat);

  const subcategoryArray = subcategories
    .split(',')
    .map((sub) => sub.trim())
    .filter((sub) => sub);

  if (editIndex !== null) {
    const shopToEdit = shops[editIndex];

    try {
      const response = await axios.put(
        `https://sova-admin.cyberxinfosolution.com/admin/api/shop/category/${shopToEdit._id}`,
        {
          name,
          product_categories: categoryArray,
          product_subcategories: subcategoryArray,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Shop updated successfully!');
        setEditIndex(null);
        setName('');
        setCategories('');
        setSubcategories('');
        fetchShops();
        setShowForm(false);
      } else {
        toast.error('Failed to update shop');
      }
    } catch (error) {
      console.error('Update Shop Error:', error);
      toast.error('Error updating shop');
    }
  } else {
    // ADD NEW SHOP
    try {
      const response = await axios.post(
        'https://sova-admin.cyberxinfosolution.com/admin/api/shop/category',
        {
          name: name,
          product_categories: categoryArray,
          product_subcategories: subcategoryArray,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response?.status === 201) {
        toast.success('Shop added successfully!');
        setName('');
        setCategories('');
        setSubcategories('');
        fetchShops();
        setShowForm(false);
      } else {
        toast.error(response.data.message || 'Failed to add shop');
      }
    } catch (error) {
      console.error('Add Shop Error:', error);
      toast.error('Error adding shop');
    }
  }
};



  const handleEdit = (index: number) => {
    const shop = shops[index];
    setEditIndex(index);
    setName(shop?.name || '');
    setCategories(shop?.product_categories?.join(', ') || '');
    setSubcategories(shop?.product_subcategories?.join(', ') || '');
    setShowForm(true);
  };

const handleDelete = (index: number) => {
  setShopToDeleteIndex(index);
  setShowDeleteModal(true);
};
const confirmDelete = async () => {
  if (shopToDeleteIndex === null) return;

  const shopToDelete = shops[shopToDeleteIndex];

  try {
    const response = await axios.delete(
      `https://sova-admin.cyberxinfosolution.com/admin/api/shop/category/${shopToDelete._id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_ADMIN_TOKEN}`, // If needed
        },
      }
    );

    if (response.status === 200) {
      toast.success('Shop deleted successfully');
      fetchShops();
    } else {
      toast.error('Failed to delete shop');
    }
  } catch (error: any) {
    console.error('Delete Shop Error:', error);
    toast.error(error?.response?.data?.message || 'Error deleting shop');
  } finally {
    setShowDeleteModal(false);
    setShopToDeleteIndex(null);
  }
};



  const handleCancel = () => {
    setName('');
    setCategories('');
    setSubcategories('');
    setEditIndex(null);
    setShowForm(false);
  };

  return (
   <>

   
      {showDeleteModal && shopToDeleteIndex !== null && (
  <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Confirm Deletion</h5>
          <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to delete <strong>{shops[shopToDeleteIndex]?.name}</strong>?
          </p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={confirmDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
     )}  


    <div className=" mt-4">
      <h3 className="mb-4">Shop Manager</h3>

      {showForm ? (
  <div className="card p-4 mb-4 shadow-sm">
  <h5 className="mb-3">{editIndex !== null ? 'Edit Shop' : 'Add New Shop'}</h5>

  <div className="mb-3">
    <label className="form-label">Shop Name</label>
    <input
      type="text"
      className="form-control"
      placeholder="Enter shop name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  </div>

  <div className="mb-3">
    <label className="form-label">Product Categories</label>
    <input
      type="text"
      className="form-control"
      placeholder="e.g. Electronics, Furniture"
      value={categories}
      onChange={(e) => setCategories(e.target.value)}
    />
    <div className="form-text">Separate categories with commas.</div>
  </div>

  <div className="mb-3">
    <label className="form-label">Product Subcategories</label>
    <input
      type="text"
      className="form-control"
      placeholder="e.g. Mobile, Chair"
      value={subcategories}
      onChange={(e) => setSubcategories(e.target.value)}
    />
    <div className="form-text">Separate subcategories with commas.</div>
  </div>

  <div className="d-flex justify-content-end gap-2">
    <button className="btn btn-primary" onClick={handleAddOrUpdate}>
      {editIndex !== null ? 'Update' : 'Add'}
    </button>
    <button className="btn btn-secondary" onClick={handleCancel}>
      Cancel
    </button>
  </div>
</div>

      ) : (
        <>
          <button
            className="btn btn-success mb-3"
            onClick={() => {
              setEditIndex(null);
              setName('');
              setCategories('');
              setSubcategories('');
              setShowForm(true);
            }}
          >
            + Add Shop
          </button>

          {shops.length === 0 ? (
            <p>No shops found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Shop Name</th>
                    <th>Product Categories</th>
                    <th>Product Subcategories</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shops?.map((shop, index) => (
                    <tr key={shop?._id}>
                      <td>{index + 1}</td>
                      <td>{shop?.name}</td>
                      <td>
                        {shop?.product_categories?.length
                          ? shop.product_categories.join(', ')
                          : '—'}
                      </td>
                      <td>
                        {shop?.product_subcategories?.length
                          ? shop.product_subcategories.join(', ')
                          : '—'}
                      </td>
                      <td>
                        <button
                          className="bg-gray-500 text-white px-2 py-1 mr-2 rounded"
                          onClick={() => handleEdit(index)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>  
      )}



    </div>
   </>
  );
};

export default ShopManager;

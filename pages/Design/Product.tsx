import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import SkeletonTableLoader from '../../components/skeleton/ProductSkeletonTable';

interface Product {
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
  data: Product[];
}

interface Category {
  id: string;
  name: string;
  subCategories: SubCategory[];
}

const Product: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
const [selectedSubCategoryId, setSelectedSubCategoryId] = useState("");
const [image2dFile, setImage2dFile] = useState<File | null>(null);
const [modelFile, setModelFile] = useState<File | null>(null);
const [selectedTextureIds, setSelectedTextureIds] = useState<string[]>([]);
const [selectedColorIds, setSelectedColorIds] = useState<string[]>([]);


  const token = localStorage.getItem("token"); // Replace with real token

  const emptyProduct: Product = {
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await axios.delete(
        `https://sova-admin.cyberxinfosolution.com/admin/api/models/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        toast.success('Product deleted successfully!');
        fetchCategories();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingProduct) return;

  try {
    const formData = new FormData();

    const payload = {
      category: selectedCategoryId,
      subcategory: selectedSubCategoryId,
      name: editingProduct.name,
      shape: editingProduct.shape,
      height: editingProduct.height,
      depth: editingProduct.depth,
      width: editingProduct.width,
    textureavailable: [
        "682ec4d2087da14516bd4fd8"
    ],
    colorsavailable: [
        "681898e837b1b03aeb78d5b0",
        "681898e837b1b03aeb78d5b0"
    ],
      // textureavailable: selectedTextureIds, // replace with actual state
      // colorsavailable: selectedColorIds, // replace with actual state
    };

    formData.append("data", JSON.stringify(payload));
    if (image2dFile) formData.append("image2d", image2dFile);
    if (modelFile) formData.append("modelFile", modelFile);

    const response = await axios.post(
      "https://sova-admin.cyberxinfosolution.com/admin/api/models/add",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      toast.success("Product added successfully!");
      fetchCategories();
      setEditingProduct(null);
      setIsAdding(false);
    }
  } catch (error) {
    console.error("Add product failed:", error);
    toast.error("Failed to add product");
  }
};


  const startAddProduct = () => {
    setEditingProduct(emptyProduct);
    setIsAdding(true);
  };

  const cancelForm = () => {
    setEditingProduct(null);
    setIsAdding(false);
  };
  

  // if (loading) return <SkeletonTableLoader/>;

  return (  
    <div className=" mt-4">  
      <div className="flex justify-between items-center mb-4">  
        <h3 className="text-xl font-semibold">  
          {editingProduct ? (editingProduct._id ? 'Edit Product' : 'Add Product') : 'Product Categories'}
        </h3>
        {!editingProduct && !isAdding && (
          <button
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={startAddProduct}
          >
            Add Product
          </button>
        )}
      </div>

      {/* Table */}
      {!editingProduct && !isAdding && (
    <>
    {
      !loading ?    
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
            {categories.map((category) =>
              category.subCategories.map((sub) =>
                sub.data.map((product) => (
                  <tr key={product._id}>
                    <td className="p-2 border">{category.name}</td>
                    <td className="p-2 border">{sub.name}</td>
                    <td className="p-2 border">{product.name}</td>
                    <td className="p-2 border">{product.shape}</td>
                    <td className="p-2 border">
                      <a href={product.model_url} target="_blank" rel="noopener noreferrer">
                        View Model
                      </a>
                    </td>
                    <td className="p-2 border">
                      <img
                        src={product.image2d_url}
                        alt={product.name}
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    </td>
                    <td className="p-2 border">
                      {product.height}×{product.width}×{product.depth}
                    </td>
                    <td className="p-2 border">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id!)}
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
        </table> : <SkeletonTableLoader/>
    }
    </>
      )}

      {/* Add/Edit Form */}
      {(editingProduct || isAdding) && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-gray-100 p-6 rounded shadow-md grid grid-cols-2 gap-4"
        >
          <select
  required
  className="p-2 border rounded"
  value={selectedCategoryId} 
  onChange={(e) => setSelectedCategoryId(e.target.value)}
>
  <option value="">Select Category</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ))}
</select>

<select
  required
  className="p-2 border rounded"
  value={selectedSubCategoryId}
  onChange={(e) => setSelectedSubCategoryId(e.target.value)}
>
  <option value="">Select Subcategory</option>
  {categories
    .find((cat) => cat.id === selectedCategoryId)
    ?.subCategories.map((sub) => (
      <option key={sub._id} value={sub._id}>{sub.name}</option>
    ))}
</select>
2d image
<input
  type="file"
  accept="image/*"
  onChange={(e) => setImage2dFile(e.target.files?.[0] || null)}
  className="p-2 border rounded"
/>

<input
  type="file"
  accept=".glb"
  onChange={(e) => setModelFile(e.target.files?.[0] || null)}
  className="p-2 border rounded"
/>

          <input
            type="text"
            value={editingProduct?.name || ''}
            onChange={(e) => setEditingProduct({ ...editingProduct!, name: e.target.value })}
            placeholder="Product Name"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            value={editingProduct?.shape || ''}
            onChange={(e) => setEditingProduct({ ...editingProduct!, shape: e.target.value })}
            placeholder="Shape"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            value={editingProduct?.model_url || ''}
            onChange={(e) => setEditingProduct({ ...editingProduct!, model_url: e.target.value })}
            placeholder="Model URL"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            value={editingProduct?.image2d_url || ''}
            onChange={(e) => setEditingProduct({ ...editingProduct!, image2d_url: e.target.value })}
            placeholder="Image URL"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            value={editingProduct?.height || 0}
            onChange={(e) => setEditingProduct({ ...editingProduct!, height: +e.target.value })}
            placeholder="Height"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            value={editingProduct?.width || 0}
            onChange={(e) => setEditingProduct({ ...editingProduct!, width: +e.target.value })}
            placeholder="Width"
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            value={editingProduct?.depth || 0}
            onChange={(e) => setEditingProduct({ ...editingProduct!, depth: +e.target.value })}
            placeholder="Depth"
            className="p-2 border rounded"
            required
          />
          <div className="col-span-2 flex justify-end gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {editingProduct?._id ? 'Save Changes' : 'Add Product'}
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

export default Product;





// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const Product: React.FC = () => {
//   const [form, setForm] = useState({
//     _id: '', // for editing
//     category: '',
//     subcategory: '',
//     name: '',
//     shape: '',
//     height: '',
//     depth: '',
//     width: '',
//     textureavailable: '',
//     colorsavailable: '',
//     image2d: null as File | null,
//     modelFile: null as File | null,
//   });

//   const [products, setProducts] = useState([]);
//   const [isEditing, setIsEditing] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, files } = e.target as HTMLInputElement;
//     if (files) {
//       setForm(prev => ({ ...prev, [name]: files[0] }));
//     } else {
//       setForm(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const {
//       _id,
//       category,
//       subcategory,
//       name,
//       shape,
//       height,
//       depth,
//       width,
//       textureavailable,
//       colorsavailable,
//       image2d,
//       modelFile,
//     } = form;

//     if (!image2d || !modelFile) {
//       toast.error("Please upload both image and model files.");
//       return;
//     }

//     const formData = new FormData();
//     const data = {
//       category,
//       subcategory,
//       name,
//       shape,
//       height: Number(height),
//       depth: Number(depth),
//       width: Number(width),
//       textureavailable: textureavailable.split(',').map(id => id.trim()),
//       colorsavailable: colorsavailable.split(',').map(id => id.trim()),
//     };

//     formData.append('data', JSON.stringify(data));
//     formData.append('image2d', image2d);
//     formData.append('modelFile', modelFile);

//     try {
//       let url = 'https://sova-admin.cyberxinfosolution.com/admin/api/models/add';
//       let method = 'post';

//       const response = await axios({
//         method,
//         url,
//         data: formData,
//       });

//       if (response.data.success) {
//         toast.success(isEditing ? 'Product updated' : 'Product added');
//         setForm({
//           _id: '',
//           category: '',
//           subcategory: '',
//           name: '',
//           shape: '',
//           height: '',
//           depth: '',
//           width: '',
//           textureavailable: '',
//           colorsavailable: '',
//           image2d: null,
//           modelFile: null,
//         });
//         setIsEditing(false);
//         fetchProducts();
//       } else {
//         toast.error(response.data.message || 'Failed to save product');
//       }
//     } catch (err) {
//       toast.error('Error saving product');
//     }
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get('https://sova-admin.cyberxinfosolution.com/admin/api/models/all');
//       if (res.data.success) {
//         setProducts(res.data.models || []);
//       }
//     } catch {
//       toast.error('Failed to fetch products');
//     }
//   };

//   const handleEdit = (product: any) => {
//     setForm({
//       _id: product._id || '',
//       category: product.category || '',
//       subcategory: product.subcategory || '',
//       name: product.name || '',
//       shape: product.shape || '',
//       height: product.height || '',
//       depth: product.depth || '',
//       width: product.width || '',
//       textureavailable: (product.textureavailable || []).join(','),
//       colorsavailable: (product.colorsavailable || []).join(','),
//       image2d: null,
//       modelFile: null,
//     });
//     setIsEditing(true);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   return (
//     <div className="max-w-6xl mx-auto p-6 mt-10">
//       <h3 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Product' : 'Add Product'}</h3>

//       <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-10 space-y-4">
//         {['category', 'subcategory', 'name', 'shape', 'height', 'depth', 'width', 'textureavailable', 'colorsavailable'].map(field => (
//           <div key={field}>
//             <label className="block font-medium capitalize">{field}</label>
//             <input
//               type="text"
//               name={field}
//               className="border p-2 w-full rounded"
//               value={(form as any)[field]}
//               onChange={handleChange}
//             />
//           </div>
//         ))}
//         <div>
//           <label className="block font-medium">2D Image</label>
//           <input type="file" name="image2d" onChange={handleChange} accept="image/*" />
//         </div>
//         <div>
//           <label className="block font-medium">Model File (.glb)</label>
//           <input type="file" name="modelFile" onChange={handleChange} accept=".glb" />
//         </div>
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//           {isEditing ? 'Update Product' : 'Submit'}
//         </button>
//       </form>

//       {/* Table of products */}
//       <div className="bg-white p-4 rounded shadow">
//         <h4 className="text-lg font-semibold mb-4">Product List</h4>
//         <table className="w-full table-auto border">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">Name</th>
//               <th className="border p-2">Category</th>
//               <th className="border p-2">Shape</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((p: any) => (
//               <tr key={p._id}>
//                 <td className="border p-2">{p.name}</td>
//                 <td className="border p-2">{p.category}</td>
//                 <td className="border p-2">{p.shape}</td>
//                 <td className="border p-2">
//                   <button
//                     className="bg-yellow-500 text-white px-3 py-1 rounded"
//                     onClick={() => handleEdit(p)}
//                   >
//                     Edit
//                   </button>
//                 </td>
//               </tr>
//             ))}
//             {products.length === 0 && (
//               <tr>
//                 <td colSpan={4} className="text-center py-4">
//                   No products found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Product;

import React, { useState } from 'react';
import TextureCategory from './TextureCategory';
import ProductCategory from './ProductCategory';
import ProductSubCategory from './ProductSubCategory';
// import ProductCategory from './ProductCategory';
// import ProductSubCategory from './ProductSubCategory';

const CategoryTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'texture' | 'product' | 'subcategory'>('texture');

  return (
    <div className=" mx-auto mt-10">
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'texture' ? 'border-b-4 border-red-600 text-red-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('texture')}
        >
          Texture Category
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'product' ? 'border-b-4 border-red-600 text-red-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('product')}
        >
          Product Category
        </button>
        <button
          className={`px-4 py-2 font-semibold ${activeTab === 'subcategory' ? 'border-b-4 border-red-600 text-red-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('subcategory')}
        >
          Product Sub Category
        </button>
      </div>

      {activeTab === 'texture' && <TextureCategory />}
      {activeTab === 'product' && <ProductCategory />}
      {activeTab === 'subcategory' && <ProductSubCategory />}
    </div>
  );
};

export default CategoryTabs;

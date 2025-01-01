import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
  const { products, search: globalSearch, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavance');
  const [localSearch, setLocalSearch] = useState(''); 

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    // Global search from ShopContext
    if (showSearch && globalSearch) {
      productsCopy = productsCopy.filter((item) => item.name.toLowerCase().includes(globalSearch.toLowerCase()));
    }

    // Local search from the new search bar
    if (localSearch) {
      productsCopy = productsCopy.filter((item) => item.name.toLowerCase().includes(localSearch.toLowerCase()));
    }

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => category.includes(item.category));
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, globalSearch, showSearch, localSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* Filter Options */}
      <div className='min-w-60'>
        <p
          onClick={() => setShowFilter(!showFilter)}
          className='marcellus-regular my-2 text-xl flex items-center cursor-pointer gap-2'
        >
          FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt='' />
        </p>
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='marcellus-regular mb-3 text-sm font-medium'>Tiers</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='marcellus-regular flex items-center gap-2'>
              <input className='w-3' type='checkbox' value={'Bronze'} onChange={toggleCategory} />
              Bronze
            </p>
            <p className='marcellus-regular flex items-center gap-2'>
              <input className='w-3' type='checkbox' value={'Silver'} onChange={toggleCategory} />
              Silver
            </p>
            <p className='marcellus-regular flex items-center gap-2'>
              <input className='w-3' type='checkbox' value={'Gold'} onChange={toggleCategory} />
              Gold
            </p>
          </div>
        </div>

        {/* SubCategory Filter */}
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='marcellus-regular mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='marcellus-regular flex items-center gap-2'>
              <input className='w-3' type='checkbox' value={'Item'} onChange={toggleSubCategory} />
              Item
            </p>
            <p className='marcellus-regular flex items-center gap-2'>
              <input className='w-3' type='checkbox' value={'Human'} onChange={toggleSubCategory} />
              Human
            </p>
            <p className='marcellus-regular flex items-center gap-2'>
              <input className='w-3' type='checkbox' value={'Monster'} onChange={toggleSubCategory} />
              Monster
            </p>
            <p className='marcellus-regular flex items-center gap-2'>
              <input className='w-3' type='checkbox' value={'Spirit'} onChange={toggleSubCategory} />
              Spirit
            </p>
            <p className='marcellus-regular flex items-center gap-2'>
              <input className='w-3' type='checkbox' value={'Dragon'} onChange={toggleSubCategory} />
              Dragon
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`marcellus-regular border border-gray-300 p-3 ${showFilter ? '' : 'hidden'} sm:block`}>
          <input
            type='text'
            placeholder='Search products...'
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className='w-full border border-gray-300 px-2 py-1 text-sm'
          />
        </div>
      </div>


      {/* Right Side */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />
          {/* Product Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className='marcellus-regular border-2 border-gray-300 text-sm px-2'
          >
            <option value='relavance'>Relavance</option>
            <option value='low-high'>Price: Low-High</option>
            <option value='high-low'>Price: High-Low</option>
          </select>
        </div>
        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {filterProducts.map((item, index) => (
            <ProductItem key={index} name={item.name} id={item._id} price={item.price.toFixed(2)} image={item.image} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;

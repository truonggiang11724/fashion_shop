import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../store/slices/productSlice';
import { addToCart, getCart } from '../store/slices/cartSlice';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Products() {
  const dispatch = useDispatch();
  const { items, status, error, categories } = useSelector((state) => state.products);
  const { user_cart } =  useSelector((state) => state.cart);
  const [categoryId, setCategoryId] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 12;  

  const user = JSON.parse(localStorage.getItem('user'));
  
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    if (user) dispatch(getCart(user.user_id));    
  }, [dispatch]);

  const filtered = useMemo(() => {
    let result = items || [];
    if (categoryId) result = result.filter((p) => p.category_id === Number(categoryId));
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter((p) => {
        const price = Number(p.product_variants?.[0]?.price || p.price || 0);
        return price >= min && price <= max;
      });
    }
    return result;
  }, [items, categoryId, priceRange]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Listing</h1>
      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="border rounded-lg p-2">
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.category_id || cat.id} value={cat.category_id || cat.id}>{cat.category_name || cat.name}</option>
          ))}
        </select>
        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="border rounded-lg p-2">
          <option value="">All prices</option>
          <option value="0-50">$0 - $50</option>
          <option value="51-150">$51 - $150</option>
          <option value="151-9999">$151+</option>
        </select>
      </div>

      {status === 'loading' && <LoadingSpinner message="Loading products..." />}
      {status === 'failed' && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {pageData.map((product) => (
          <ProductCard key={product.product_id || product.id} product={product}/>
        ))}
      </div>

      <div className="flex justify-center items-center gap-2 mt-6 text-sm">
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
      </div>
    </main>
  );
}

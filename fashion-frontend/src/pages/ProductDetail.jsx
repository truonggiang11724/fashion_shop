import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, clearDetail } from '../store/slices/productSlice';
import { addToCart, getCart } from '../store/slices/cartSlice';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { detail: product, detailStatus, detailError } = useSelector((state) => state.products);
  const [qty, setQty] = useState(1);

  const user = JSON.parse(localStorage.getItem('user'));
  const [addForm, setAddForm] = useState({
    customer_id: user.user_id,
    variant_id: 0
  });

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => { dispatch(clearDetail()); };
  }, [dispatch, id]);

  if (detailStatus === 'loading') return <LoadingSpinner message="Loading product details..." />;
  if (detailStatus === 'failed') return <p className="text-red-600 text-center">{detailError || 'Product not found'}</p>;
  if (!product) return null;

  const price = product.product_variants?.[0]?.price || product.price || 0;
  const images = product.product_media?.map((m) => 'http://localhost:3000' + m.media_url).filter(Boolean) || [];

  const handleAddItem = () => {
    if (!user) {
      navigate('/login');
    }
    if (addForm.variant_id == 0) {
      alert("Chưa chọn màu/size");
      return;
    }
    dispatch(addToCart(addForm));
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-700 hover:text-gray-900 underline">&larr; Quay lại</button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        <div className="space-y-3">
          {images.length ? (
            <img src={images[0]} alt={product.product_name} className="w-full h-80 object-cover rounded-lg" />
          ) : (
            <div className="w-full h-80 bg-gray-200 rounded-lg" />
          )}
          <div className="flex gap-3 overflow-x-auto">
            {images.map((src, idx) => (
              <img key={idx} src={src} alt={`thumb-${idx}`} className="w-20 h-20 object-cover rounded cursor-pointer" />
            ))}
          </div>
        </div>
        <section>
          <h1 className="text-3xl font-bold text-gray-900">{product.product_name || product.name}</h1>
          <p className="text-gray-800 text-2xl font-bold mt-2">${Number(price).toFixed(2)}</p>
          <p className="text-gray-600 mt-3">{product.description || 'Không có mô tả.'}</p>

          <div className="mt-4 space-y-3">
            <div>
              <h3 className="font-medium text-gray-900">Chọn màu/size</h3>
              <div className="flex gap-2 flex-wrap mt-2">
                {(product.product_variants || []).map((variant) => (
                  <span 
                  key={variant.variant_id || variant.id} 
                  className="text-sm border border-gray-300 px-2 py-1 rounded cursor-pointer text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setAddForm({...addForm , variant_id: variant.variant_id})} >
                    {'Màu ' + variant.color + ' - Size ' + variant.size}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-700">Số lượng</span>
              <input type="number" min={1} value={qty} onChange={(e) => setQty(Number(e.target.value || 1))} className="w-20 border border-gray-300 rounded px-2 py-1 text-gray-700 focus:border-gray-500 focus:outline-none" />
            </div>

            <button
              onClick= {handleAddItem}
              className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 font-medium transition"
            >
              Thêm vào giỏ
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

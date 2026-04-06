import { Link, useNavigate } from 'react-router-dom';

export default function ProductCard({ product }) {
  const price = product.product_variants?.[0]?.price || product.price || product.variant_price || 0;
  const thumbnail = product.product_media?.[0]?.media_url ? 'http://localhost:3000'+product.product_media?.[0]?.media_url : 'https://via.placeholder.com/240x220';
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border hover:shadow-lg transition overflow-hidden">
      <Link to={`/products/${product.product_id || product.id}`} className="block">
        <img src={thumbnail} alt={product.product_name || product.name} className="w-full h-52 object-cover" />
      </Link>
      <div className="p-3">
        <Link to={`/products/${product.product_id || product.id}`}>
          <h3 className="font-semibold text-base h-14 overflow-hidden">{product.product_name || product.name}</h3>
        </Link>
        <p className="text-orange-600 text-lg font-bold mt-1">${Number(price).toFixed(2)}</p>
        <button
          type="button"
          onClick={() => navigate(`/products/${product.product_id || product.id}`)}
          className="mt-2 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
        >
          Xem sản phẩm
        </button>
      </div>
    </div>
  );
}

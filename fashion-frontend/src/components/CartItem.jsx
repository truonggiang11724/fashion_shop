export default function CartItem({item, onUpdate, onRemove}) {
  const image = 'http://localhost:3000'+item.product_variants?.image_url || item.image || 'https://via.placeholder.com/100';
    
  return (
    <div className="flex items-center gap-3 border-b py-3">
      <img src={image} alt={item.product_variants.products.product_name} className="w-20 h-20 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-semibold">{item.product_variants.products.product_name}</h3>
        <p className="text-gray-600">${(Number(item.product_variants.price) || 0).toFixed(2)} x {item.quantity}</p>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => onUpdate(item.cart_item_id, Math.max(1, item.quantity - 1))} className="px-2 py-1 bg-gray-200 rounded">-</button>
          <span>{item.quantity}</span>
          <button onClick={() => onUpdate(item.cart_item_id, item.quantity + 1)} className="px-2 py-1 bg-gray-200 rounded">+</button>
          <button onClick={() => onRemove(item.cart_item_id)} className="ml-3 text-red-600">Remove</button>
        </div>
      </div>
      <div className="font-semibold">${(item.quantity * Number(item.product_variants.price || 0)).toFixed(2)}</div>
    </div>
  );
}

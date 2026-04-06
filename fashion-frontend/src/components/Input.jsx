export default function Input({ className = '', ...rest }) {
  return (
    <input
      {...rest}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
    />
  );
}

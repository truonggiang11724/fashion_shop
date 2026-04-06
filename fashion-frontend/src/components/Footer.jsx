export default function Footer() {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} Fashion Store. Built with React + Redux ToolKit + Tailwind.
      </div>
    </footer>
  );
}

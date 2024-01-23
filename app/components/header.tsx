import { Link } from "@remix-run/react";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
      <h1 className="text-2xl font-bold">My App</h1>
      <nav>
        <ul className="flex gap-4">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
          <Link to="/contact" className="hover:text-gray-300">Contact</Link>
          <Link to="/admin" className="hover:text-gray-300">Admin</Link>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

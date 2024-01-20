const Header = () => {
  return (
    <header className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
      <h1 className="text-2xl font-bold">My App</h1>
      <nav>
        <ul className="flex gap-4">
          <li><a href="/" className="hover:text-gray-300">Home</a></li>
          <li><a href="/about" className="hover:text-gray-300">About</a></li>
          <li><a href="/contact" className="hover:text-gray-300">Contact</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

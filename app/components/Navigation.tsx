export default function Navigation() {
  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <img src="/logo.png" alt="Olivia Wilson" className="h-8" />
          </div>
          <div className="hidden sm:flex sm:space-x-8 font-montserrat">
            <a href="#" className="text-gray-900 hover:text-gray-500">STYLE</a>
            <a href="#" className="text-gray-900 hover:text-gray-500">SPACE</a>
            <a href="#" className="text-gray-900 hover:text-gray-500">COLOR</a>
            <a href="#" className="text-gray-900 hover:text-gray-500">LIGHT</a>
            <a href="#" className="text-gray-900 hover:text-gray-500">INSPIRATION</a>
          </div>
        </div>
      </nav>
    </header>
  );
} 
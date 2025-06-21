const Header = ({ setSidebarOpen }) => {
  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      </button>

      <div className="flex-1 px-4 flex justify-end items-center">
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          {/* Notifications */}
          <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.07 2.82l-.03.03a1.5 1.5 0 00-.12.22l-.01.02a1.5 1.5 0 00-.1.29v.01a1.5 1.5 0 00-.06.32v.02a1.5 1.5 0 00-.02.33v.01a1.5 1.5 0 00.02.33v.02a1.5 1.5 0 00.06.32v.01a1.5 1.5 0 00.1.29l.01.02a1.5 1.5 0 00.12.22l.03.03a1.5 1.5 0 00.22.12l.02.01a1.5 1.5 0 00.29.1h.01a1.5 1.5 0 00.32.06h.02a1.5 1.5 0 00.33.02h.01a1.5 1.5 0 00.33-.02h.02a1.5 1.5 0 00.32-.06h.01a1.5 1.5 0 00.29-.1l.02-.01a1.5 1.5 0 00.22-.12l.03-.03a1.5 1.5 0 00.12-.22l.01-.02a1.5 1.5 0 00.1-.29v-.01a1.5 1.5 0 00.06-.32v-.02a1.5 1.5 0 00.02-.33v-.01a1.5 1.5 0 00-.02-.33v-.02a1.5 1.5 0 00-.06-.32v-.01a1.5 1.5 0 00-.1-.29l-.01-.02a1.5 1.5 0 00-.12-.22l-.03-.03a1.5 1.5 0 00-.22-.12l-.02-.01a1.5 1.5 0 00-.29-.1h-.01a1.5 1.5 0 00-.32-.06h-.02a1.5 1.5 0 00-.33-.02h-.01a1.5 1.5 0 00-.33.02h-.02a1.5 1.5 0 00-.32.06h-.01a1.5 1.5 0 00-.29.1l-.02.01a1.5 1.5 0 00-.22.12z" />
            </svg>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">OT</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

import { useNavigate } from "react-router-dom";

import { SearchX, Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* 404 icon */}
      <SearchX
        size={80}
        className="text-gray-300 mb-6"
      />

      {/* Error code */}
      <h1 className="text-8xl font-bold text-gray-900 mb-4">
        404
      </h1>

      {/* Error message */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Page Not Found
      </h2>

      <p className="text-gray-500 mb-8">
        The page you're looking for doesn't exist.
      </p>

      {/* Navigate to home */}
      <button
        onClick={() => navigate("/")}
        className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
      >
        <Home size={18} /> Go Home
      </button>
    </div>
  );
};

export default NotFound;
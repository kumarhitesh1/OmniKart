import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          {/* Brand info */}
          <div>
            <h2 className="text-2xl font-bold mb-3">
              <span style={{ color: "#1b2a6b" }}>Omni</span>
              <span style={{ color: "#4f7ef7" }}>Kart</span>
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed">
              Your one-stop shop for everything you need. Quality products,
              fast delivery.
            </p>
          </div>

          {/* Navigation links */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-200">Quick Links</h3>

            <ul className="space-y-2 text-sm text-gray-400">
              <li
                onClick={() => navigate("/")}
                className="cursor-pointer hover:text-white transition-colors"
              >
                Home
              </li>

              <li
                onClick={() => navigate("/products")}
                className="cursor-pointer hover:text-white transition-colors"
              >
                Products
              </li>

              <li
                onClick={() => navigate("/cart")}
                className="cursor-pointer hover:text-white transition-colors"
              >
                Cart
              </li>

              <li
                onClick={() => navigate("/orders")}
                className="cursor-pointer hover:text-white transition-colors"
              >
                Orders
              </li>
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h3 className="font-semibold mb-3 text-gray-200">Follow Us</h3>

            <div className="flex gap-4 text-sm text-gray-400">
              <span className="cursor-pointer hover:text-white transition-colors">
                Facebook
              </span>

              <span className="cursor-pointer hover:text-white transition-colors">
                Twitter
              </span>

              <span className="cursor-pointer hover:text-white transition-colors">
                Instagram
              </span>

              <span className="cursor-pointer hover:text-white transition-colors">
                Youtube
              </span>
            </div>
          </div>
        </div>

        <hr className="border-gray-700 mb-6" />

        {/* Footer bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-400">
          <p>© 2026 OmniKart. All rights reserved.</p>

          <div className="flex gap-6">
            <span className="cursor-pointer hover:text-white transition-colors">
              Privacy Policy
            </span>

            <span className="cursor-pointer hover:text-white transition-colors">
              Terms of Service
            </span>

            <span className="cursor-pointer hover:text-white transition-colors">
              Contact
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
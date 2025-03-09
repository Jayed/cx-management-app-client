import { FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-neutral text-neutral-content">
      {/* Main Footer Section */}
      <footer className="p-10 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="text-3xl font-bold">Hailin Trade</div>
          <p className="mt-2">Providing reliable service since 2024</p>
        </div>
        
        {/* Social Media Links */}
        <div className="mt-6 md:mt-0">
          <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-xl hover:text-blue-500 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="text-xl hover:text-sky-400 transition">
              <FaTwitter />
            </a>
            <a href="#" className="text-xl hover:text-red-600 transition">
              <FaYoutube />
            </a>
          </div>
        </div>
      </footer>
      
      {/* Copyright Section */}
      <footer className="footer footer-center p-4 bg-base-300 text-base-content">
        <p>© 2025 Hailin Trade Guangzhou Limited. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Footer;

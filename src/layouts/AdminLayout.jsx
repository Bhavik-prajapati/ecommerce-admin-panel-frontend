import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../store/themeSlice";
import { useEffect } from "react";

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);

  // ✅ Apply theme whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col transition-all duration-300">
        <div className="flex items-center justify-between px-4 py-4 border-b dark:border-gray-700">
          <h1 className="text-3xl font-bold text-orange-500">ShopEase</h1>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2">
          <Link to="/admin/dashboard" className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-gray-700">
            Dashboard
          </Link>
          <Link to="/admin/products" className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-gray-700">
            Products
          </Link>
          <Link to="/admin/categories" className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-orange-100 dark:hover:bg-gray-700">
            Categories
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-between px-6">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded-lg px-3 py-1 w-1/3 focus:ring-2 focus:ring-orange-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-400 cursor-pointer"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <span className="font-medium dark:text-white">Admin</span>
            <img
              src="https://i.pravatar.cc/40"
              alt="profile"
              className="w-10 h-10 rounded-full border"
            />
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto text-gray-900 dark:text-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

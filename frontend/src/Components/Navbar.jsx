import { Lightbulb, LogOut, Moon, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { themeStore } from "../store/themesStore";

const Navbar = () => {
  const { authUser } = useAuthStore();
  const { setTheme, theme } = themeStore();

  const navigate = useNavigate();

  const { logout } = useAuthStore();

  if (!authUser) {
    return null;
  }

  const handleChange = (e) => {
    if (e.target.checked) {
      setTheme("night");
    } else {
      setTheme("light");
    }
  };

  return (
    <header className="fixed bg-base-300 h-16 w-full top-0 z-40 border-b border-black backdrop-blur-lg">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <h1 className="text-lg font-bold text-primary">Rubriq</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/search")}
                className="flex items-center justify-center hover:bg-slate-500 rounded-full size-7"
              >
                <Search className="size-5" />
              </button>
              <label className="swap swap-rotate hover:bg-slate-500 rounded-full size-7">
                <input
                  type="checkbox"
                  checked={theme === "night"}
                  onChange={handleChange}
                />

                <Lightbulb className="swap-on" />

                <Moon className="swap-off" />
              </label>
            </div>

            <div className="dropdown dropdown-bottom dropdown-end">
              <label tabIndex={0} className="btn m-1">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <LogOut className="size-5 text-primary" />
                </div>
                <h1 className="hidden sm:block text-lg font-bold text-primary">
                  Logout
                </h1>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <button onClick={logout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;

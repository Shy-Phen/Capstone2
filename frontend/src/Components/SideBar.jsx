import { useLocation } from "react-router-dom";
import {
  BookCheckIcon,
  HouseIcon,
  Notebook,
  PersonStandingIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const SideBar = () => {
  const location = useLocation();
  const { authUser } = useAuthStore();

  if (!authUser) {
    return null;
  }

  const navItems = [
    {
      path: "/",
      icon: <HouseIcon className="size-5 text-primary" />,
      label: "Home",
    },
    {
      path: "/assessment-framework",
      icon: <Notebook className="size-5 text-primary" />,
      label: "Rubrics",
    },
    {
      path: "/evaluate",
      icon: <BookCheckIcon className="size-5 text-primary" />,
      label: "Evaluate",
    },
    {
      path: "/student",
      icon: <PersonStandingIcon className="size-5 text-primary" />,
      label: "Student",
    },
  ];

  return (
    <aside className="fixed top-16 h-screen w-10 lg:w-64 border-t-black border-r border-r-black bg-base-300 transition-all duration-200">
      <div className="w-full p-1">
        <div>
          <ul className="space-y-8 mt-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 hover:opacity-80 transition-all p-2 rounded-lg ${
                    location.pathname === item.path ? "bg-primary/20" : ""
                  }`}
                >
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h1 className="hidden lg:block text-lg font-bold">
                    {item.label}
                  </h1>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;

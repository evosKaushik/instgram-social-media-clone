import { useTheme } from "../context/ThemeProvider";

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  const toggleTheme = () => {
    switch (theme) {
      case "dark":
        setTheme("light");
        break;
      case "light":
        setTheme("dark");
        break;
      default:
        break;
    }
  };
  return (
    <a
      href="#"
      onClick={toggleTheme}
      className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg group transition-colors w-fit lg:w-full mt-1"
    >
      <i
        className={`fa-solid ${theme === "dark" ? "fa-sun text-yellow-400" : "fa-moon"} text-[22px] group-hover:scale-105 transition-transform`}
      ></i>
      <span className="hidden lg:block text-[15px]">Appearance</span>
    </a>
  );
};

export default ThemeToggle;

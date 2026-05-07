const AuthFooter = () => {
  return (
    <footer className="w-full border-t border-border py-5 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>English ▾</span>
          <span>© {new Date().getFullYear()} Instagram from Meta</span>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;

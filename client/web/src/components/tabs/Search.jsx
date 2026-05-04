import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import ImageWithShimmer from "../ImageShimmer";
import { Link } from "react-router-dom";
import { BsPatchCheckFill } from "react-icons/bs";
import { useAuthStore } from "../../store/useAuth.store";

const Search = ({ close }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const authUser = useAuthStore(s => s.authUser)

  // ✅ Debounce logic (ONLY debounce here)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 700);

    return () => clearTimeout(timer);
  }, [query]);

  // ✅ API call logic
  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchUsers = async () => {
      setLoading(true); // 🔥 move here

      try {
        const { data } = await axiosInstance.get(`/users?search=${trimmed}`, {
          signal: controller.signal,
        });

        setResults(data.users);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error(err);
        }
      } finally {
        setLoading(false); // 🔥 always stop loading
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, [debouncedQuery]);
  return (
    <div className="py-12 p-4 font-sans relative">
      <h2 className="text-2xl font-bold">Search</h2>

      {/* Input */}
      <div className="mt-8 bg-foreground/15 flex items-center py-2 rounded-full gap-2 px-2">
        <IoSearch size={24} />
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="outline-none border-none bg-transparent w-full"
        />
      </div>
      {loading && <p className="text-sm text-zinc-400">Searching...</p>}
      {/* Results */}
      <div className="mt-4 space-y-2">
        {results.filter(user => user.id !== authUser.id).map((user) => (
          <Link
            key={user.id}
            to={`/${user.username}`}
            onClick={() => {
              close()
              setQuery("");
            }}
            className="p-2 rounded hover:bg-foreground/10 cursor-pointer flex items-start gap-2"
            state={{user}}
          >
            <div className="relative">
              <div className="h-12 w-12 overflow-hidden rounded-full border border-foreground/50">
                <ImageWithShimmer src={user.avatar} />
              </div>
              {user.isBlueTick && (
                <BsPatchCheckFill
                  className="text-blue-500 absolute -right-1 -top-1 z-999 "
                  size={20}
                  title="verified"
                />
              )}
            </div>
            <div>
              <span>{user.username}</span>
              <p>{user.name}</p>
            </div>
          </Link>
        ))}
      </div>
      {!results.length && debouncedQuery && (
        <p className="text-sm text-zinc-500">No users found</p>
      )}

      {/* Close */}
      <button
        onClick={close}
        className="absolute top-4 right-4 cursor-pointer"
      >
        <IoMdClose size={28} />
      </button>
    </div>
  );
};

export default Search;

import Post from "../components/Post";

const Home = () => {
  return (
    <section className="h-full w-full   scrollbar">
      <div className="h-full w-full flex  mx-auto justify-center sm:pt-8 pt-0 max-w-[820px] ">
        <div className="w-full max-w-[470px] flex flex-col items-center mt-1 sm:mt-0">
          {/* Stories */}
          <div className="w-full mb-2 sm:mb-6 mt-1 sm:mt-0">
            <div className="flex space-x-3 sm:space-x-4 overflow-x-auto p-2 sm:p-4 no-scrollbar border-b border-gray-200 dark:border-gray-800 sm:border-none">
              <div className="flex flex-col items-center cursor-pointer min-w-[70px] story-ring">
                <div className="w-[60px] h-[60px] sm:w-[66px] sm:h-[66px] rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px] mb-1">
                  <div className="bg-white dark:bg-black rounded-full p-[2px] w-full h-full">
                    <img
                      src="https://i.pravatar.cc/150?u=openaidalle"
                      className="rounded-full w-full h-full object-cover"
                    />
                  </div>
                </div>
                <span className="text-[11px] sm:text-xs truncate w-16 text-center">
                  openaidalle
                </span>
              </div>
              {/* Additional stories can be mapped here */}
            </div>
          </div>
          {/* Post */}
          <Post />
        </div>
      </div>
      {/* <StoriesModal isOpen={isStoriesOpen} onClose={() => setIsStoriesOpen(false)} /> */}
    </section>
  );
};

export default Home;

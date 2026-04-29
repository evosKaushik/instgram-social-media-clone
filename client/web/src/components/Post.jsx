const Post = () => {
    return (
                <article className="flex flex-col w-full mb-4 sm:mb-8 bg-white dark:bg-black sm:border-b border-gray-200 dark:border-gray-800 pb-4">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px]">
                <img src="https://i.pravatar.cc/150?u=lewishamilton" className="rounded-full w-full h-full object-cover border-2 border-white dark:border-black" />
              </div>
              <div className="flex items-center gap-1 text-[14px]">
                <span className="font-semibold">lewishamilton</span> 
                <span className="text-blue-500 text-xs mt-0.5"><i className="fa-solid fa-circle-check"></i></span>
              </div>
            </div>
            <button className="text-black dark:text-white p-2"><i className="fa-solid fa-ellipsis"></i></button>
          </div>
          <div className="w-full bg-black sm:rounded-[4px] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1541447237128-f4cac6138fbe?q=80&w=2002&auto=format&fit=crop" className="w-full h-auto max-h-[585px] object-cover" />
          </div>
        </article>
    )
}

export default Post

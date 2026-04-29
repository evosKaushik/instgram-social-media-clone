const Loader = () => {
  return (
    <section className="absolute inset-0 items-center justify-between z-50">
      {/* Center Group */}
      <div className="h-full w-full flex justify-center items-center flex-col ">
        <div className="h-[40%]  flex ">
          <img
            src="./Instagram.png"
            className="w-20 h-20"
            resizemode="contain"
          />
        </div>
        <div className="items-center pb-10 absolute bottom-0">
          <h2 className="text-[#737373] text-sm mb-1">from</h2>
          <img src="./meta-logo.png" resizemode="contain" />
        </div>
      </div>
    </section>
  );
};

export default Loader;

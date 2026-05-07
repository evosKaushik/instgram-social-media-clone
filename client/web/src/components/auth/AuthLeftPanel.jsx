const AuthLeftPanel = () => {
  return (
    <div className="hidden lg:flex flex-col flex-1 max-w-[60%] ">
      {/* Logo */}
      <div className="md:absolute md:left-4 md:top-4 2xl:left-12 2xl:top-12">
        <img src="./Instagram.png" alt="Instagram Logo" className="size-16" />
      </div>
      <div className="flex justify-center items-center flex-col h-full">
        {/* Headline */}
        <h1 className="text-4xl leading-tight font-light text-foreground mb-10">
          See everyday moments from <br />
          your{" "}
          <span
            className="font-normal"
            style={{
              background: "linear-gradient(90deg, #FF5C00, #FF0069, #D300C5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            close friends.
          </span>
        </h1>

        {/* Phone mockup illustration */}
        <div className="relative w-full max-w-md 2xl:max-w-lg">
          <img
            src="./signup.png"
            alt="Phone Mockup"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLeftPanel;

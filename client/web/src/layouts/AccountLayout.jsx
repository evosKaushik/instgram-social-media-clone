import { Outlet, useLocation } from "react-router-dom";
import AccountSidebar from "../components/AccountSidebar";
import useMedia from "../hooks/useMedia";

const AccountLayout = () => {
  const { pathname } = useLocation();
  const media = useMedia("xs");

  return (
    <>
      <section className="flex w-full">
        {!media && (
          <div className="hidden xs:block grow xs:shrink-0">
            <AccountSidebar />
          </div>
        )}

        <div className="grow xs:shrink-0">
          <Outlet />
        </div>
      </section>
    </>
  );
};

export default AccountLayout;

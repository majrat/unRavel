import React from "react";
import Progress from "./Progress";
import { Link } from "react-router-dom";

const Header = (props) => {
  const pathname = props.router.location.pathname;
  const isSigninPage = pathname === "/signin";

  return (
    <div>
      {!isSigninPage ? (
        <>
          <h1 className="text-gray-600 font-bold text-3xl mb-5">Create an unRavel Account</h1>
          <Progress {...props} />
        </>
      ) : (
        <h1 className="font-bold text-3xl mb-5 text-gray-600">Sign In to unRavel</h1>
      )}
    </div>
  );
};

export default Header;

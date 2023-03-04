import React from "react";
import { Link } from 'react-router-dom';

const Progress = (props) => {
  const pathname = props.router.location.pathname;
  const isFirstStep = pathname === "/signup/1";
  const isSecondStep = pathname === "/signup/2";
  const isThirdStep = pathname === "/signup/3";

  return (
    <React.Fragment>
      <div className="steps ">
        <div className={`${isFirstStep ? "step active" : "step"}`}>
          <div>1</div>
          <div>
            {isSecondStep || isThirdStep ? (
              <Link to="/signup/1">Step 1</Link>
            ) : (
              "Step 1"
            )}
          </div>
        </div>
        <div className={`${isSecondStep ? "step active" : "step"}`}>
          <div>2</div>
          <div>{isThirdStep ? <Link to="/signup/2">Step 2</Link> : "Step 2"}</div>
        </div>
        <div className={`${pathname === "/signup/3" ? "step active" : "step"}`}>
          <div>3</div>
          <div>Step 3</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Progress;

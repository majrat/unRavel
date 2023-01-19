import { useState, useEffect } from "react";
import { auth } from "../../services/firebase";
import { sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setTimerActivatorOff,
  setTimerActivatorOn,
} from "../../features/timerAvtivator/timerActivatorSlice";

function VerifyEmail() {
  const [time, setTime] = useState(60);
  const currentUser = useSelector((state) => state.currentUser.currentUserInfo);
  const timeActive = useSelector((state) => state.timerActivator.timerActive);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(() => {
      currentUser
        ?.reload()
        .then(() => {
          if (currentUser?.emailVerified) {
            clearInterval(interval);
            navigate("/");
          }
        })
        .catch((err) => {
          alert(err.message);
        });
    }, 1000);
  }, [navigate, currentUser]);

  useEffect(() => {
    let interval = null;
    if (timeActive && time !== 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      dispatch(setTimerActivatorOff());
      setTime(60);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timeActive, time, setTimerActivatorOff]);

  const resendEmailVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        dispatch(setTimerActivatorOn());
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="center">
      <div className="verifyEmail">
        <h1>Verify your Email Address</h1>
        <p>
          <strong>A Verification email has been sent to:</strong>
          <br />
          <span>{currentUser?.email}</span>
        </p>
        <span>Follow the instruction in the email to verify your account</span>
        <button onClick={resendEmailVerification} disabled={timeActive}>
          Resend Email {timeActive && time}
        </button>
      </div>
    </div>
  );
}

export default VerifyEmail;

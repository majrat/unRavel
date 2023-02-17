import { useState, useEffect } from "react";
import { auth } from "../../services/firebase";
import { onAuthStateChanged, sendEmailVerification } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import config from "../../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {
  setTimerActivatorOff,
  setTimerActivatorOn,
} from "../../features/timerAvtivator/timerActivatorSlice";

function VerifyEmail() {
  const [time, setTime] = useState(60);
  const [userUid, setUserUid] = useState("");
  const currentUser = useSelector((state) => state.currentUser.currentUserInfo);
  console.log("currentUser ===> " + JSON.stringify(currentUser));
  const timeActive = useSelector((state) => state.timerActivator.timerActive);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function updateVerifiedInDB() {
    await axios.post(`${config.VITE_SERVER_API}/verify_email`, {
      userUid: currentUser.uid,
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      currentUser
        ?.reload()
        .then(() => {
          onAuthStateChanged(auth, (user) => {
            if (user?.emailVerified) {
              updateVerifiedInDB();
              clearInterval(interval);
              Swal.fire({
                icon: "success",
                title: "Email verified",
                showConfirmButton: false,
                timer: 1500,
              }).then(navigate("/"));
            }
          });
        })
        .catch((err) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.message,
          });
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
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message,
        });
      });
  };

  return (
    <div className="flex pt-32 flex-col items-center">
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

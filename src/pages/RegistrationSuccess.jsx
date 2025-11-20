import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export default function RegistrationSuccess() {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCheck(true), 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        .icon-wrapper {
          position: relative;
          width: 130px;
          height: 130px;
          margin: 0 auto 35px auto;
        }

        .icon {
          position: absolute;
          inset: 0;
          font-size: 130px;
          transition: all 0.7s ease;
        }

        .user-icon {
          color: white;
        }

        .check-icon {
          color: #4ade80;
          opacity: 0;
          transform: scale(0.6);
        }

        .fade-in {
          opacity: 1;
          transform: scale(1);
        }

        .fade-out {
          opacity: 0;
          transform: scale(0.6);
        }
      `}</style>

      <div className="text-center text-white py-5">
        <div className="icon-wrapper">
          {/* User icon */}
          <FontAwesomeIcon
            icon={faUser}
            className={`icon user-icon ${showCheck ? "fade-out" : "fade-in"}`}
          />

          {/* Check icon */}
          <FontAwesomeIcon
            icon={faCircleCheck}
            className={`icon check-icon ${showCheck ? "fade-in" : "fade-out"}`}
          />
        </div>

        <h2>Your account has been successfully created!</h2>
        <p>Welcome aboard 🎉</p>

        <p className="mt-4">
          <a href="/auth" className="text-white text-decoration-underline">
            Go to login
          </a>
        </p>
      </div>
    </>
  );
}

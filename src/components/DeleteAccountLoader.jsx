import { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";

const DeleteAccountLoader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const steps = [
    "Deleting user profile...",
    "Deleting user feed...",
    "Cleaning up data...",
    "Finalizing deletion...",
  ];

  useEffect(() => {
    const TOTAL_DURATION = 6000; // 6 sek
    const PROGRESS_TICK = 60; // uppdatering var 60ms
    const STEP_INTERVAL = 1500; // textbyte var 1.5 sek

    let pct = 0;
    const pctIncrease = 100 / (TOTAL_DURATION / PROGRESS_TICK);

    const progressTimer = setInterval(() => {
      pct += pctIncrease;
      setProgress(Math.min(100, Math.round(pct)));
    }, PROGRESS_TICK);

    const textTimers = steps.map((text, index) =>
      setTimeout(() => setStatus(text), STEP_INTERVAL * index)
    );

    const finishTimer = setTimeout(() => {
      clearInterval(progressTimer);
      if (onFinish) onFinish();
    }, TOTAL_DURATION);

    return () => {
      clearInterval(progressTimer);
      textTimers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div style={overlayStyle}>
      <div style={loaderStyle}>
        <p style={{ fontWeight: "bold", minHeight: 25, textAlign: "center" }}>
          {status}
        </p>
        <ProgressBar
          now={progress}
          label={`${progress}%`}
          animated
          striped
          style={{ height: 25 }}
        />
      </div>
    </div>
  );
};

export default DeleteAccountLoader;

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)", // dimming
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const loaderStyle = {
  backgroundColor: "#333",
  padding: "30px 40px",
  borderRadius: "12px",
  minWidth: "300px",
};

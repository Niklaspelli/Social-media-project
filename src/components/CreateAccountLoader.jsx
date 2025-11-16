import { useState, useEffect } from "react";
import { ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CreateAccountLoader = ({ onFinish }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const steps = [
    "Creating user profile...",
    "Setting up user feed...",
    "Applying preferences...",
    "Finalizing account...",
  ];

  useEffect(() => {
    const TOTAL_DURATION = 6000; // 6 sek
    const PROGRESS_TICK = 60; // en uppdatering var 60ms
    const STEP_INTERVAL = 1500; // textbyte var 1.5 sek

    // ---- Progress (0 → 100 % på exakt 6 sek) ----
    let pct = 0;
    const pctIncrease = 100 / (TOTAL_DURATION / PROGRESS_TICK); // exakt steg

    const progressTimer = setInterval(() => {
      pct += pctIncrease;
      setProgress(Math.min(100, Math.round(pct)));
    }, PROGRESS_TICK);

    // ---- Textsteg ----
    const textTimers = steps.map((text, index) =>
      setTimeout(() => {
        setStatus(text);
      }, STEP_INTERVAL * index)
    );

    // ---- Avslut exakt efter 6 sek ----
    const finishTimer = setTimeout(() => {
      clearInterval(progressTimer);
      onFinish();
      navigate("/home");
    }, TOTAL_DURATION);

    return () => {
      clearInterval(progressTimer);
      textTimers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, []);

  return (
    <div style={{ marginTop: 40, textAlign: "center" }}>
      <p style={{ fontWeight: "bold", minHeight: 25 }}>{status}</p>

      <ProgressBar
        now={progress}
        label={`${progress}%`}
        animated
        striped
        style={{ height: 25 }}
      />
    </div>
  );
};

export default CreateAccountLoader;

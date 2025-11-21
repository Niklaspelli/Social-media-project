import ActivityFeed from "./ActivityFeed";
import "../index.css";

function LandingPage() {
  return (
    <div>
      <h1 className="text-white">Home</h1>
      <ActivityFeed />
    </div>
  );
}

export default LandingPage;

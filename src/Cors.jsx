import React, { useEffect, useState } from "react";

function Cors() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/cors`);
      const result = await response.json();
      if (result && result.length > 0) {
        setData(result[1]); // Assuming you want the first user's details
      } else {
        console.error("No details found.");
        setData(null);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails(); // Fetch details only once on component mount
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data available</div>;
  }

  return (
    <div>
      <p>Det här är CORS övningen. Hämtar från databas.</p>
      <div>Förnamn: {data.name}</div>
      <div>Efternamn: {data.lastname}</div>
      <div>Information: {data.info}</div>
    </div>
  );
}

export default Cors;

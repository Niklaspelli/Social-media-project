import { db } from "./config/db.js";
import { PORT, AUTH, HTTP_ONLY, SECURE, SAME_SITE } from "./config.js";

import app from "./service.js";

// Connect to MySQL
db.connect((error) => {
  if (error) {
    console.error("Error connecting to MySQL:", error.message);
    process.exit(1); // Exit process on error
  }
  console.log("MySQL is connected! Woop Woop!");
});

app.listen(PORT, (err) => {
  if (err) {
    console.log(`Failed to start the server ${err}`);
  }
  console.log(`server running on port ${PORT}`);
  console.log(`Using ${AUTH} authentication`);
  console.log(`HTTPOnly is ${HTTP_ONLY}`);
  console.log(`Secure is ${SECURE}`);
  console.log(`Same site is ${SAME_SITE}`);
});

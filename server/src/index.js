import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import connectDB from "./db/index.js";
import app from "./app.js";

const serverPort = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(serverPort, () => {
      console.log({
        serverStatus: `🌐 Application is Running at port: ${serverPort}`,
      });
    });

    app.on("error", (err) => {
      console.error("Error occurred at index.js", err);
    });
  })
  .catch((error) => {
    console.error("DB connection failed from index.js", error);
  });

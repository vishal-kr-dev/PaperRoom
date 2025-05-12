import dotenv from "dotenv";
import server from "./server.js";
import connectDB from "./db/index.js";

dotenv.config({ path: "./.env" });

process.setMaxListeners(15);

const serverPort = process.env.PORT || 8080;

connectDB()
  .then(() => {
    server.listen(serverPort, () => {
      console.log({
        serverStatus: `🌐 Application is Running at port: ${serverPort}`,
      });
    });

    server.on("error", (err) => {
      console.log("Error occurred at index.js", err);
    });
  })
  .catch((error) => {
    console.log("DB connection failed from index.js", error);
  });

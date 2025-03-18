import dotenv from "dotenv";
import { connectDb } from "./db/db.js";
import { app } from "./app.js";


dotenv.config({
  path: "./.env",
});

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log(`ERROR ::: ${err}`);
      throw err;
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port: ${process.env.PORT}`);
    });
  })
  .catch((err) =>
    console.log(`MONGODB CONNECTION FAILED !!! ERROR ::: ${err}`)
  );

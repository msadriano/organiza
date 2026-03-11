import "dotenv/config";
import "./utils/validate.env";

import { app } from "./app";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`The server is running in http://localhost:${PORT}`);
});

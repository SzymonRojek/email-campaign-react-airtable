// error monitoring first - it has to wrap Express before the app is created
import "./instrument";
import { app } from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`sever is running on the port ${PORT}...`);
});

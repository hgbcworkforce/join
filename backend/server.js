import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 HGBC First-Timer Backend API Running`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 Mode: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});

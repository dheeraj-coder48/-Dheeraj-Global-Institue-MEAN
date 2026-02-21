const express = require("express");
const dotenv = require ("dotenv");
dotenv.config({path:"./config/.env"});
const app = express ();
const connectDB = require("./config/db");
connectDB();
const morgan = require("morgan");
const cors = require("cors");

const PORT = process.env.PORT;

//Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());


//Importing Routes
const contactRoutes = require("./routes/contact");
const eventRoutes = require("./routes/event");
const galleryRoutes = require("./routes/gallery");
const noticeRoutes = require("./routes/notice");
const teacherRoutes = require("./routes/teacher");
const authRoutes = require("./routes/auth");

app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});
//Using Routes
app.use("/api/contact",contactRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/notice", noticeRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`)
});

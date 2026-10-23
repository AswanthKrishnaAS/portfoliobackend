const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/view_count", require("./routes/view.routes"));
app.use("/api/download_track", require("./routes/download.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/pdf", require("./routes/pdf.routes"));
app.use("/api/music", require("./routes/music.routes"));
app.use("/api/chat-users", require("./routes/chatUser.routes"));
app.use("/api/enquiries", require("./routes/enquiry.routes"));

// Serve static files with inline PDF headers so browsers display rather than download
const path = require("path");
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.pdf')) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline');
        }
    }
}));

module.exports = app;
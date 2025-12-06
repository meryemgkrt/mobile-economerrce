import express from "express";

const app = express();

const PORT = process.env.PORT || 8080;

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Merhaba kod çalıştı!:))" });
});

app.listen(PORT, () => {
  console.log(`Sunucu çalıştı! Port: ${PORT}`);
});

const app = require("./app");

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV) {
  app.use(express.static(path.resolve(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/, index.html"));
  });
}

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`sever is running on the port ${PORT}...`);
});

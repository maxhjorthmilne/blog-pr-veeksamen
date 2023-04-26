const express = require("express");

const app = express();
app.listen(3000);

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("minSide", { title: "home" });
});

app.get("/veiledning", (req, res) => {
    res.render("veiledning", { title: "SSH hjelp" }, );
  });

  app.get("/pawel.kjekk@gmail.com", (req, res) => {
    res.render("pawel", { title: "pawel bloggs" });
  });

  app.get("/max05hm@gmail.com", (req, res) => {
    res.render("max", { title: "max bloggs" });
  });


  app.get("/minSide", (req, res) => {
    res.render("minSide", { title: "min side" });
  });




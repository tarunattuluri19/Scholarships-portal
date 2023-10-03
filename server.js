const express = require("express");
const mongoose = require("mongoose");
const devuser = require("./devusermodel");
const admin = require("./admin");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware");
const cors = require("cors");
const app = express();

app.use(express.json());//creates data into json format for easy transferring of data
app.use(cors({ origin: "*" }));//complete project 

mongoose
  .connect(
    "mongodb+srv://TharunRaj:TharunRaj@cluster0.a9pb1wh.mongodb.net/?retryWrites=true&w=majority"
  )//promise
  .then(() => console.log("DB connected"))// if req is successfull
  .catch((err) => console.log(err));// if req comes with error

app.get("/", (req, res) => {
  return res.send("<h1>hello</h1>");
});

app.post("/user", async (req, res) => {
  try {
    const {
      fullname,
      email,
      aadharnumber,
      contactnumber,
      dob,
      college,
      educationlevel,
      admissioncategory,
      gender,
      income,
      status,
    } = req.body;
    const exist = await devuser.findOne({ aadharnumber });

    if (exist) {
      return res.status(400).send("user already registred");
    }

    const newUser = new devuser({
      fullname,
      email,
      aadharnumber,
      contactnumber,
      dob,
      college,
      educationlevel,
      admissioncategory,
      gender,
      income,
      status,
    });
    newUser.save();//saving objects in the db
    return res.status(200).send("successfully registred");
  } catch (error) {
    console.log(error);
    return res.status(500).send("server error");
  }
}); ``

app.post("/userlogin", async (req, res) => {
  try {
    const { aadharnumber } = req.body;
    const aadharexist = await devuser.findOne({ aadharnumber });
    if (!aadharexist) {
      return res.status(400).send("user not exist");
    } else {
      return res.json(aadharexist);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("server error");
  }
});

app.post("/adminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminexist = await admin.findOne({ email });
    if (!adminexist) {
      return res.status(400).send("admin not found");
    }
    if (adminexist.password != password) {
      return res.status(400).send("password not match");
    }

    const payload = {
      user: {
        id: adminexist.id,
      },
    };

    jwt.sign(payload, "jwtPassword", { expiresIn: 36000000 }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/allusers", middleware, async (req, res) => {
  try {//admin should login
    let allusers = await devuser.find();
    return res.json(allusers);
  } catch (error) {
    console.log(error);
  }
});

app.put("/allusers", async (req, res) => {//since it is put http it updates data
  const { id, status } = req.body;

  try {
    const updatedUser = await devuser.findOneAndUpdate(
      { _id: id },
      { status: status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

app.get("/allusers/:id", middleware, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await devuser.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("server error");
  }
});

app.put("/allusers/:id", async (req, res) => {
  try {
    const user = await devuser.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { status } = req.body;
    if (status === "Approved") {
      user.status = "Approved";
    } else if (status === "Disapproved") {
      user.status = "Disapproved";
    } else {
      return res.status(400).json({ message: "Invalid status" });
    }

    await user.save();

    res.json(`User ${status.toLowerCase()}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(5000, () => console.log("server running"));

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const axios = require("axios");
const {
  addUser,
  getUserByEmail,
  getUserByPhone,
  updateuser,
} = require("../collection/Users");
const {
  addSubmission,
  getAllSubmission,
  searchSubmission,
} = require("../collection/Submission");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { getauthurl, getToken } = require("../middleware/authurl");
const uniqid = require("uniqid");
const PDFDocument = require("pdfkit");

// === === === controller === === === //

exports.registerStudent = async (req, res) => {
  try {
    const { phone, dob, Class, gender, schoolName, schoolCode } = req.body;
    const user = req.user;
    console.log(Class);
    const add = await updateuser({
      ...user,
      phone,
      dob,
      Class,
      gender,
      schoolName,
      schoolCode,
    });
    if (add.result) {
      res.status(200).json({ result: true, message: "Details Saved" });
    } else {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "Some Error occured",
        })
      );
    }
  } catch (error) {
    let err = JSON.parse(error.message);
    res.status(err.status || 400).json({ result: false, message: err.message });
  }
};
exports.register = async (req, res) => {
  try {
    const { email, name, phone, password, cpassword } = req.body;
    if (!email || !validator.isEmail(email)) {
      throw new Error(
        JSON.stringify({ status: 400, message: "Please provide a valid email" })
      );
    } else if (!phone || !validator.isMobilePhone(phone, "en-IN")) {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "Please provide a valid Mobile number",
        })
      );
    } else if (!password || !cpassword) {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "Please input every field",
        })
      );
    } else if (password !== cpassword) {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "Both password must be identical",
        })
      );
    } else if (!validator.isStrongPassword(password)) {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "Please enter a strong password",
        })
      );
    }
    if ((await getUserByEmail(email)).result) {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "email is already associated with another account",
        })
      );
    }
    if ((await getUserByPhone(phone)).result) {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "phone number is already associated with another account",
        })
      );
    }
    let result = await addUser({
      email,
      id: uniqid("user-"),
      name,
      phone,
      password,
    });
    if (result.result) {
      res
        .status(201)
        .json({ result: true, message: "registration was successful" });
    } else {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "Some error occured",
        })
      );
    }
  } catch (error) {
    console.log(error);
    let err = JSON.parse(error.message);
    res.status(err.status || 400).json({ result: false, message: err.message });
  }
};

// === === === login === === === //

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !validator.isEmail(email)) {
      throw new Error(
        JSON.stringify({ status: 400, message: "Please provide a valid email" })
      );
    } else if (!password || !validator.isStrongPassword(password)) {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "Please enter a valid password",
        })
      );
    }
    let user = await getUserByEmail(email);
    if (!user.result) {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "either your email or password is incorrect",
        })
      );
    } else if (!bcrypt.compare(password, user.user.password)) {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "either your email or password is incorrect",
        })
      );
    }
    const token = jwt.sign(
      { email: email.toLowerCase(), name: user.user.name },
      process.env.SECRET_KEY,
      {
        expiresIn: "432000 seconds",
      }
    );
    let updatedUser = {
      ...user.user,
      tokens: user.user.tokens ? [...user.user.tokens, token] : [token],
    };
    let updater = await updateuser(updatedUser);
    if (updater.result) {
      res
        .status(200)
        .cookie("idnty", token, {
          expires: new Date(Date.now() + 432000000),
        })
        .json({ result: true, message: "logged in" });
    } else {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "Please check your email or password",
        })
      );
    }
  } catch (error) {
    const err = JSON.parse(error.message);
    res.status(400 || err.status).json({ result: false, message: err.message });
  }
};

// === === === profile === === === //

exports.profile = async (req, res) => {
  try {
    res.json({
      ...req.user,
    });
  } catch (error) {
    const err = JSON.parse(error.message);
    res.status(400 || err.status).json({ result: false, message: err.message });
  }
};

// === === === login url === === === //

exports.google_login_url = (req, res) => {
  return res.status(200).json({ result: true, url: getauthurl() });
};

// === === === handel token === === === //

function generateStrongPassword(length) {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()-_=+[]{}|;:',.<>?";

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  return password;
}

exports.google_handel_token = async (req, res) => {
  try {
    const code = req.query.code;
    const { id_token, access_token } = await getToken({
      code,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_KEY,
      redirectUri: process.env.REDIRECT_URL,
    });

    const googleUser = await axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
        {
          headers: {
            Authorization: `Bearer ${id_token}`,
          },
        }
      )
      .then((res) => res.data)
      .catch((error) => {
        console.error("Failed to fetch user");
        throw new Error(error.message);
      });
    let user = await getUserByEmail(googleUser.email);
    if (user.result) {
      const token = jwt.sign(
        { email: user.user.email.toLowerCase(), name: user.user.name },
        process.env.SECRET_KEY,
        {
          expiresIn: "432000 seconds",
        }
      );
      let updatedUser = {
        ...user.user,
        tokens: user.user.tokens ? [...user.user.tokens, token] : [token],
      };
      let updater = await updateuser(updatedUser);
      if (updater.result) {
        res
          .status(200)
          .cookie("idnty", token, {
            expires: new Date(Date.now() + 432000000),
          })
          .redirect(process.env.FINAL);
      } else {
        throw new Error(
          JSON.stringify({
            status: 400,
            message: "Please check your email or password",
          })
        );
      }
    } else {
      const token = jwt.sign(
        { email: googleUser.email.toLowerCase(), name: googleUser.name },
        process.env.SECRET_KEY,
        {
          expiresIn: "432000 seconds",
        }
      );
      let password = generateStrongPassword();
      let result = await addUser({
        id: uniqid("user-"),
        email: googleUser.email,
        name: googleUser.name,
        password: password,
        tokens: [token],
        verification: {
          email: true,
        },
      });
      if (result.result) {
        res
          .status(200)
          .cookie("idnty", token, {
            expires: new Date(Date.now() + 432000000),
          })
          .redirect(process.env.FINAL);
      } else {
        throw new Error(
          JSON.stringify({
            status: 400,
            message: "some error occured",
          })
        );
      }
    }
  } catch (error) {}
};

// === === === logout === === === //

exports.logout = async (req, res) => {
  try {
    let user = req.user;
    user.tokens = user.tokens.filter((itm) => itm !== req.cookies.idnty);
    let updater = await updateuser(user);
    if (updater.result) {
      res.status(200).clearCookie("idnty").json({
        result: true,
        message: "logged out",
      });
    } else {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "logged out",
        })
      );
    }
  } catch (error) {
    const err = JSON.parse(error.message);
    res
      .clearCookie("idnty")
      .status(400 || err.status)
      .json({ result: false, message: err.message });
  }
};

exports.get_test = async (req, res) => {
  try {
    fs.readFile(
      path.join(__dirname, "../questions/question.json"),
      (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          return res.status(400).json({
            result: false,
            message: "Some error occurred",
          });
        } else {
          const tests = JSON.parse(data);
          return res.status(200).json({ tests });
        }
      }
    );
  } catch (error) {
    console.error("Error fetching test data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
function generatePDF(submissionData) {
  // Create a new PDF document
  const doc = new PDFDocument();

  // Generate a unique filename using timestamp
  const timestamp = Date.now();
  const fileName = `submission_${timestamp}.pdf`;

  // Define the directory path where the PDF will be saved
  const directoryPath = path.join(__dirname, "../questions/results/");

  // Ensure that the directory exists, create it if not
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  // Define the file path where the PDF will be saved
  const filePath = path.join(directoryPath, fileName);

  // Pipe the PDF content to a writable stream to save it as a file
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Write submission data to the PDF
  doc.text("Submission Data", { underline: true }).moveDown();
  doc.text(JSON.stringify(submissionData, null, 2));

  // Finalize the PDF
  doc.end();
}
function appendObjectToArray(data, fileLocation) {
  // Ensure that fileLocation is a string
  if (typeof fileLocation !== "string") {
    console.error("File location must be a string.");
    return;
  }

  fs.readFile(fileLocation, "utf8", (err, fileData) => {
    let jsonData = [];

    if (err) {
      // If file does not exist, create the file
      if (err.code === "ENOENT") {
        console.log("File does not exist. Creating a new file.");
        jsonData.push(data); // Add the new data to the array
      } else {
        console.error("Error reading file:", err);
        return;
      }
    } else {
      if (fileData.trim() !== "") {
        // If fileData is not empty, parse it as JSON
        try {
          jsonData = JSON.parse(fileData);
          if (!Array.isArray(jsonData)) {
            console.log(
              "Existing data in file is not an array. Resetting to empty array."
            );
            jsonData = []; // Reset jsonData to an empty array
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
          return;
        }
      }
      // Push the new data to the array
      jsonData.push(data);
    }

    // Convert the modified JavaScript object back to JSON
    const updatedJsonData = JSON.stringify(jsonData, null, 2);

    // Write the updated JSON data back to the file
    fs.writeFile(fileLocation, updatedJsonData, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("Object appended to array successfully!");
    });
    generatePDF(data);
  });
}
function checkEmailExists(emailToCheck, fileLocation) {
  // Ensure that fileLocation is a string
  if (typeof fileLocation !== "string") {
    console.error("File location must be a string.");
    return false;
  }

  try {
    // Check if the file exists
    if (!fs.existsSync(fileLocation)) {
      console.log("File does not exist.");
      return false;
    }

    // Read the JSON file synchronously
    const fileData = fs.readFileSync(fileLocation, "utf8");

    // Parse the file content as JSON
    const jsonData = JSON.parse(fileData);

    // Check if any object in jsonData has the specified email
    return jsonData.some((obj) => obj.email === emailToCheck);
  } catch (error) {
    console.error("Error reading or parsing JSON file:", error);
    return false;
  }
}
exports.submission = async (req, res) => {
  try {
    const data = req.body;
    const { id, name, email, schoolName, schoolCode } = req.user;
    if (
      checkEmailExists(
        email,
        path.join(__dirname, "../questions/submission.json")
      )
    ) {
      return res.status(400).json({
        message: "already submitted",
      });
    }

    let sub = {
      id,
      name,
      email,
      schoolName,
      schoolCode,
      submission: data,
    };
    const result = await updateuser({ ...req.user, submission: data });

    appendObjectToArray(
      sub,
      path.join(__dirname, "../questions/submission.json")
    );
    console.log("hi");
    if (result.result) {
      res.status(201).json({ result: true, message: "Submitted" });
    } else {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "Some error occurred",
        })
      );
    }
  } catch (error) {
    console.error("Error fetching test data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
exports.get_submission = async (req, res) => {
  try {
    if (!req.query.email) {
      return res.status(400).json({
        message: "Failed",
      });
    } else {
      console.log(req.query.email);
    }
    let data = await searchSubmission({
      email: req.query.email,
    });
    res.status(200).json(data);
  } catch (error) {}
};

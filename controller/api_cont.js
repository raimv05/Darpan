const bcrypt = require("bcrypt");
const axios = require("axios");
const {
  addUser,
  getUserByEmail,
  getUserByPhone,
  updateuser,
} = require("../collection/Users");
const { addTest, getAllTests } = require("../collection/Test");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { getauthurl, getToken } = require("../middleware/authurl");
const uniqid = require("uniqid");

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
    const {
      email,
      name,
      phone,
      id,
      verification,
      registrationDate,
      dob,
      Class,
      gender,
      schoolName,
      schoolCode,
    } = req.user;
    res.json({
      email,
      name,
      phone,
      id,
      verification,
      registrationDate,
      dob,
      Class,
      gender,
      schoolName,
      schoolCode,
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

// === === === upload a new test === === === //

function validateTest(test) {
  // General Test Information Validation
  if (!test.title.trim()) {
    return "Test title cannot be empty.";
  }

  const testDatetime = new Date(test.datetime);
  if (!(testDatetime instanceof Date) || isNaN(testDatetime)) {
    return "Invalid datetime format or not a future date.";
  }

  const duration = parseInt(test.duration, 10);
  if (isNaN(duration) || duration <= 0) {
    return "Duration must be a positive number.";
  }

  // Section-level Validation
  test.sections = test.sections.filter(
    (itm) => itm.marks && itm.question_count
  );
  if (parseInt(test.section, 10) !== test.sections.length) {
    return "Number of sections does not match the expected number specified.";
  }

  for (const section of test.sections) {
    if (
      isNaN(parseInt(section.question_count, 10)) ||
      parseInt(section.question_count, 10) <= 0
    ) {
      return "Invalid question count for a section.";
    }

    if (
      isNaN(parseInt(section.marks, 10)) ||
      parseInt(section.marks, 10) <= 0
    ) {
      return "Invalid marks for a section.";
    }

    const sectionNegative =
      section.negative.trim() !== "" ? parseFloat(section.negative) : null;

    if (
      sectionNegative !== null &&
      (isNaN(sectionNegative) ||
        sectionNegative < 0 ||
        sectionNegative > parseInt(section.marks, 10))
    ) {
      return "Invalid negative marking for a section.";
    }
  }

  // Question-level Validation
  for (const section of test.sections) {
    for (const question of section.questions) {
      if (!question.question.trim()) {
        return "Question text cannot be empty.";
      }

      const optionCount = parseInt(question.option_count, 10);
      if (
        isNaN(optionCount) ||
        optionCount <= 0 ||
        optionCount !== question.options.length
      ) {
        return "Invalid option count for a question.";
      }

      for (const option of question.options) {
        if (!option.text.trim()) {
          return "Option text cannot be empty.";
        }

        // if (option.iscorrect !== undefined && option.iscorrect !== true) {
        //   return "At least one option must be marked as correct.";
        // }
      }
    }
  }

  // Global Test-level Validation
  const totalQuestions = test.sections.reduce(
    (total, section) => total + section.questions.length,
    0
  );
  if (
    totalQuestions !==
    test.sections.reduce(
      (total, section) => total + parseInt(section.question_count, 10),
      0
    )
  ) {
    return "Total number of questions does not match the sum of question counts in sections.";
  }
  return null;
}

exports.upload_test = async (req, res) => {
  try {
    const user = req.user;
    const data = req.body;
    let validations = validateTest(data);
    if (validations) {
      console.log(validations);
      return res.status(400).json({ result: false, message: validations });
    }
    let result = await addTest({
      ...data,
      id: uniqid("test-"),
      creator_id: user.id,
    });
    if (result.result) {
      res
        .status(201)
        .json({ result: true, message: "test created successfully" });
    } else {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: "Some error occured",
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
    const { userId, testId } = req.body;

    const tests = await getAllTests(userId, testId);

    if (tests.length === 0) {
      return res.status(404).json({ error: "No tests found" });
    }

    const filteredTests = tests.map(
      ({ id, creator_id, title, datetime, duration }) => ({
        id,
        creator_id,
        title,
        datetime,
        duration,
      })
    );

    return res.status(200).json({ tests: filteredTests });
  } catch (error) {
    console.error("Error fetching test data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

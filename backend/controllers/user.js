const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");



exports.createUser =  (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      passwordConf: hash,
      adresse: req.body.adresse,
      tel: req.body.tel,
      name: req.body.name
    })
    user.save()
      .then(result => {
        res.status(201).json({
          message: 'User created!',
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials"
        });
      });
  });
}



exports.userLogin = (req, res, next) => {
  let fetchedUser;                            // Because user only exists in the first then block
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {                            // Wrong email
        return res.status(401).json({
          message: "Authentication failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {                         // Wrong password
        return res.status(401).json({
          message: "Authentication failed"
        });
      }
      const token = jwt.sign(                     // This is our jsonwebtoken
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {                          // Other
      return res.status(401).json({
        message: "Invalid authentication credentials"
      });
    });
}

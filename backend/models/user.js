const mongoose = require("mongoose");
const validator = require("validator");

const REGEX = /https?:\/\/(www.)?[a-z0-9-.]{2,64}\.[a-z]+[-._~:/?#[\]@!$&'()*+,;=\w]*#?/
//                               [     domen     ].[zone][                path         ]

const linkValidator = (str) => REGEX.exec(str)[0] === str;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: "Исследователь",
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    validate: linkValidator,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false,
  },
});

module.exports = mongoose.model("user", userSchema);

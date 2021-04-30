const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const CustomError = require("../utils/errors");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) res.send(user);
      else throw new CustomError(404, "Запрашиваемый пользователь не найден");
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password)
    throw new CustomError(400, "Поля email и password обязательные");

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.send(user))
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  if (!name || !about)
    throw new CustomError(400, "Поля name и about обязательные");

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((newUser) => res.send(newUser))
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  if (!avatar) throw new CustomError(400, "Поле avatar обязательно");

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((newUser) => res.send(newUser))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new CustomError(400, "Поля email и password обязательные");

  const { NODE_ENV, JWT_SECRET } = process.env;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) throw new CustomError(401, "Неправильные почта или пароль");

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched)
          throw new CustomError(401, "Неправильные почта или пароль");

        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
          expiresIn: "7d",
        });

        return res
          .cookie("jwt", token, {
            maxAge: 3600000,
            httpOnly: true,
          })
          .send({ token: true });
      });
    })
    .catch(next);
};

const logout = (req, res) => {
  res.clearCookie("jwt", {
    maxAge: 3600000,
    httpOnly: true,
  }).send({message: 'Вы вышли'});
};

const getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  logout,
  getProfile,
};

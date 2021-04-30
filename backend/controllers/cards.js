const Card = require("../models/card");
const CustomError = require("../utils/errors");

const getCards = (req, res, next) => {
  Card.find({})
    .sort("-createdAt")
    .then((cards) => res.send({ cards }))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  if (!name || !link)
    throw new CustomError(400, "Поля name и link обязательные");

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card)
        throw new CustomError(404, "Запрашиваемая карточка не найдена");
      else if (card.owner.toString() === req.user._id)
        return Card.findByIdAndRemove(card._id);
      else
        throw new CustomError(
          401,
          "Пользователь не может удалить чужую карточку"
        );
    })
    .then((card) => res.send(card))
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((newCard) => {
      if (newCard) res.send(newCard);
      else throw new CustomError(404, "Запрашиваемая карточка не найдена");
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .then((newCard) => {
      if (newCard) res.send(newCard);
      else throw new CustomError(404, "Запрашиваемая карточка не найдена");
    })
    .catch(next);
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };

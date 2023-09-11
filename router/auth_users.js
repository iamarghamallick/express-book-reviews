const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  const minLength = 3;
  const maxLength = 20;
  const validCharactersRegex = /^[a-zA-Z0-9_-]+$/;
  if (username.length < minLength || username.length > maxLength) {
    return false;
  }
  if (!validCharactersRegex.test(username)) {
    return false;
  }
  return true;
}

const authenticatedUser = (username, password) => { //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbnParam = req.params.isbn;
  const { review } = req.body;

  if (!review || typeof review !== "string") {
    return res.status(400).json({ message: "Invalid review data" });
  }
  const book = books[isbnParam];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (typeof book.reviews !== "object") {
    book.reviews = {};
  }
  const reviewId = Date.now().toString();
  book.reviews[reviewId] = review;
  return res.status(200).json({ message: "Review added successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

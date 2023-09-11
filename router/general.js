const express = require('express');
let books = require("./booksdb.js");
const { json } = require('express/lib/response.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (isValid(username) && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbnParam = req.params.isbn;
  const book = books[isbnParam];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  return res.status(200).json({ book });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const authorParam = req.params.author;
  const authorBooks = Object.values(books).filter(
    (book) => book.author === authorParam
  );
  if (authorBooks.length === 0) {
    return res.status(404).json({ message: 'No books found by this author' });
  }
  return res.status(200).json({ books: authorBooks });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const titleParam = req.params.title;
  const titleBooks = Object.values(books).filter(
    (book) => book.title === titleParam
  );
  if (titleBooks.length === 0) {
    return res.status(404).json({ message: 'No books found by this author' });
  }
  return res.status(200).json({ books: titleBooks });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbnParam = req.params.isbn;
  const review = books[isbnParam].reviews;
  if (!review) {
    return res.status(404).json({ message: 'Book not found' });
  }
  return res.status(200).json({ review });
});

module.exports.general = public_users;

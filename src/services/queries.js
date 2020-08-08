'use strict';

const db = require('../databases');

async function getUser(filters) {
  return await db('users').select('*').where(filters);
}

async function getProduct(filters) {
  return await db('products').select('*').where(filters);
}

async function getHolding(filters) {
  return await db('holding').select('*').where(filters);
}

async function holdProducts(productToHold) {
  console.log(productToHold);
  let found = await db('holding').select('*').where(productToHold);
  if (found) {
    console.log(found);
  } else {
    console.log('not found');
  }
}

function addComment(comment) {
  return db('comments')
    .insert({
      comment_id: comment.comment_id,
      content: comment.content || '',
      author: comment.author
    })
    .returning('*');
}

function addAuthor(author) {
  return db('authors')
    .insert({
      author_id: author.author_id,
      first_name: author.first_name || '',
      last_name: author.last_name || ''
    })
    .returning('*');
}

function updateMovie(movie) {
  const tmpMovie = {};

  if (movie.name) tmpMovie.name = movie.name;
  if (movie.genre) tmpMovie.genre = movie.genre;
  if (movie.rating) tmpMovie.rating = movie.rating;
  if (movie.explicit) tmpMovie.explicit = movie.explicit;
  if (movie.comments) tmpMovie.comments = movie.comments;

  return db('holding').where('movie_id', movie.movie_id).update(tmpMovie).returning('*');
}

function updateComment(comment) {
  const tmpComment = {};

  if (comment.content) tmpComment.content = comment.content;
  if (comment.author) tmpComment.author = comment.author;

  return db('comments').where('comment_id', comment.comment_id).update(tmpComment).returning('*');
}

function updateAuthor(author) {
  const tmpAuthor = {};

  if (author.first_name) tmpAuthor.first_name = author.first_name;
  if (author.last_name) tmpAuthor.last_name = author.last_name;

  return db('authors').where('author_id', author.author_id).update(tmpAuthor).returning('*');
}

function deleteMovie(movieId) {
  return db('holding').where('movie_id', movieId.movie_id).del().returning('*');
}

function deleteComment(commentId) {
  return db('comments').where('comment_id', commentId.comment_id).del().returning('*');
}

function deleteAuthor(authorId) {
  return db('authors').where('author_id', authorId.author_id).del().returning('*');
}

module.exports = {
  getUser,
  getProduct,
  getHolding,
  holdProducts,
  addComment,
  addAuthor,
  updateMovie,
  updateComment,
  updateAuthor,
  deleteMovie,
  deleteComment,
  deleteAuthor
};

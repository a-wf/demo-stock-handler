// 'use strict';

// var FizzBuzzService = require('../services/fizzBuzzService');

// module.exports.getFizzBuzzAnswer = (logger) => {

//   return (req, res, next) => {

//     logger.Info('fizzBuzzRoutes', 'getFizzBuzzAnswer', `${req.method} ${req.originalUrl}`, `query parameters: ${req.query}`);

//     if (typeof req.query.int1 !== 'number' || typeof req.query.int2 !== 'number' || typeof req.query.limit !== 'number' ||
//       typeof req.query.str1 !== 'string' || typeof req.query.str2 !== 'string') {
//       logger.Error('fizzBuzzRoutes', 'getFizzBuzzAnswer', `Bad Request: bad input(s) type`);
//       res.status(400).json({
//         message: 'bad input(s)',
//       });
//       // throw new Error('Bad Request');
//       return;
//     }

//     FizzBuzzService.fizzBuzzAnswer(req.query.int1, req.query.int2, req.query.limit, req.query.str1, req.query.str2)
//       .then(function (answer) {
//         res.status(200).json({ answer });
//       })
//       .catch(function (error) {
//         logger.Error('fizzBuzzRoutes', 'getFizzBuzzAnswer', `Internal Error:  ${error.message}`);
//         res.status(400).json({
//           message: error.message,
//         });
//       });
//   };
// };

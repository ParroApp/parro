'use strict';

/**
 * Ensure that all environment variables are configured.
 */

import _ from './env';

[
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'MONGODB_URI',
  'S3_BUCKET'
].forEach(varName => {
  if (!process.env.hasOwnProperty(varName)) {
    throw new Error('Missing environment variable: ' + varName);
  }
});

/**
 * Database setup.
 */

import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

/**
 * Module dependencies.
 */

import path from 'path';
import express from 'express';
import multer from 'multer';
import bodyParser from 'body-parser';

/**
 * Initialize express server.
 */

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * Initialize static files and routes.
 */

app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use('/build', express.static(path.join(__dirname, 'build')));

import routes from './backend/routes';
app.use('/', routes);

/**
 * Development error handler.
 * Will print stacktrace.
 */

if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500);
    res.send('Error: ' + err.message + '\n' + err);
  });
}

/**
 * Production error handler.
 * No stacktraces leaked to user.
 */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.send('Error: ' + err.message);
});

/**
 * Render home page and let React Router handle the remaining routes.
 */

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

/**
 * Listen on provided port, on all network interfaces.
 */

const PORT = process.env.PORT || 3000;
app.listen(PORT, error => {
  error
  ? console.error(error)
  : console.info(`Parro Server listening on port ${PORT}.`);
});

import requestHandler from './request-handler.js';
import bodyParser from 'body-parser';
import logger from './logger.js';
import express from 'express';
import cors from 'cors';

// Configure express
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Common send response
function sendResponse(res, request, response) {
  const code = res.status ? 200 : 400;

  response.status(code);

  if (res.message !== undefined) {
    response.json(res.message);
  }
}

// API REST
// List:
app.post('/list', async (request, response) => {
  sendResponse(await requestHandler.createList(request.body), request, response);
});

app.delete('/list', async (request, response) => {
  sendResponse(await requestHandler.deleteList(request.body), request, response);
});

app.get('/list', async (request, response) => {
  sendResponse(await requestHandler.getList(request.query), request, response);
});

app.get('/lists', async (request, response) => {
  sendResponse(await requestHandler.getLists(), request, response);
});

// Token:
app.post('/token', async (request, response) => {
  sendResponse(await requestHandler.addToken(request.body), request, response);
});

app.delete('/token', async (request, response) => {
  sendResponse(await requestHandler.deleteToken(request.body), request, response);
});

app.get('/token', async (request, response) => {
  sendResponse(await requestHandler.getToken(request.query), request, response);
});

// Bid:
app.post('/bid', async (request, response) => {
  sendResponse(await requestHandler.makeBid(request.body), request, response);
});

app.delete('/bid', async (request, response) => {
  sendResponse(await requestHandler.deleteBid(request.body), request, response);
});

// Approve
app.post('/approve', async (request, response) => {
  sendResponse(await requestHandler.approveBid(request.body), request, response);
});

app.get('/bid', async (request, response) => {
  sendResponse(await requestHandler.getBid(request.query), request, response);
});

// Express listen
app.listen(process.env.PORT || 5000, () => {
  logger.info('App aviable on http://localhost:5000');
});

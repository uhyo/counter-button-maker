import express from './express';
import * as config from 'config';

const app = express();

app.get('*', (req, res, next) => {
  res.end('hi');
});

app.listen(config.get<number>('server.port'));

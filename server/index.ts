import express from './express';
import * as nunjucks from 'nunjucks';
import * as config from 'config';
import { render } from '../src/server-init';

// Result of building client-side bundle.
// This require is handled by webpack.
const manifest = require('manifest.json');

const app = express();
app.set('view engine', 'njk');

nunjucks.configure('server/views', {
  express: app,
});

// Serve build result files.
app.use('/assets', express.static('dist'));
// Also static files.
app.use('/static', express.static('static'));

app.get('*', (req, res, next) => {
  // render page.
  render(req.path)
    .then(({ title, content, styleTags, page, count }) => {
      res.render('app', {
        title,
        content,
        styleTags,
        css: manifest['app.css'],
        bundle: manifest['app.js'],
        data: { page, count },
      });
    })
    .catch(next);
});

app.listen(config.get<number>('server.port'));

import * as fs from 'fs';
import express from './express';
import * as nunjucks from 'nunjucks';
import * as config from 'config';
import { render } from '../src/server-init';

// Result of building client-side bundle.
let manifest = JSON.parse(fs.readFileSync('./dist/manifest.json', 'utf8'));

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
  if (process.env.NODE_ENV !== 'production') {
    // Reload manifest.json every time.
    manifest = JSON.parse(fs.readFileSync('./dist/manifest.json', 'utf8'));
  }
  // render page.
  render(req.path)
    .then(({ historyInfo, content, styleTags, page, count }) => {
      res.render('app', {
        title: historyInfo.title,
        content,
        styleTags,
        css: manifest['app.css'],
        bundle: manifest['app.js'],
        data: { page, count },
        firebaseConfig: config.get<any>('firebase'),
        meta: [
          // opengraph stuff
          {
            property: 'og:title',
            content: historyInfo.title,
          },
          {
            property: 'og:description',
            content: historyInfo.social.description,
          },
          {
            property: 'og:type',
            content: 'website',
          },
          {
            property: 'og:url',
            content: config.get('server.origin') + historyInfo.path,
          },
          {
            property: 'og:image',
            content:
              historyInfo.social.image[0] === '/'
                ? config.get('server.origin') + historyInfo.social.image
                : historyInfo.social.image,
          },
          {
            name: 'twitter:card',
            content: historyInfo.social.image ? 'summary_large_image' : '',
          },
          {
            name: 'twitter:creator',
            content: historyInfo.social.twitterCreator || '',
          },
        ],
      });
    })
    .catch(next);
});

app.listen(config.get<number>('server.port'));

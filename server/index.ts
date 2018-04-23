import * as fs from 'fs';
import express from './express';
import * as nunjucks from 'nunjucks';
import * as config from 'config';
import { render } from '../src/server-init';
import { firebaseApp } from './firebase';
import { fetchCounterPageContent } from '../src/logic/counter';

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

// api provided to users.
app.get('/api/get-page', (req, res, next) => {
  // fetch counter page data for client.
  // usage: /api/get-page?id=...
  fetchCounterPageContent(firebaseApp, req.query.id)
    .then(data => {
      if (data == null) {
        res.status(404).json({
          error: 'Not Found',
        });
      } else {
        res.setHeader(
          'Cache-Control',
          `public, max-age=${config.get('server.cacheMaxAge')}`,
        );
        res.json(data);
      }
    })
    .catch(next);
});
app.get('*', (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    // Reload manifest.json every time.
    manifest = JSON.parse(fs.readFileSync('./dist/manifest.json', 'utf8'));
  }
  // render page.
  render(req.path)
    .then(({ historyInfo, content, styleTags, page, count, path }) => {
      let error: boolean = false;
      if (page != null && page.page !== 'error') {
        res.setHeader(
          'Cache-Control',
          `public, max-age=${config.get('server.cacheMaxAge')}`,
        );
        error = true;
      }
      if (page == null) {
        error = true;
        res.status(500);
      } else if (page.page === 'error') {
        res.status(page.code);
      }

      res.render('app', {
        title: historyInfo.title,
        content,
        styleTags,
        css: manifest['app.css'],
        bundle: manifest['app.js'],
        data: { path, page, count },
        firebaseConfig: config.get<any>('firebase'),
        meta: error
          ? []
          : [
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

import express from 'express';
import path from 'path';

const app = new express();

app.set('port', 7777);

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));

app.listen(app.get('port'), function() {
  console.log(`TEST JS START on port: ${app.get('port')}`);
});

app.get('/', function(req, res) {
  res.send(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title></title>
          <link type="text/css" rel="stylesheet" href="/css/main.css?${Math.random()}" />
        </head>
        <body>
          <header class="Header">Test js code</header>
          <section class="Content" id="app">

          </section>
          <footer class="Footer">
            (С) Zharsky Dmitriy
          </footer>
          <script type="text/javascript" src="/public/bundle.js?${Math.random()}"></script>
        </body>
      </html>
    `)
})

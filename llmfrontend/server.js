// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const fs = require('fs');
const https = require('https');
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || "443";
// const logger = require('pino-http')()

app.prepare().then(() => {
    /*
    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert'),
    }, app).listen(port, () => {
        debug(chalk.green(`listen on ${port}`));
    });*/
    https.createServer({
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert'),

    }, function (req, res) {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.

        const parsedUrl = parse(req.url, true)


        const { pathname, query } = parsedUrl

        //
        // if (pathname === '/a') {
        //     app.render(req, res, '/a', query)
        // } else if (pathname === '/b') {
        //     app.render(req, res, '/b', query)
        // } else {
             handle(req, res).then(()=>{
                 // logger(req, res)
                 // req.log.info('something else')
                 // res.end('hello world')
                 // res.setHeader('access-control-allow-origin', '*');
                 // res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
                 // NextCors(req, res, {
                 //     // Options
                 //     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
                 //     origin: '*',
                 //     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
                 // });
             })

        // }


    }).listen(port);

})




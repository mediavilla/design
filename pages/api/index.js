const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    createServer((req, res) => {
        const parsedUrl = parse(req.url, true)
        const { pathname, query } = parsedUrl

        if (pathname === '/') {
            app.render(req, res, '/index', query)
        } else {
            handle(req, res, parsedUrl)
        }
    }).listen(process.env.PORT || 3000, (err) => {
        if (err) throw err
        console.log('> Ready on http://localhost:3000')
    })
})

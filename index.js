const micro = require('micro')
const { send, createError } = micro
const { Server } = require('http')
const { connect } = require('net');
const ScopedFS = require('scoped-fs')
const fs = new ScopedFS(__dirname)
const { resolve } = require('path')
const ws = require('ws')

const server = new Server((req, res) => micro.run(req, res, async (req, res) => {
    if (req.url == '/') {
        res.setHeader('content-type', 'text/html; charset=utf-8')
        return `<script type="module" src="/client.js"></script>`
    } else if (req.url == '/client.js') {
        res.setHeader('content-type', 'text/javascript')
        return send(res, 200, fs.createReadStream('client.js'), 'utf-8')
    } else if (req.url == '/favicon.ico') {
        return ``
    } else {
        throw createError(404, 'Not found')
    }
}))

const wss = new ws.Server({ server });
wss.on('connection', conn => {
    const sock = connect(143, 'asty.nbtsc.org')
    sock.on('data', data => conn.send(data))
    conn.on('message', message => sock.write(message))
});

server.listen(4000)

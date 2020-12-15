const app = require('express')();
const http = require('http').createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});
app.get('/', (req, res) => {
    res.send("hello from server");
});

io.on("connection", socket => {
    console.log("connected")
    const id = socket.handshake.query.id
    socket.join(id)

    socket.on("send-message", ({recipients, text}) => {
        console.log("sent")
        recipients.forEach(recipient => {
            const newRecipients = recipients.filter(r => r!==recipient)
            newRecipients.push(id)
            socket.broadcast.to(recipient).emit("receive-message",
                {recipients: newRecipients, sender: id, text})
        })
    })
})

const PORT = process.env.PORT || 3008;

http.listen(PORT, () => {
    console.log('listening on *:3008');
});

const io = require("socket.io")(5000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
})

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
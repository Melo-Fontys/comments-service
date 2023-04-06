const express = require("express")
const {randomBytes} = require('crypto')
const bodyParser = require("body-parser")
const {post} = require("axios");
const app = express();
const cors = require("cors");
const axios = require("axios");

app.use(cors())
app.use(bodyParser.json())

const commentsByPostId = {};

app.get('/recommendations/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || [])
})

app.post('/recommendations/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const {content} = req.body;

    const comments = commentsByPostId[req.params.id] || [];
    comments.push({id: commentId, content})

    commentsByPostId[req.params.id] = comments

    await axios.post("http://localhost:8005/events", {
        type: "CommentCreated",
        data: {
            id: commentId, content,
            postId: req.params.id
        }
    })

    res.status(201).send(comments)
})

app.post('/events', (req, res) =>{
    console.log("Event received", req.body.type);

    res.send({})
});

app.listen(8001, () => {
    console.log("Listening on 8001")
})
import { rmSync } from "fs";
import { join } from "path";
import { createServer } from "http";
import express from "express";
import Datastore from "nedb";

const PORT = 3000;
const app = express();

app.use(express.json());

let messages = new Datastore({
  filename: join("db", "messages.db"),
  autoload: true,
  timestampData: true,
});

app.use(function (req, res, next) {
  console.log("HTTP request", req.method, req.url, req.body);
  next();
});

app.get("/api/messages/", function (req, res, next) {
  messages
    .find({})
    .sort({ createdAt: -1 })
    .exec(function (err, messages) {
      if (err) return res.status(500).end(err);
      return res.json(messages.reverse());
    });
});

app.post("/api/messages/", function (req, res, next) {
  messages.insert({ author: req.body.author, 
                    content: req.body.content,
                    upvote: 0,
                    downvote: 0,
                  }, function (err, message) {
    if (err) return res.status(500).end(err);
    return res.json(message);
  });
});

app.delete("/api/messages/:id/", function (req, res, next) {
  messages.findOne({ _id: req.params.id }, function (err, message) {
    if (err) return res.status(500).end(err);
    if (!message)
      return res
        .status(404)
        .end("Message id #" + req.params.id + " does not exists");
    messages.remove({ _id: message._id }, { multi: false }, function (err, num) {
      res.json(message);
    });
  });
});

app.patch("/api/messages/:id/upvote", function (req, res, next) {
  messages.findOne({ _id: req.params.id }, function (err, message) {
    if (err) return res.status(500).end(err);
    if (!message)
      return res
        .status(404)
        .end("Message id #" + req.params.id + " does not exist");
    
    message.upvote++;
    
    messages.update({ _id: message._id }, message, {}, function (err, num) {
      if (err) return res.status(500).end(err);
      return res.json(message);
    });
  });
});

app.patch("/api/messages/:id/downvote", function (req, res, next) {
  messages.findOne({ _id: req.params.id }, function (err, message) {
    if (err) return res.status(500).end(err);
    if (!message)
      return res
        .status(404)
        .end("Message id #" + req.params.id + " does not exist");
    
    message.downvote++;
    
    messages.update({ _id: message._id }, message, {}, function (err, num) {
      if (err) return res.status(500).end(err);
      return res.json(message);
    });
  });
});

// This is for testing purpose only
export function createTestDb(db) {
  messages = new Datastore({
    filename: join("testdb", "messages.db"),
    autoload: true,
    timestampData: true,
  });
}

// This is for testing purpose only
export function deleteTestDb(db) {
  rmSync("testdb", { recursive: true, force: true });
}

// This is for testing purpose only
export function getMessages(callback) {
  return messages
    .find({})
    .sort({ createdAt: -1 })
    .exec(function (err, messages) {
      if (err) return callback(err, null);
      return callback(err, messages.reverse());
    });
}

app.use(express.static("static"));

export const server = createServer(app).listen(PORT, function (err) {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});

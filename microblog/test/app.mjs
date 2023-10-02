import chai from "chai";
import chaiHttp from "chai-http";
import { server, createTestDb, deleteTestDb, getMessages } from "../app.mjs";

const expect = chai.expect;
chai.use(chaiHttp);

describe("Testing API", () => {
  const testData = [
    {
      author: "John Doe",
      content: "Test message 1",
    },
    {
      author: "Foo bar",
      content: "Test message 2",
    },
  ];

  before(function () {
    createTestDb();
  });

  after(function () {
    deleteTestDb();
    server.close();
  });

  // Test case for adding a message with a POST request
  it("it should add a message", function (done) {
    chai
      .request(server)
      .post("/api/messages")
      .set("content-type", "application/json")
      .send(testData[0])
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("author", testData[0].author);
        expect(res.body).to.have.property("content", testData[0].content);

        done();
      });
  });

  // Test case for retrieving all messages with a GET request
  it("it should retrieve all messages", function (done) {
    chai
      .request(server)
      .get("/api/messages")
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("array");
        expect(res.body).to.have.length(1);
        expect(res.body[0]).to.have.property("author", testData[0].author);
        expect(res.body[0]).to.have.property("content", testData[0].content);

        done();
      });
  });

  // Test case for upvoting a message with a PATCH request
  it("it should upvote a message", function (done) {
    getMessages(function (err, messages) {
      if (err) return done(err);
      const messageId = messages[0]._id;
      chai
        .request(server)
        .patch(`/api/messages/${messageId}/upvote`)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("upvote", 1);

          done();
        });
    });
  });

  // Test case for downvoting a message with a PATCH request
  it("it should downvote a message", function (done) {
    getMessages(function (err, messages) {
      if (err) return done(err);
      const messageId = messages[0]._id;
      chai
        .request(server)
        .patch(`/api/messages/${messageId}/downvote`)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("downvote", 1);

          done();
        });
    });
  });

  // Test case for deleting a message with a DELETE request
  it("it should delete a message", function (done) {
    getMessages(function (err, messages) {
      if (err) return done(err);
      const messageId = messages[0]._id;
      chai
        .request(server)
        .delete(`/api/messages/${messageId}`)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("author", testData[0].author);
          expect(res.body).to.have.property("content", testData[0].content);

          done();
        });
    });
  });

});

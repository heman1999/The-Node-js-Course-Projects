const app = require("../src/app");
const request = require("supertest");
const User = require("../src/model/user");
const Task = require("../src/model/task");
const { userTwo, setUpDB, userOne, task3 } = require("../tests/fixtures/db");

beforeEach(setUpDB);

test("Should create new task", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ description: "new task" })
    .expect(201);
  const task = Task.findById(response.body._id);
  expect(task).not.toBeNull();
});

test("Should show tasks created by user", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});

test("Should not delete other user created tasks", async () => {
  const response = await request(app)
    .delete(`/tasks/${task3._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(404);
});

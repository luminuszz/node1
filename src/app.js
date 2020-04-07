const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

const findId = (req, res, next) => {
  const id = req.params.id
  const repositoryIndex = repositories.findIndex((repositories) => {
    return repositories.id === id
  })
  if (repositoryIndex < 0) {
    return res.status(400).json("Repository not found")
  }
  req.positionId = repositoryIndex
  console.log(req.positionId)
  next();
}

app.use(express.json());
app.use(cors());


const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const newRepository = { title, url, techs, likes: 0, id: uuid() }
  repositories.push(newRepository)
  return response.json(newRepository)

});

app.put("/repositories/:id", findId, (request, response) => {
  const { id } = request.params
  const indexRepository = request.positionId
  const { title, techs, url, likes } = request.body

  const uptade = {
    title, url, techs, likes: 0, id
  }
  repositories[indexRepository] = uptade
  return response.json({ title, url, techs, likes: 0, id })

});

app.delete("/repositories/:id", findId, (request, response) => {
  console.log("teste")
  const indexRepository = request.positionId
  repositories.splice(indexRepository, 1);
  return response.status(204).send()
});

app.post("/repositories/:id/like", findId, (request, response) => {
  const indexRepository = request.positionId
  const { id } = request.params
  const { title, url, techs, likes } = repositories.find(repository => repository.id === id)

  const uptadeLike = {
    title,
    url,
    techs,
    likes: (likes + 1),
    id

  }
  repositories[indexRepository] = uptadeLike
  return response.json({ likes: uptadeLike.likes })
});

module.exports = app;

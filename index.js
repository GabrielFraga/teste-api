const express = require("express");

const server = express();

server.use(express.json());

let numberOfRequests = 0;

function logRequests(req, res, next) {
  ++numberOfRequests;
  console.log(`Número de requisições: ${numberOfRequests}`);
  return next();
}

server.use(logRequests);

function checkProjectExists(req, res, next) {
  const project = projects.find(p => p.id == req.params.id);

  if (!project.id) {
    return res.status(400).json({ error: "Project does not exist!" });
  }

  req.id = project.id;
  return next();
}

let projects = [
  {
    id: 1,
    title: "Projeto API",
    tasks: ["atividade 3", "atividade 4", "atividade 5"]
  }
];

server.get("/projects", (req, res) => {
  return res.json(projects);
});

// { id: "1", title: 'Novo projeto', tasks: [] }
server.post("/projects", (req, res) => {
  const payload = req.body;
  projects.push(payload);
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { tasks } = req.body;

  const project = projects.find(p => p.id == req.params.id);

  project.tasks = tasks;
  project.title = title;

  return res.json(projects);
});

//  receber um campo title e armazenar uma nova tarefa no array
//  de tarefas de um projeto específico escolhido através do id presente nos parâmetros da rota;
server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { title } = req.body;

  const project = projects.find(p => p.id == req.params.id);

  project.tasks.push(title);

  return res.json(projects);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  projects = projects.filter(element => element.id != req.id);
  return res.json(projects);
});

server.listen(3001);

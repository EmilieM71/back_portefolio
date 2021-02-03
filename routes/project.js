const express = require("express");
const pool = require("../pool");
const router = express.Router();

// Create a project
router.post("/projects", (res, req) => {
  const { name, description, git, link } = req.body;
  const sql =
    "INSERT INTO project (name, description, git, link) VALUES (?, ?, ?, ?)";
  pool.query(sql, [name, description, git, link], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("error saving a project");
    } else {
      res.status(200).json("Successfully saved");
    }
  });
});

// Read all projects
router.get("/projects", (res) => {
  let sql = "SELECT * FROM project";
  pool.query(sql, (err, results) => {
    if (err) {
      res.status(500).send("error");
    } else {
      res.status(200).json(results);
    }
  });
});

// Read one project
router.get("/projects/:id", (res, req) => {
  pool.query(
    "SELECT * FROM project WHERE id=?",
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).send("error");
      }
      if (results.length === 0) {
        res.status(404).send("no result");
      } else {
        res.status(200).json(results[0]);
      }
    }
  );
});

// Update a projet
router.put("/projects/:id", (res, req) => {
  const idProject = req.params.id;
  const newProject = req.body;
  pool.query(
    "UPDATE project SET ? WHERE id=?",
    [newProject, idProject],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("error updating a project");
      } else {
        res.status(200).json("Project updated successfully");
      }
    }
  );
});

// Delete a project
router.delete("/projects/:id", (res, req) => {
  const idProject = req.params.id;
  pool.query("DELETE FROM project WHERE id=?", [idProject], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("error when deleting a project");
    } else {
      res.sendStatus(200);
    }
  });
});

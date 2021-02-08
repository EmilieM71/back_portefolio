const express = require("express");
const pool = require("../pool");

const router = express.Router();

// read all slills
router.get("/", async (req, res) => {
  console.log("read all");
  const sql = "SELECT * FROM skills";
  // console.log(res);
  try {
    const [skills] = pool.query(sql);
    return res.status(200).json(skills);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// read one skill
router.get("/:id", async (req, res) => {
  console.log("read one");
  const sql = "SELECT * FROM skills WHERE id=?";
  const [skills] = await pool.query(sql, [req.params.id], (err, results) => {
    if (err) {
      res.status(500).send("error");
    }
    if (results.length === 0) {
      res.status(404).send("No result");
    } else {
      res.status(200).json(results[0]);
    }
  });
  return res.send(skills);
});

// Create a skill
router.post("/", async (req, res) => {
  const { name, slug, user_id, category_id } = req.body;
  console.log("name : ", name, "slug : ", slug);
  const sql =
    "INSERT INTO skills (name, slug, user_id, category_id) VALUES (?, ?, ? ,?)";
  try {
    const [skill] = await pool.query(sql, [name, slug, user_id, category_id]);
    if (!skill) return res.sendStatus(401);
    return res.status(200).send("successFully saved");
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// Update a skill
router.put("/:id", async (req, res) => {
  const idSkill = req.params.id;
  const newSkill = req.body;
  console.log("idSkill : ", idSkill, "newSkill : ", newSkill);
  const sql = "UPDATE skills SET ? WHERE id=?";
  try {
    await pool.query(sql, [newSkill, idSkill]);
    return res.status(200).send("Skill updated successfully");
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// Delete a Skill
router.delete("/:id", async (req, res) => {
  const idSkill = req.params.id;
  console.log("idSkill : ", idSkill);
  const sql = "DELETE FROM skills WHERE id=?";
  try {
    await pool.query(sql, [idSkill]);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;

const express = require("express");
const pool = require("../pool");

const router = express.Router();

// read all categories
router.get("/", async (req, res) => {
  console.log("read all");
  const sql = "SELECT * FROM categories";
  // console.log(res);
  try {
    const [category] = pool.query(sql);
    return res.status(200).json(category);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
  // const [[category]] = await pool.query(sql, (err, results) => {
  //   if (err) {
  //     res.status(500).json({
  //       error: err.message,
  //     });
  //   } else {
  //     console.log(results);
  //     res.status(200).json(results);
  //   }
  // });
  // return res.send(category);
});

// read one category
router.get("/:id", async (req, res) => {
  console.log("read one");
  const sql = "SELECT * FROM categories WHERE id=?";
  const [[category]] = await pool.query(
    sql,
    [req.params.id],
    (err, results) => {
      if (err) {
        res.status(500).send("error");
      }
      if (results.length === 0) {
        res.status(404).send("No result");
      } else {
        res.status(200).json(results[0]);
      }
    }
  );
  return res.send(category);
});

// Create a category
router.post("/", async (req, res) => {
  const { name, slug } = req.body;
  console.log("name : ", name, "slug : ", slug);
  const sql = "INSERT INTO categories (name, slug) VALUES (?, ?)";
  try {
    const [[category]] = await pool.query(sql, [name, slug]);
    if (!category) return res.sendStatus(401);
    return res.status(200).send("successFully saved");
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// Update a category
router.put("/:id", async (req, res) => {
  const idCategory = req.params.id;
  const newCategory = req.body;
  console.log("idCategory : ", idCategory, "newCategory : ", newCategory);
  const sql = "UPDATE categories SET ? WHERE id=?";
  try {
    await pool.query(sql, [newCategory, idCategory]);
    return res.status(200).send("Category updated successfully");
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

// Delete a category
router.delete("/:id", async (req, res) => {
  const idCategory = req.params.id;
  console.log("idCategory : ", idCategory);
  const sql = "DELETE FROM categories WHERE id=?";
  try {
    await pool.query(sql, [idCategory]);
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;

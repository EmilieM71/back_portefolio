const express = require("express");
const admin = require("./admin");
const categories = require("./categories");
const skills = require("./skill");
// const project = require("./project");

const router = express.Router();

router.use("/admin", admin);
router.use("/categories", categories);
router.use("/skills", skills);
// router.use("/project", project);

module.exports = router;

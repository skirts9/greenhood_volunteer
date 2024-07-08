const express = require('express');
const router = express.Router();
const { User, Volunteer } = require('../models'); // Ensure correct import
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
  let data = req.body;
  data.userId = req.user.id;
  // Validate request body
  let validationSchema = yup.object({
    title: yup.string().trim().min(3).max(100).required(),
    location: yup.string().trim().min(3).max(100).required(),
    date: yup.date().required(),
    time: yup.string().trim().required(), // Use yup.string() for time validation
    briefDescription: yup.string().trim().max(500), // Corrected spelling
    detailedDescription: yup.string().trim().max(1000)
  });

  try {
    data = await validationSchema.validate(data, { abortEarly: false });
    let result = await Volunteer.create(data);
    res.json(result);
  }
  catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.get("/", async (req, res) => {
  let condition = {};
  let search = req.query.search;
  if (search) {
    condition[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }
  // You can add condition for other columns here
  // e.g. condition.columnName = value;

  let list = await Volunteer.findAll({
    where: condition,
    order: [['createdAt', 'DESC']],
    include: { model: User, as: "user", attributes: ['name'] }
  });
  res.json(list);
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let volunteer = await Volunteer.findByPk(id, {
    include: { model: User, as: "user", attributes: ['name'] }
  });
  // Check if id not found
  if (!volunteer) {
    res.sendStatus(404);
    return;
  }
  res.json(volunteer);
});

router.put("/:id", validateToken, async (req, res) => {
  let id = req.params.id;
  // Check if id not found
  let volunteer = await Volunteer.findByPk(id);
  if (!volunteer) {
    res.sendStatus(404);
    return;
  }

  // Check request user id
  let userId = req.user.id;
  if (volunteer.userId != userId) {
    res.sendStatus(403);
    return;
  }

  let data = req.body;
  // Validate request body
  let validationSchema = yup.object({
    dateAvailable: yup.date().required('Date Available is required'),
    serviceType: yup.string().required('Service Type is required'),
    comments: yup.string().max(500, 'Comments must be at most 500 characters'),
    timeAvailable: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid Time format').required('Time Available is required'),
    duration: yup.number().integer().min(0, 'Duration must be at least 0').nullable(),
    contactInfo: yup.string().max(100, 'Contact Info must be at most 100 characters').nullable(),
  });

  try {
    data = await validationSchema.validate(data, { abortEarly: false });

    // Log time data after validation


    let num = await Volunteer.update(data, {
      where: { id: id }
    });
    if (num == 1) {
      res.json({
        message: "Volunteer was updated successfully."
      });
    }
    else {
      res.status(400).json({
        message: `Cannot update volunteer with id ${id}.`
      });
    }
  }
  catch (err) {
    res.status(400).json({ errors: err.errors });
  }
});

router.delete("/:id", validateToken, async (req, res) => {
  let id = req.params.id;
  // Check if id not found
  let volunteer = await Volunteer.findByPk(id);
  if (!volunteer) {
    res.sendStatus(404);
    return;
  }

  // Check request user id
  let userId = req.user.id;
  if (volunteer.userId != userId) {
    res.sendStatus(403);
    return;
  }

  let num = await Volunteer.destroy({
    where: { id: id }
  });
  if (num == 1) {
    res.json({
      message: "Volunteer was deleted successfully."
    });
  }
  else {
    res.status(400).json({
      message: `Cannot delete volunteer with id ${id}.`
    });
  }
});

module.exports = router;
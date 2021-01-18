const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const {
  Admin,
  Phase
} = require('../models');

const {
  refreshSystemState
} = require('../util/operations');

/* POST a new phase */
router.post('/', asyncHandler(async (req, res, next) => {
  if (req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let admin = await Admin.findById(req.userId).lean();
  if (admin.isRootUser){
    let newPhase = await Phase.create(req.body);
    res.json(newPhase);
    refreshSystemState();
  } else {
    return res.sendStatus(403);
  }
}));

/* PUT an updated phase */
router.put('/:id', asyncHandler(async (req, res, next) => {
  if (req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let admin = await Admin.findById(req.userId).lean();
  if (admin.isRootUser){
    let update = {
      ...req.body
    };
    delete update._id;
    let updatedPhase = await Phase.updateOne({_id: req.params.id }, update);
    res.json(updatedPhase);
    refreshSystemState();
  } else {
    return res.sendStatus(403);
  }
}));

/* DELETE a phase */
router.delete('/:id', asyncHandler(async (req, res, next) => {
  if (req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let admin = await Admin.findById(req.userId).lean();
  if (admin.isRootUser){
    await Phase.deleteOne({_id: req.params.id });
    res.json({});
    refreshSystemState();
  } else {
    return res.sendStatus(403);
  }
}));

module.exports = router;

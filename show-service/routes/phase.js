const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const {
  Admin,
  Phase,
  Show
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
    let newPhase = { ...req.body };
    newPhase.isDefault = false;
    newPhase.index = await Phase.countDocuments({});
    await Phase.create(newPhase);
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

/* PUT switch index with another phase */
router.put('/:id1/swap/:id2', asyncHandler(async (req, res, next) => {
  if (req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let admin = await Admin.findById(req.userId).lean();
  if (!admin.isRootUser) {
    return res.sendStatus(403);
  }

  let [
    phase1,
    phase2
  ] = await Promise.all([
    Phase.findById(req.params.id1),
    Phase.findById(req.params.id2)
  ]);
  if(!phase1 || !phase2 || req.params.id1 === req.params.id2 ) {
    return res.sendStatus(400);
  }
  await Promise.all([
    Phase.findByIdAndUpdate(req.params.id1, { $set: { index: phase2.index }}),
    Phase.findByIdAndUpdate(req.params.id2, { $set: { index: phase1.index }}),
  ]);
  res.sendStatus(200);
  refreshSystemState();
}));

/* PUT set a phase as the default */
router.put('/:id/default', asyncHandler(async (req, res, next) => {
  if (req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let admin = await Admin.findById(req.userId).lean();
  if (!admin.isRootUser) {
    return res.sendStatus(403);
  }

  let phase = await Phase.findById(req.params.id);
  if(!phase) {
    return res.sendStatus(400);
  }
  await Phase.updateMany({}, { isDefault: false });
  await Promise.all([
    Phase.findByIdAndUpdate(req.params.id, { isDefault: true }),
    Show.updateMany({isRunning: false }, { $set: { currentPhase: req.params.id }}),
  ]);
  res.sendStatus(200);
  refreshSystemState();
}));

/* DELETE a phase */
router.delete('/:id', asyncHandler(async (req, res, next) => {
  if (req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let admin = await Admin.findById(req.userId).lean();
  if (admin.isRootUser){
    const phaseToDelete = await Phase.findById(req.params.id);
    if(phaseToDelete.isDefault){
      return res.sendStatus(400);
    }
    await Phase.deleteOne({_id: req.params.id });
    res.json({});
    refreshSystemState();
  } else {
    return res.sendStatus(403);
  }
}));

module.exports = router;

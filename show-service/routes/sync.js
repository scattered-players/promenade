const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const {
  syncWithEventbrite
} = require('../util/eventbrite');
const {
  refreshSystemState,
  refreshCurrentShowState
} = require('../util/operations');

/* POST eventbrite update */
router.post('/eventbrite', asyncHandler(async (req, res, next) => {
  await syncWithEventbrite();

  refreshSystemState();
  refreshCurrentShowState();

  res.sendStatus(200);
}));

module.exports = router;

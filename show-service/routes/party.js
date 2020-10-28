const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');

const {
  Item,
  Party,
  Message,
  User,
  Actor,
  Scene
} = require('../models');

const {
  refreshSystemState,
  refreshCurrentShowState
} = require('../util/operations');

/* PUT give an item to a party  */
router.put('/:partyId/giveItem', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Actor' && req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let { partyId } = req.params;
  let { item } = req.body;
  let itemDoc = await Item.create(item);
  await Party.updateOne({ _id: partyId }, { $push: { inventory: itemDoc._id } });
  
  res.sendStatus(200);

  refreshCurrentShowState();
  refreshSystemState();
}));

/* PUT take an item from a party  */
router.put('/:partyId/takeItem/:itemId', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Actor' && req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let { partyId, itemId } = req.params;
  await Promise.all([
    Party.updateOne({ _id: partyId }, { $pull: { inventory: itemId } }),
    Item.deleteOne({_id: itemId})
  ]);
  
  res.sendStatus(200);

  refreshCurrentShowState();
  refreshSystemState();
}));

/* PUT set the party's guide  */
router.put('/:partyId/guide/:guideId', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Actor' && req.userKind !== 'Admin' && req.userKind !== 'Guide') {
    return res.sendStatus(403);
  }
  let { partyId, guideId } = req.params;
  guideId = (guideId === 'null') ? null: guideId;
  await Party.updateOne({ _id: partyId }, {guide: guideId });
  
  res.sendStatus(200);

  refreshCurrentShowState();
  refreshSystemState();
}));

/* PUT set the ending URL for a party  */
router.put('/:partyId/ending', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Actor' && req.userKind !== 'Admin' && req.userKind !== 'Guide') {
    return res.sendStatus(403);
  }
  let { partyId } = req.params;
  let { endingUrl } = req.body;
  await Party.updateOne({ _id: partyId }, {chosenEndingURL: endingUrl });
  
  res.sendStatus(200);

  refreshCurrentShowState();
  refreshSystemState();
}));

/* PUT send a message to a party  */
router.put('/:partyId/sendMessage', asyncHandler(async (req, res, next) => {
  let { partyId } = req.params;
  let { content } = req.body;
  let username;
  if(req.userKind === 'Actor') {
    let actor = await Actor.findById(req.userId).populate('place').lean();
    username = actor.place.characterName;
  } else {
    let user = await User.findById(req.userId);
    username = user.kind === 'Guide' ? user.characterName : user.username;
  }
  let messageDoc = await Message.create({
    schemaVersion: 1,
    username,
    content,
    userKind: req.userKind,
    timestamp: Date.now()
  });
  await Party.updateOne({ _id: partyId }, { $push: { chat: messageDoc._id } });
  
  res.sendStatus(200);

  refreshCurrentShowState();
  refreshSystemState();
}));

/* PUT send a message to a party  */
router.put('/:partyId/notes', asyncHandler(async (req, res, next) => {
  let { partyId } = req.params;
  let { notes } = req.body;
  await Party.updateOne({ _id: partyId }, { $set: { notes } });
  
  res.sendStatus(200);

  refreshCurrentShowState();
  refreshSystemState();
}));


/* DELETE remove a history entry  */
router.delete('/:partyId/history/:index', asyncHandler(async (req, res, next) => {
  let { partyId, index } = req.params;
  await Party.updateOne({ _id: partyId }, { $unset: { [`history.${index}`]: 1} });
  await Party.updateOne({ _id: partyId }, { $pull: { history: null } });
  
  res.sendStatus(200);

  refreshCurrentShowState();
  refreshSystemState();
}));

/* DELETE remove a scene entry  */
router.delete('/scene/:sceneId', asyncHandler(async (req, res, next) => {
  let { sceneId } = req.params;
  await Scene.deleteOne({ _id: sceneId });
  
  res.sendStatus(200);

  // refreshCurrentShowState();
  refreshSystemState();
}));

module.exports = router;
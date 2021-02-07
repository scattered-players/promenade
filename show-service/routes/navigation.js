const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const {
  Show,
  Party,
  Place,
  Scene
} = require('../models');
const {
  queueParty,
  kickParty,
  refreshSystemState,
  refreshCurrentShowState
} = require('../util/operations');

/* POST select a place */
router.post('/select', asyncHandler(async (req, res, next) => {
  let { partyId, placeId } = req.body;
  let show = await Show.getCurrentShowState();
  if(req.userKind === 'Attendee') {
    let { userId } = req;
    let matchingParties = show.parties.filter(party => party.attendees.reduce((acc, attendee) => acc || attendee._id === userId, false));
    let myParty = matchingParties.length ? matchingParties[0] : null;
    if(!myParty || myParty._id !== partyId){
      console.log('HMM', userId, partyId, myParty._id, typeof myParty._id, myParty._id !== partyId)
      return res.sendStatus(403);
    }
  }
  await Party.updateOne({ _id:partyId }, { $set: { selectedPlace: placeId } });

  res.sendStatus(200);

  refreshCurrentShowState();
  refreshSystemState();
}));

/* POST queue for a place */
router.post('/queue', asyncHandler(async (req, res, next) => {
  let { partyId, placeId } = req.body;
  let show = await Show.getCurrentShowState();
  if(req.userKind === 'Attendee') {
    let { userId } = req;
    let matchingParties = show.parties.filter(party => party.attendees.reduce((acc, attendee) => acc || attendee._id === userId, false));
    let myParty = matchingParties.length ? matchingParties[0] : null;
    if(!myParty || myParty._id.toString() !== partyId){
      return res.sendStatus(403);
    }
  }

  let matchingParties = show.parties.filter(party => party._id === partyId);
  let queueingParty = matchingParties.length ? matchingParties[0] : null;
  let place = await Place.findById(placeId).lean();
  if(!place.currentParty && !place.partyQueue.length){
    await queueParty(queueingParty, place);
  }

  res.sendStatus(200);

  refreshCurrentShowState();
  refreshSystemState();
}));

/* POST accept a party */
router.post('/accept', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Actor' && req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let { partyId, placeId } = req.body;
  let promises = [];
  promises.push(Party.updateOne({ _id: partyId }, { $set: { currentPlace: placeId, nextPlace: null, selectedPlace: null }, $push: { history: placeId } }));
  promises.push(Place.updateOne({ _id: placeId }, { $set:{ currentParty: partyId, isAvailable: false }, $pull: { partyQueue: partyId } }));
  promises.push(Actor.updateMany({ places: { $elemMatch: { $eq: placeId } } }, { isAvailable: false }))
  promises.push(Scene.create({ place: placeId, party: partyId, startTime: new Date() }));
  await Promise.all(promises);
  
  res.sendStatus(200);

  refreshCurrentShowState();
  refreshSystemState();
}));

/* POST kick a party */
router.post('/kick', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Actor' && req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let { partyId, placeId } = req.body;
  let [ party, place ] = await Promise.all([
    Party.findById(partyId).lean(),
    Place.findById(placeId).lean()
  ])
  await kickParty(party, place);
  
  res.sendStatus(200);

  refreshCurrentShowState();
  refreshSystemState();
}));

module.exports = router;

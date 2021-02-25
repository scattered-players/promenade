const express = require('express');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const {
  User,
  Admin,
  Actor,
  Attendee,
  Attendance,
  Bot,
  Guide,
  Place,
  Party
} = require('../models');
const {
  createToken,
  createExpiringToken,
  decodeToken,
  validateToken
} = require('../util/auth');
const {
  kickParty,
  blockUser,
  disconnectUser,
  broadcastLogin,
  broadcastError,
  broadcastSlowlink,
  refreshSystemState,
  refreshCurrentShowState,
  updateUsersBookedShows,
  forceRefreshUser
} = require('../util/operations');
const {
  sendLoginEmail
} = require('../util/sendgrid');

const env = process.env.NODE_ENV || 'development';

/* POST login */
router.post('/login', asyncHandler(async (req, res, next) => {
  let token, payload;
  try {
    try {
      token = req.body && req.body.token || req.cookies['promenade-auth-token'];
      payload = validateToken(token);
    } catch(e) {
      if (req.body && req.body.token) {
        try {
          token = req.cookies['promenade-auth-token'];
          payload = validateToken(token);
        } catch(e) {
          broadcastError({
            type: token ? 'FAILED_TOKEN_CHECK' : 'NO_TOKEN_FOR_LOGIN',
            token,
            message: e.message,
            payload: token && decodeToken(token)
          });
          throw e;
        }
      } else {
        broadcastError({
          type: token ? 'FAILED_TOKEN_CHECK' : 'NO_TOKEN_FOR_LOGIN',
          token,
          message: e.message,
          payload: token && decodeToken(token)
        });
        throw e;
      }
    }

    let user = await User.findById(payload.userId).lean();
    if (user.isBlocked) {
      broadcastLogin({
        type:'BLOCKED_USER',
        user
      });
      return res.sendStatus(403);
    }
    if (payload.exp) {
      token = createToken(user);
      broadcastLogin({
        type: 'SUCCESSFUL_EXPIRING_TOKEN',
        user
      });
    } else {
      broadcastLogin({
        type: 'SUCCESSFUL_PERSISTENT_TOKEN',
        user
      });
    }
    let cookieOptions = {
      maxAge: 30 * 24 * 60 * 60 * 1000
    };
    if(process.env.ENV === 'production') {
      cookieOptions.sameSite = 'None';
      cookieOptions.secure = true
    }
    res.cookie('promenade-auth-token', token, cookieOptions);
    res.json(user);
  } catch (e){
    console.error('LOGIN ERROR', e);
    res.sendStatus(401);
    broadcastError({
      type:'FAILED_LOGIN',
      token,
      message: e && e.message,
      value: token && decodeToken(token)
    });
  }
}));

/* GET magic link for a user */
router.get('/magiclink/:userId', asyncHandler(async (req, res, next) => {
  try {
    if(req.userKind !== 'Admin') {
      return res.sendStatus(403);
    }
    let { userId } = req.params;
    let user = await User.findById(userId).lean();
    const token = createExpiringToken(user, '1h');
    res.json({ token, kind:user.kind });
  } catch (e) {
    console.error('MAGIC LINK ERROR', e);
    res.sendStatus(401);
  }
}));

/* POST login with magic link */
router.post('/magiclink', asyncHandler(async (req, res, next) => {
  try {
    let { email } = req.body;
    console.log('EMAIL', email)
    let user = await User.findOne({ email });
    await sendLoginEmail(user);
    res.sendStatus(200);
  } catch (e){
    console.error('LOGIN ERROR', e);
    res.sendStatus(401);
  }
}));

/* POST new ticket */
router.post('/bookTicket', asyncHandler(async (req, res, next) => {
  let { email, showId, sendEmail } = req.body;
  let attendance = await Attendance.bookTicket(email, showId);
  let user = await User.findOne({_id: attendance.attendee});
  let token = createToken(user);

  // if (sendEmail) {
  //   await sendLoginEmail(user);
  // }
  res.json({ attendance, token });
  
  refreshSystemState();
  updateUsersBookedShows(user._id);
}));

/* POST delete ticket */
router.post('/deleteTicket', asyncHandler(async (req, res, next) => {
  let { email, showId } = req.body;
  let user = await Attendance.deleteTicket(email, showId);
  res.sendStatus(200);
  
  refreshSystemState();
  updateUsersBookedShows(user._id);
}));

/* POST create new admin */
router.post('/admin', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let { email, sendEmail } = req.body;
  let admin = await Admin.create({
    email: email,
    username: email.split('@')[0],
    isRootUser: false,
    isOnline: false
  });
  let token = createToken(admin);
  console.log(admin, token);
  // if (sendEmail) {
  //   await sendLoginEmail(admin);
  // }
  res.json({ admin, token });
  refreshSystemState();
}));

/* DELETE admin */
router.delete('/admin/:userId', asyncHandler(async (req, res, next) => {
  if (req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let { userId } = req.params;
  let admin = await Admin.findById(userId).lean();
  if(!admin.isRootUser){
    disconnectUser(userId);
    await Admin.deleteOne({_id:userId});
  }
  res.sendStatus(200);
  refreshSystemState();
}));

/* POST create new actor */
router.post('/actor', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let {
    email,
    username
  } = req.body;
  let actor = await Actor.create({
    email: email,
    username: username || email.split('@')[0],
    isOnline: false,
    places: []
  })
  let token = createToken(actor);
  console.log(actor, token);
  res.json({ actor, token });
  refreshSystemState();
}));

/* DELETE actor */
router.delete('/actor/:userId', asyncHandler(async (req, res, next) => {
  if (req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let { userId } = req.params;
  disconnectUser(userId);
  let actor = await Actor.findById(userId).lean();
  await Promise.all([
    Actor.deleteOne({_id:userId}),
    Place.deleteMany({_id: { $in:actor.places } })
  ]);
  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

/* POST create new bot */
router.post('/bot', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let {
    username
  } = req.body;
  let bot = await Bot.create({
    username: username,
    isOnline: false,
    places: []
  })
  console.log(bot);
  res.json({ bot });
  refreshSystemState();
}));

/* PUT toggle bot */
router.put('/bot/:botId/toggle/:isOn', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let { botId } = req.params;
  let isOn = (req.params.isOn === 'true');
  let bot = await Bot.findByIdAndUpdate(botId, { $set: { isOnline: isOn, isAvailable: isOn } });
  await Place.updateMany({_id: { $in:bot.places } }, { $set: { isAvailable: isOn }});
  console.log(bot);
  res.json({ bot });
  refreshCurrentShowState();
  refreshSystemState();
}));

/* DELETE bot */
router.delete('/bot/:botId', asyncHandler(async (req, res, next) => {
  if (req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let { botId } = req.params;
  let bot = await Bot.findById(botId).lean();
  await Promise.all([
    Bot.deleteOne({_id:botId}),
    Place.deleteMany({_id: { $in:bot.places } })
  ]);
  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

/* POST create new guide */
router.post('/guide', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let {
    email,
    username,
    characterName
  } = req.body;
  let guide = await Guide.create({
    email: email,
    username: username || email.split('@')[0],
    isOnline: false,
    characterName
  })
  let token = createToken(guide);
  console.log(guide, token);
  res.json({ guide, token });
  refreshSystemState();
}));

/* DELETE guide */
router.delete('/guide/:userId', asyncHandler(async (req, res, next) => {
  if (req.userKind !== 'Admin') {
    return res.sendStatus(403);
  }
  let { userId } = req.params;
  disconnectUser(userId);
  await Guide.deleteOne({_id:userId});

  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

/* POST block an attendee */
router.post('/block', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin' && req.userKind !== 'Actor' && req.userKind !== 'Guide') {
    return res.sendStatus(403);
  }
  let { userId } = req.body;
  console.log('BLOCKED', userId);
  await blockUser(userId)
  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

/* PUT update a user's media situation */
router.put('/mediaErrors', asyncHandler(async (req, res, next) => {
  let perms = req.body;
  console.log('MEDIA ERRORS?', JSON.stringify(perms, null, 4));
  let $set = {
    audioError: perms.audioError,
    videoError: perms.videoError,
    mediaError: perms.mediaError
  };

  let user;
  if(perms.audioError){
    $set.isAudioMuted = true;
    user = user || await User.findById(req.userId).lean();
    broadcastError({
      type:'AUDIO_DEVICE_ERROR',
      user,
      message: perms.audioError
    });
  }

  if(perms.videoError){
    $set.isVideoMuted = true;
    user = user || await User.findById(req.userId).lean();
    broadcastError({
      type:'VIDEO_DEVICE_ERROR',
      user,
      message: perms.videoError
    });
  }

  await User.updateOne({ _id:req.userId },{$set});
  res.sendStatus(200);
  if (perms.mediaError) {
    refreshCurrentShowState();
  }
  refreshSystemState();
}));

/* PUT report an error */
router.put('/reportError', asyncHandler(async (req, res, next) => {
  let { error } = req.body;
  res.sendStatus(200);
  error.user = !!req.userId ? await User.findById(req.userId).lean() : null;
  broadcastError(error);
}));

/* PUT report a slowLink event */
router.put('/reportSlowlink', asyncHandler(async (req, res, next) => {
  let { event } = req.body;
  res.sendStatus(200);
  event.userId = req.userId;
  broadcastSlowlink(event);
}));

/* PUT set a user's username */
router.put('/username', asyncHandler(async (req, res, next) => {
  let { userId, username } = req.body;
  if(req.userKind !== 'Admin' && userId !== req.userId){
    return res.sendStatus(403);
  }
  await User.updateOne({ _id:userId },{ $set: { username } });
  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

/* PUT set a guide's character name */
router.put('/charactername', asyncHandler(async (req, res, next) => {
  let { userId, characterName } = req.body;
  if(req.userKind !== 'Admin' && userId !== req.userId){
    return res.sendStatus(403);
  }
  await Guide.updateOne({ _id: userId }, { $set: { characterName } });
  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

/* POST create a place */
router.post('/place', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin' && req.userKind !== 'Actor'){
    return res.sendStatus(403);
  }
  let {
    actorId,
    placeName,
    characterName,
    flavorText,
    audioPath,
    assetKey,
    phase
  } = req.body;
  const newPlace = await Place.create({
    placeName,
    characterName,
    flavorText,
    audioPath,
    assetKey,
    phase
  });
  await Actor.findByIdAndUpdate(actorId, { $push: { places: newPlace._id } });
  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

/* PUT update a place's info */
router.put('/place', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin' && req.userKind !== 'Actor'){
    return res.sendStatus(403);
  }
  let {
    placeId,
    placeName,
    characterName,
    flavorText,
    audioPath,
    assetKey,
    phase
  } = req.body;
  await Place.updateOne({ _id:placeId },{ $set: {
    placeName,
    characterName,
    flavorText,
    audioPath,
    assetKey,
    phase
  } });
  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

/* PUT update a place's volume */
router.put('/place/volume', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin' && req.userKind !== 'Actor'){
    return res.sendStatus(403);
  }
  let {
    placeId,
    audioVolume
  } = req.body;
  await Place.updateOne({ _id:placeId },{ $set: {
    audioVolume
  } });
  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

/* PUT update a place's filter */
router.put('/place/filter', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin' && req.userKind !== 'Actor'){
    return res.sendStatus(403);
  }
  let {
    placeId,
    currentFilter
  } = req.body;
  await Place.updateOne({ _id:placeId },{ $set: {
    currentFilter
  } });
  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

/* PUT update a actor's availability status */
router.put('/actor/available', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin' && req.userKind !== 'Actor'){
    return res.sendStatus(403);
  }
  let {
    actorId,
    isAvailable
  } = req.body;
  let actor = await Actor.findById(actorId);
  await Promise.all([
    Actor.findByIdAndUpdate(actorId, { isAvailable }),
    Place.updateMany({ _id: { $in: actor.places } },{ $set: {
      isAvailable
    }})
  ]);
  if(!isAvailable) {
    let place = await Place.findById(placeId).populate([
      {
        path: 'currentParty',
        populate: [
          {
            path: 'attendances',
            populate: {
              path: 'attendee'
            }
          }
        ]
      },
      {
        path: 'partyQueue',
        populate: [
          {
            path: 'attendances',
            populate: {
              path: 'attendee'
            }
          }
        ]
      }
    ]).lean();

    if (place.currentParty) {
      await kickParty(place.currentParty, place);
    }
    if (place.partyQueue.length) {
      for(let i = 0; i < place.partyQueue.length; i++) {
        await kickParty(place.partyQueue[i], place);
      }
    }
  }
  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

/* DELETE a place */
router.delete('/place', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin' && req.userKind !== 'Actor'){
    return res.sendStatus(403);
  }
  let {
    actorId,
    placeId
  } = req.body;
  await Promise.all([
    Place.findByIdAndDelete(placeId),
    Actor.findByIdAndUpdate(actorId, { $pull: { places: placeId } }),
  ]);
  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

/* POST create a bot place */
router.post('/botplace', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin' && req.userKind !== 'Actor'){
    return res.sendStatus(403);
  }
  let {
    botId,
    placeName,
    characterName,
    flavorText,
    assetKey,
    botURL,
    botTime
  } = req.body;
  const newPlace = await Place.create({
    placeName,
    characterName,
    flavorText,
    assetKey,
    phase: null,
    isBot: true,
    botURL,
    botTime
  });
  await Bot.findByIdAndUpdate(botId, { $push: { places: newPlace._id } });
  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

const MUTE_PERIOD = (env === 'development') ? 5 * 1000 : 30 * 1000;
/* PUT set an attendee's mute settings */
router.put('/mutes', asyncHandler(async (req, res, next) => {
  let { userId, isAudioMuted, isVideoMuted } = req.body;
  let $set = {};
  if(req.userKind === 'Admin' || req.userKind == 'Actor' || req.userKind == 'Guide'){
    if(isAudioMuted){
      $set.isAudioMuted = isAudioMuted;
      $set.audioMuteDeadline = Date.now() + MUTE_PERIOD;
    }
    if(isVideoMuted){
      $set.isVideoMuted = isVideoMuted;
      $set.videoMuteDeadline = Date.now() + MUTE_PERIOD;
    }
  } else if(userId === req.userId) {
    let user = await Attendee.findById(userId).lean();

    console.log('MUTES ALLOWED!', user);
    if(!user.audioMuteDeadline || Date.now() > user.audioMuteDeadline){
      $set.isAudioMuted = isAudioMuted;
      console.log('AUDIO MUTE', isAudioMuted);
    }
    if(!user.videoMuteDeadline || Date.now() > user.videoMuteDeadline){
      $set.isVideoMuted = isVideoMuted;
      console.log('VIDEO MUTE', isVideoMuted);
    }
  } else{
    console.log('MUTES DENIED!');
  }
  await Attendee.updateOne({ _id:userId},{ $set });
  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

/* POST force refresh a user */
router.post('/forceRefresh/:userId', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin' && req.userKind !== 'Actor' && req.userKind !== 'Guide'){
    return res.sendStatus(403);
  }
  let { userId } = req.params;
  forceRefreshUser(userId);
  res.sendStatus(200);
}));

/* PUT move attendee between parties */
router.put('/moveAttendee', asyncHandler(async (req, res, next) => {
  if(req.userKind !== 'Admin' && req.userKind !== 'Actor' && req.userKind !== 'Guide'){
    return res.sendStatus(403);
  }
  let { attendanceId, fromPartyId, toPartyId } = req.body;
  await Promise.all([
    Party.updateOne({_id: fromPartyId}, { $pull: { attendances: attendanceId }}),
    Party.updateOne({_id: toPartyId}, { $push: { attendances: attendanceId }}),
    Attendance.updateOne({_id: attendanceId}, { party: toPartyId })
  ])
  res.sendStatus(200);
  refreshCurrentShowState();
  refreshSystemState();
}));

module.exports = router;

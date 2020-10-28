// Load the http module to create an http server.
const fetch = require('node-fetch');
const puppeteer = require('puppeteer');
const throttle = require('@sitespeed.io/throttle');

const IS_HEADLESS = (process.env.IS_HEADLESS === 'true');
const IS_PI = (process.env.IS_PI === 'true');
const USER_TYPE = process.env.USER_TYPE || 'attendee';

const puppeteerOptions = {
  headless: false,
  defaultViewport: {
    width: 1280,
    height: 720
  },
  // devtools: true,
  args: [
    '--no-sandbox',
    '--enable-precise-memory-info',
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    // `--use-file-for-fake-video-capture=${__dirname}/webcam.mjpeg`,
    // `--use-file-for-fake-audio-capture=${__dirname}/webcam.wav`,
    // `--window-position=${index*10},${index*10}`
  ]
};

if(IS_PI) {
  puppeteerOptions.executablePath = 'chromium-browser';
}

// if(!IS_HEADLESS){
  puppeteerOptions.args.push('--start-fullscreen');
// }

!async function pollForTrigger() {
  try {
    let response = await fetch(`http://maestro.brokenmirrors.services/ready`);
    if (response.ok) {
      let { token, type, profile } = await response.json();
      console.log('GOTIT', token);
      await startPuppeteer(token, type, profile);
      // setTimeout(pollForTrigger, 1000);
    } else {
      console.log('Still waiting...', response.status);
      setTimeout(pollForTrigger, 1000);
    }
  } catch(e) {
    console.error('OHNO!', e);
    setTimeout(pollForTrigger, 1000);
  }
}();

async function delay(amount){
  return await new Promise(resolve => setTimeout(resolve, amount));
}

const TIME_OPEN = 30 * 60 * 1000;

async function startPuppeteer(token, type=USER_TYPE, profile) {
  console.log('THROTTLE CONFIG', profile && JSON.stringify(profile, null, 4));
  if(profile) {
    await throttle.start(profile)
  }
  const browser = await puppeteer.launch(puppeteerOptions);
  const pages = await browser.pages();
  await pages[0].goto(`https://mirrors.show/${type}/?token=${token}&isNerdy=true`);

  // const page = await browser.newPage();
  // await page.goto(`https://shattered.site/${type}/?token=${token}`);
  await delay(TIME_OPEN);
  // await page.screenshot({path: 'example.png'});

  await browser.close();
}
const express = require('express');
const camera = require('./camera');
const detector = require('./detector');
const email = require('./email');

const PORT = process.env.PORT || 5001;

async function lookout(_, res) {
  const imageBuffer = await camera.takePicture(process.env.CAMERA_ID);
  if (imageBuffer) {
    const labels = await detector.labelImage(imageBuffer);
    res.json(labels);
  } else {
    res.json({ error: "imageBuffer is null"});
  }
}

async function checkForBus(_, res) {
  const imageBuffer = await camera.takePicture(process.env.CAMERA_ID);
  if (!imageBuffer) {
    return res.send('Image is null');
  }

  const labels = await detector.labelImage(imageBuffer);
  const found = labels
    .filter(isBus)
    .map(label => `${label.Name}=[${label.Confidence}]`);

  if (found.length) {
    const to = process.env.BUS_EMAILS.split(',');
    email.sendBusEmail(to, imageBuffer).catch(err => {
      console.error(err);
    });
    res.send(found.join('\n'));
  } else {
    res.send('No bus found');
  }
}

function isBus(label) {
  const token = label.Name.toLowerCase();
  return token === 'school bus' || token == 'bus';
}

express()
  .get('/', (_, res) => res.send({ foo: 'bar' }))
  .get('/lookout', lookout)
  .get('/check-for-bus', checkForBus)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

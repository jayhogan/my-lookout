const Ring = require('ring-client-api');

const ringApi = new Ring.RingApi({
  refreshToken: process.env.RING_REFRESH_TOKEN,
});

module.exports = {
  takePicture: async (cameraId) => {
    const cameras = await ringApi.getCameras();
    const camera = cameras.find(c => c.id == cameraId);
    if (camera) {
      return camera.getNextSnapshot({ force: true });
    } else {
      console.log(`camera[${cameraId}] not found`)
    }

    return null
  }
};

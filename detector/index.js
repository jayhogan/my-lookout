const {
  RekognitionClient,
  DetectLabelsCommand,
} = require("@aws-sdk/client-rekognition");

const client = new RekognitionClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  region: process.env.AWS_REGION
});

module.exports = {
  labelImage: async (imageBuffer) => {
    const cmd = new DetectLabelsCommand({
      Image: { Bytes: imageBuffer }
    });

    const output = await client.send(cmd);
    return output.Labels;
  }
}
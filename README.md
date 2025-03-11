# TRANSFORM.IN - JavaScript SDK

[![npm version](https://img.shields.io/npm/v/@transform-in/sdk.svg)](https://www.npmjs.com/package/@transform-in/sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

The official JavaScript SDK for [TRANSFORM.IN](https://transform.in.net) - a powerful image and video transformation and optimization service.

[📚 Documentation](https://docs.transform.in.net/s/2838c104-8428-455f-88cc-2e608789b6ad)

<p align="center">
  <img src="./assets/transform-in-logo.png" alt="Transform.in Logo" width="400"/>
</p>

## Features

- 🖼️ Image transformation (resize, format conversion, quality adjustment)
- 🎬 Video transformation (currently supporting MP4 output)
- 🔍 Image information retrieval
- 🛡️ NSFW content detection
- 🔄 Asynchronous transformation processing
- 🌐 URL generation for transformed images and videos

## Installation

```bash
# Using npm
npm install @transform-in/sdk

# Using yarn
yarn add @transform-in/sdk

# Using pnpm
pnpm add @transform-in/sdk
```

## Usage

### Initialize the SDK

```javascript
import TransformIn from '@transform-in/sdk';

const transformIn = new TransformIn({
  api_key: 'your-api-key',
  project_id: 'your-project-id',
  // Optional: custom base URL
  // base_url: 'https://custom-api.example.com'
});
```

### Check API Health

```javascript
const health = await transformIn.checkHealth();
console.log(health.status); // 'ok' if the API is healthy
```

### Get Image Information

```javascript
const info = await transformIn.info('https://example.com/image.jpg');
if (info.success) {
  console.log(info.data);
  // {
  //   base64: 'encoded-url',
  //   url: 'https://example.com/image.jpg',
  //   type: 'image',
  //   ext: 'jpg',
  //   content_type: 'image/jpeg',
  //   width: 1200,
  //   height: 800,
  //   size: 123456
  // }
}
```

### Get NSFW Content Detection

```javascript
const nsfwInfo = await transformIn.nsfwInfo('https://example.com/image.jpg');
if (nsfwInfo.success) {
  console.log(nsfwInfo.data);
  // {
  //   drawing: 0.01,
  //   hentai: 0.02,
  //   neutral: 0.95,
  //   porn: 0.01,
  //   sexy: 0.01
  // }
}
```

### Generate Transformation URL

```javascript
const transformationUrl = transformIn.url('https://example.com/image.jpg', {
  w: 300,       // Width
  h: 200,       // Height
  f: 'webp',    // Format
  q: 80,        // Quality (1-100)
  bl: 5         // Blur
});

// Use this URL in your <img> tags or for direct access
console.log(transformationUrl);
// https://api.transform.in.net/transformation/your-project-id/your-api-key/encoded-url/w:300,h:200,f:webp,q:80,bl:5
```

### Prepare Transformation (Background Processing)

```javascript
// Trigger transformation without waiting for completion
const preparation = await transformIn.prepareTransformation(
  'https://example.com/image.jpg',
  {
    w: 300,
    h: 200,
    f: 'webp',
    q: 80
  }
);

if (preparation.success) {
  console.log(preparation.data.message); // "Transformation is being processed"
}

// Or wait for the transformation to complete
const completedPreparation = await transformIn.prepareTransformation(
  'https://example.com/image.jpg',
  {
    w: 300,
    h: 200,
    f: 'webp',
    q: 80
  },
  true // Set to true to wait for completion
);

if (completedPreparation.success) {
  console.log(completedPreparation.data.message); // "Transformation processed"
}
```

### Generate Video Transformation URL

```javascript
const videoTransformationUrl = transformIn.url('https://example.com/video.mp4', {
  w: 640,       // Width
  h: 360,       // Height
  f: 'mp4',     // Format (currently only mp4 is supported for video)
  q: 80         // Quality (1-100)
});

// Use this URL in your <video> tags or for direct access
console.log(videoTransformationUrl);
// https://api.transform.in.net/transformation/your-project-id/your-api-key/encoded-url/w:640,h:360,f:mp4,q:80
```

### Prepare Video Transformation

```javascript
// Video transformations are typically processed asynchronously
const videoPreparation = await transformIn.prepareTransformation(
  'https://example.com/video.mp4',
  {
    w: 640,
    h: 360,
    f: 'mp4',
    q: 80
  }
);

if (videoPreparation.success) {
  console.log(videoPreparation.data.message); // "Transformation is being processed"
}

// For larger videos, it's recommended to use the asynchronous approach
// and check the status later rather than waiting for completion
```

## Transformation Options

| Option | Description | Type | Example | Supported Media |
|--------|-------------|------|---------|----------------|
| `w` | Width in pixels | number | `w: 300` | Images, Videos |
| `h` | Height in pixels | number | `h: 200` | Images, Videos |
| `f` | Output format | string | `f: 'webp'` | Images: webp, jpg, png, etc.<br>Videos: mp4 |
| `q` | Quality (1-100) | number | `q: 80` | Images, Videos |
| `bl` | Blur amount | number | `bl: 5` | Images only |

## Error Handling

All methods return a response object with a `success` property that indicates whether the operation was successful. If `success` is `false`, the `error` property will contain details about the error.

```javascript
try {
  const info = await transformIn.info('invalid-url');
} catch (error) {
  console.error('Error:', error.message);
}
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the SDK
npm run build
```

## License

MIT © [TRANSFORM.IN](https://transform.in.net)

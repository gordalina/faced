# faced

faced is a light-weight library to identify faces and it's features such as eyes, nose and mouth. It requires opencv.

## Install
`npm install faced`

## Identify your first face

```javascript
faced = new Faced();
faced.detect('image.jpg', function (faces, image) {
  if (!faces) {
    return console.log("No faces found!");
  }

  var face = face[0];

  console.log(
    "Found a face at %d,%d with dimensions %dx%d",
    face.getX(),
    face.getY(),
    face.getWidth(),
    face.getHeight()
  );

  console.log(
    "What a pretty face, it %s a mount, it %s a nose, it % a left eye and it %s a right eye!",
    face.getMount() ? "has" : "does not have",
    face.getNose() ? "has" : "does not have",
    face.getEyeLeft() ? "has" : "does not have",
    face.getEyeRight() ? "has" : "does not have",
  );
});
```

## API

### Faced.detect(path, function, context)

Loads an image from the given `path` and executes `function` upon completion.

If there were no issues loading the image you should receive two arguments to your function, `function (faces, image) { }`, the first is an array of `Face` whereas the second is a `Matrix` [object from opencv](https://npmjs.org/package/opencv#readme).

In case of error, the callback function is called with no arguments.

### Feature.getX()
Returns the upper X position of the face;

### Feature.getX()
Returns the upper Y position of the face;

### Feature.getX()
Returns the lower X position of the face;

### Feature.getX()
Returns the lower Y position of the face;

### Feature.getX()
Returns the upper left X position of the face;

### Feature.getX()
Returns the width face;

### Feature.getX()
Returns the width face;

### Face
`Face` extends `Feature`

### Face.getMouth()
Returns an instance of `Feature` or undefined if it could not detect it.

### Face.getNose()
Returns an instance of `Feature` or undefined if it could not detect it.

### Face.getEyeLeft()
Returns an instance of `Feature` or undefined if it could not detect it.

### Face.getEyeRight()
Returns an instance of `Feature` or undefined if it could not detect it.

## Examples
See the folder `examples`

## Information

#### License

node-faced is licensed under the [MIT license](http://opensource.org/licenses/MIT)

#### Copyright

Copyright (c) 2013, Samuel Gordalina <samuel.gordalina@gmail.com>
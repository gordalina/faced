var assert = require('assert');
var Faced = require('../lib/faced');
var faced = new Faced();

describe('Integration', function() {
  describe('lenna', function(done) {
    it("should identify lenna's features", function() {
      faced.detect(__dirname + '/../images/lenna.png', function (faces, image, file) {
        assert.equal(true, Array.isArray(faces));
        assert.equal(1, faces.length);

        var face = faces[0];

        assert.equal('Face', face.constructor.name);
        assert.equal(216, face.getX());
        assert.equal(201, face.getY());
        assert.equal(178, face.getWidth());
        assert.equal(178, face.getHeight());

        var mouth = face.getMouth();
        assert.equal('Feature', mouth.constructor.name);
        assert.equal(258, mouth.getX());
        assert.equal(337, mouth.getY());
        assert.equal(66, mouth.getWidth());
        assert.equal(40, mouth.getHeight());

        var nose = face.getNose();
        assert.equal('Feature', nose.constructor.name);
        assert.equal(282, nose.getX());
        assert.equal(298, nose.getY());
        assert.equal(48, nose.getWidth());
        assert.equal(40, nose.getHeight());

        var eyeLeft = face.getEyeLeft();
        assert.equal('Feature', eyeLeft.constructor.name);
        assert.equal(311, eyeLeft.getX());
        assert.equal(247, eyeLeft.getY());
        assert.equal(60, eyeLeft.getWidth());
        assert.equal(40, eyeLeft.getHeight());

        var eyeRight = face.getEyeRight();
        assert.equal('Feature', eyeRight.constructor.name);
        assert.equal(234, eyeRight.getX());
        assert.equal(242, eyeRight.getY());
        assert.equal(69, eyeRight.getWidth());
        assert.equal(46, eyeRight.getHeight());

        done();
      });
    });
  });
});

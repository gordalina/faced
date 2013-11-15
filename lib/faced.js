/*jslint node: true, nomen:true*/
"use strict";

var _ = require("underscore");
var OpenCV = require("opencv");
var Detector = require("./detector");
var path = require('path');

var hc_path = path.join(path.dirname(require.resolve("opencv")), '..', 'data');
var cascades = {
    "face": path.join(hc_path, "haarcascade_frontalface_alt2.xml"),
    "mouth": path.join(hc_path, "haarcascade_mcs_mouth.xml"),
    "nose": path.join(hc_path, "haarcascade_mcs_nose.xml"),
    "eyeLeft": path.join(hc_path, "haarcascade_mcs_lefteye.xml"),
    "eyeRight": path.join(hc_path, "haarcascade_mcs_righteye.xml")
};

function Faced() {
    this.cascades = {};

    _.each(cascades, function (path, element) {
        this.cascades[element] = new OpenCV.CascadeClassifier(path);
    }, this);
}

Faced.prototype.detect = function (path, fn, context) {
    if (!this.cascades) {
        throw new Error("Faced has been destroyed");
    }

    OpenCV.readImage(path, _.bind(function (err, img) {
        var detector, size;

        if (err || typeof img !== "object") {
            return fn.call(context, undefined, undefined, path);
        }

        size = img.size();

        if (size[0] === 0 || size[1] === 0) {
            return fn.call(context, undefined, undefined, path);
        }

        detector = new Detector(this.cascades);
        detector.run(img, function (faces) {
            fn.call(context, faces, img, path);
        });
    }, this));
};

Faced.prototype.destroy = function () {
    delete this.cascades;
};

module.exports = Faced;

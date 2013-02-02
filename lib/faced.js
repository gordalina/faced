/*jslint node: true, nomen:true*/
"use strict";

var _ = require("underscore");
var OpenCV = require("opencv");
var Detector = require("./detector");

var cascades = {
    "face": "../node_modules/opencv/data/haarcascade_frontalface_alt2.xml",
    "mouth": "../node_modules/opencv/data/haarcascade_mcs_mouth.xml",
    "nose": "../node_modules/opencv/data/haarcascade_mcs_nose.xml",
    "eyeLeft": "../node_modules/opencv/data/haarcascade_mcs_lefteye.xml",
    "eyeRight": "../node_modules/opencv/data/haarcascade_mcs_righteye.xml"
};

var Faced = function () {
    var element;

    this.cascades = {};

    _.each(cascades, function (path, element) {
        this.cascades[element] = new OpenCV.CascadeClassifier(__dirname + "/" + path);
    }, this);
};

Faced.prototype.detect = function (image, fn, context) {
    if (!this.cascades) {
        throw new Error("Faced has been destroyed");
    }

    OpenCV.readImage(image, _.bind(function (err, img) {
        var detector, size;

        if (err || typeof img !== "object") {
            return fn.call(context);
        }

        size = img.size();

        if (size[0] === 0 || size[1] === 0) {
            return fn.call(context);
        }

        detector = new Detector(this.cascades);
        detector.run(img, function (faces) {
            fn.call(context, faces, img);
        });
    }, this));
};

Faced.prototype.destroy = function () {
    delete this.cascades;
}

module.exports = Faced;
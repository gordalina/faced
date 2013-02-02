/*jslint node: true, nomen:true*/
"use strict";

var _ = require("underscore");
var Face = require("./face");
var Feature = require("./feature");

var getFaces;

var Detector = function (cascades) {
    this.cascades = cascades;
};

Detector.prototype.run = function (image, fn, context) {
    var detections = {},
        complete;

    complete = _.after(_.keys(this.cascades).length, function () {
        fn.call(context, getFaces(detections), image);
    });

    _.each(this.cascades, function (cascade, element) {
        cascade.detectMultiScale(image, function (error, objects) {
            detections[element] = !error ? objects : [];
            complete();
        });
    });
};

getFaces = function (detections) {
    var faces = [];

    function outside(input, test) {
        return test.x > input.x + input.width ||
            test.x + test.width < input.x ||
            test.y > input.y + input.height ||
            test.y + test.height < input.y;
    }

    _.each(detections.face, function (face) {
        var currentFace = new Face(face);

        _.each(detections, function (detect, element) {
            if (element === "face") {
                return;
            }

            _.each(detect, function (properties) {
                if (!outside(face, properties)) {
                    currentFace.add(element, new Feature(properties));
                }
            });
        });

        currentFace.normalize();

        if (currentFace.getFeatureCount() > 0) {
            faces.push(currentFace);
        }
    });

    return faces;
}

module.exports = Detector;

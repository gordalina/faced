/*jslint node: true, nomen: true*/
"use strict";

var _ = require('underscore');
var Faced = require('./../lib/faced');

var faced = new Faced();

faced.detect(__dirname + '/gioconda.jpg', function (faces, image) {
    var colors = {
        "face": [0, 0, 0],
        "mouth": [255, 0, 0],
        "nose": [255, 255, 255],
        "eyeLeft": [0, 0, 255],
        "eyeRight": [0, 255, 0]
    };

    if (!faces) {
        console.error("Could not open gioconda.jpg make sure you're in the examples folder");
        return;
    }

    function draw(feature, color) {
        image.rectangle(
            [feature.getX(), feature.getY()],
            [feature.getX2(), feature.getY2()],
            color,
            2
        );
    }

    _.each(faces, function (face) {
        draw(face, colors.face);

        _.each(face.getFeatures(), function (features, name) {
            _.each(features, function (feature) {
                draw(feature, colors[name]);
            });
        });
    });

    image.save(__dirname + '/gioconda.features.jpg');
});
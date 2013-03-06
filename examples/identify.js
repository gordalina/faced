/*jslint node: true, nomen: true*/
"use strict";

var path = require('path');
var _ = require('underscore');
var Faced = require('./../lib/faced');
var faced = new Faced();

function worker(faces, image, file) {
    var output, colors = {
        "face": [0, 0, 0],
        "mouth": [255, 0, 0],
        "nose": [255, 255, 255],
        "eyeLeft": [0, 0, 255],
        "eyeRight": [0, 255, 0]
    };

    if (!faces) {
        console.error("Could not open %s", file);
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

    output = file.split('.');
    output.push('features', output.pop());
    output = output.join('.');

    console.log('Processed %s', output);
    image.save(output);
}

_.each(process.argv.slice(2), function (file) {
    faced.detect(path.resolve(file), worker);
});

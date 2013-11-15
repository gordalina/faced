/*jslint node: true, nomen: true*/
"use strict";

var _ = require("underscore");
var Feature = require("./feature");

var allowedFeatures = [
    "mouth",
    "nose",
    "eyeLeft",
    "eyeRight"
];

function Face(attributes) {
    Feature.prototype.constructor.apply(this, arguments);

    _.each(allowedFeatures, function (feature) {
        this[feature] = [];
    }, this);
}

Face.prototype = new Feature();
Face.prototype.constructor = Face;

Face.prototype.add = function (name, feature) {
    if (feature instanceof Feature === false) {
        throw new TypeError("feature is not class of Instance");
    }

    if (!_.contains(allowedFeatures, name)) {
        throw new Error("feature name is not allowed: " + name);
    }

    this[name].push(feature);
};

Face.prototype.getFeatureCount = function (feature) {
    if (feature) {
        return this.getFeatures(feature).length;
    }

    return _.filter(
        _.map(allowedFeatures, function (feature) {
            return this[feature].length;
        }, this),
        function (count) {
            return count > 0;
        },
        this
    ).length;
};

Face.prototype.getFeature = function (feature) {
    if (_.contains(allowedFeatures, feature)) {
        switch (this[feature].length) {
        case 0:
            return;

        case 1:
            return this[feature][0];

        default:
            return this[feature];
        }
    }
};

Face.prototype.getFeatures = function (feature) {
    var features = {};

    if (feature && _.contains(allowedFeatures, feature)) {
        return this[feature];
    }

    _.each(allowedFeatures, function (feature) {
        features[feature] = this[feature];
    }, this);

    return features;
};

Face.prototype.getMouth = function () {
    return this.getFeature("mouth");
};

Face.prototype.getNose = function () {
    return this.getFeature("nose");
};

Face.prototype.getEyeLeft = function () {
    return this.getFeature("eyeRight");
};

Face.prototype.getEyeRight = function () {
    return this.getFeature("eyeLeft");
};

Face.prototype.remove = function (name, feature) {
    this[name] = _.difference(this[name], [feature]);
};

Face.prototype.getNoseCenteredness = function (nose) {
    var mouth = this.getMouth(),
        horizontal,
        vertical;

    if (!mouth) {
        return 0;
    }

    horizontal = (
        (nose.getX() - this.getX())
        +
        (nose.getWidth() / 2)
    ) / this.getWidth();

    vertical = (
        (nose.getY() - this.getY())
        +
        (nose.getHeight() / 2)
    ) / this.getHeight();

    return Math.abs(
        ((horizontal + vertical) / 2) - 0.5
    );
};

Face.prototype.normalize = function () {
    this.stripExternalFeatures();

    if (!this.getFeatureCount()) {
        return;
    }

    this.isolateMouth();
    this.isolateNose();
    this.isolateEyes();
};

Face.prototype.stripExternalFeatures = function () {
    _.each(this.getFeatures(), function (features, name) {
        _.each(features, function (feature) {
            if (this.intersect(feature) < 1) {
                this.remove(name, feature);
            }
        }, this);
    }, this);
};

Face.prototype.isolateMouth = function () {
    var bestMouth;

    _.each(this.getFeatures("mouth"), function (mouth) {
        var toRemove;

        if (!bestMouth) {
            bestMouth = mouth;
            return;
        }

        if (mouth.getY() > bestMouth.getY()) {
            toRemove = bestMouth;
            bestMouth = mouth;
        } else {
            toRemove = mouth;
        }

        if (toRemove) {
            this.remove("mouth", toRemove);
        }
    }, this);
};

Face.prototype.isolateNose = function () {
    var mouth = this.getMouth(),
        bestNose;

    // if we have a mouth lets remove all the noses that do not intersect it
    if (mouth) {
        _.each(this.getFeatures("nose"), function (nose) {
            if (nose.intersect(mouth) === 0) {
                this.remove("nose", nose);
            }
        }, this);
    }

    if (this.getFeatures("nose").length <= 1) {
        return;
    }

    // we have more than one nose, lets select the most centrally-aligned one
    _.each(this.getFeatures("nose"), function (nose) {
        var toRemove;

        if (!bestNose) {
            bestNose = nose;
            return;
        }

        if (this.getNoseCenteredness(nose) < this.getNoseCenteredness(bestNose)) {
            toRemove = bestNose;
            bestNose = nose;
        } else {
            toRemove = nose;
        }

        if (toRemove) {
            this.remove("nose", nose);
        }
    }, this);
};

Face.prototype.isolateEyes = function () {
    var eyes,
        maximumY = this.getY() + Math.abs(this.getHeight() / 2),
        minimumXforRightEye,
        maximumXforLeftEye;

    // first lets discard all the eyes that do no start
    // on the upper half of the face

    _.each(this.getFeatures("eyeLeft"), function (eye) {
        if (eye.getY() > maximumY) {
            this.remove("eyeLeft", eye);
        }
    }, this);

    _.each(this.getFeatures("eyeRight"), function (eye) {
        if (eye.getY() > maximumY) {
            this.remove("eyeRight", eye);
        }
    }, this);

    // jackpot!
    if (this.getFeatures("eyeLeft").length === 1 &&
            this.getFeatures("eyeRight").length === 1) {
        return;
    }

    eyes = [ 'eyeLeft', 'eyeRight' ];

    // Lets remove all eyes that are within each other
    _.each(eyes, function (eyeName, idx) {
        _.each(this.getFeatures(eyeName), function (eye) {
            var subEyeName = eyes[idx ? 0 : 1];

            _.each(this.getFeatures(subEyeName), function (subEye) {
                if (eye === subEye) {
                    return;
                }

                if (eye.intersect(subEye)) {
                    this.remove(subEyeName, subEye);
                }
            }, this);
        }, this);
    }, this);

    // If we have a pair of the same eye and none of the other
    // set one of them as the other eye
    _.each(eyes, function (eyeName, idx) {
        var eyeFeatures, otherEyeFeatures,
            otherEyeName = eyes[idx ? 0 : 1];

        eyeFeatures = this.getFeatures(eyeName);
        otherEyeFeatures = this.getFeatures(otherEyeName);

        if (eyeFeatures.length === 2 && otherEyeFeatures.length === 0) {
            eyeFeatures = this.getFeatures(eyeName);


            if (eyeFeatures[0].getX() > eyeFeatures[1].getX()) {
                this.remove(eyeName, eyeFeatures[0]);
                this.add(otherEyeName, eyeFeatures[0]);
            } else {
                this.remove(eyeName, eyeFeatures[1]);
                this.add(otherEyeName, eyeFeatures[1]);
            }
        }
    }, this);

    // jackpot!
    if (this.getFeatures("eyeLeft").length === 1 &&
            this.getFeatures("eyeRight").length === 1) {
        return;
    }

    // Lets remove right-side eyes from the left side
    minimumXforRightEye = this.getX() + Math.abs(this.getWidth() * 0.33);

    _.each(this.getFeatures("eyeRight"), function (eye) {
        if (eye.getX() < minimumXforRightEye) {
            this.remove("eyeRight", eye);
        }
    }, this);

    // Lets remove right-side eyes from the left side
    maximumXforLeftEye = this.getX() + Math.abs(this.getWidth() * 0.66);

    _.each(this.getFeatures("eyeLeft"), function (eye) {
        if (eye.getX2() > maximumXforLeftEye) {
            this.remove("eyeLeft", eye);
        }
    }, this);
};

module.exports = Face;

/*jslint node: true, nomen: true*/
"use strict";

function Feature(attributes) {
    if (attributes) {
        this.x = attributes.x;
        this.y = attributes.y;
        this.width = attributes.width;
        this.height = attributes.height;
    }
}

Feature.prototype.getX = function () {
    return this.x;
};

Feature.prototype.getY = function () {
    return this.y;
};

Feature.prototype.getX2 = function () {
    return this.getX() + this.getWidth();
};

Feature.prototype.getY2 = function () {
    return this.getY() + this.getHeight();
};

Feature.prototype.getWidth = function () {
    return this.width;
};

Feature.prototype.getHeight = function () {
    return this.height;
};

Feature.prototype.intersect = function (feature) {
    var excessHeightTop,
        excessHeightBottom,
        excessWidthLeft,
        excessWidthRight,
        excessHeight,
        excessWidth,
        excess;

    // test for intersection
    if ((
            this.getX2() < feature.getX() ||
            this.getX() > feature.getX2() ||
            this.getY2() < feature.getY() ||
            this.getY() > feature.getY2()
        )) {
        return 0;
    }

    excessHeightTop = (this.getY() - feature.getY());
    excessHeightBottom = (feature.getY2() - this.getY2());
    excessWidthLeft = (this.getX() - feature.getX());
    excessWidthRight = (feature.getX2() - this.getX2());

    excessHeight = (
        (excessHeightTop > 0 ? excessHeightTop : 0)
        +
        (excessHeightBottom > 0 ? excessHeightBottom : 0)
    );

    excessWidth = (
        (excessWidthLeft > 0 ? excessWidthLeft : 0)
        +
        (excessWidthRight > 0 ? excessWidthRight : 0)
    );

    excess = (
        excessHeight * feature.getWidth()
        +
        excessWidth * feature.getHeight()
    );

    return 1 - (excess / (feature.getWidth() * feature.getHeight()));
};

module.exports = Feature;

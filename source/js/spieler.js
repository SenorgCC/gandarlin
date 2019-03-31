"use strict";
exports.__esModule = true;
var Spieler = /** @class */ (function () {
    function Spieler(n, l) {
        this.name = n;
        this.leben = l;
    }
    Spieler.prototype.grues = function () {
        return "Hallo, ich bin " + this.name;
    };
    return Spieler;
}());
exports.Spieler = Spieler;

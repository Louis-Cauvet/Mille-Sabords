"use strict";

class Carte {
    constructor(nom, effet) {
        this.nom = nom;
        this.effet = effet;
    }

    appliquerEffet(tour) {
        this.effet(tour);
    }
}
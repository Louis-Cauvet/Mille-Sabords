"use strict";
class Tour {
    constructor() {
        this.tetesDeMort = 0;
        this.singes = 0;
        this.perroquets = 0;
        this.diamonds = 0;
        this.pieces = 0;
        this.vies = 1;
        this.banque = 0;
        this.objectif = null;
        this.multiplier = 1;
        this.carteTiree = null;
    }

    setCarteTiree(carte) {
        this.carteTiree = carte;
    }

    ajouterTeteDeMort(nombre = 1) {
        this.tetesDeMort += nombre;
    }

    ajouterSinge(nombre = 1) {
        this.singes += nombre;
    }

    ajouterPerroquet(nombre = 1) {
        this.perroquets += nombre;
    }

    ajouterDiamond(nombre = 1) {
        this.diamonds += nombre;
    }

    ajouterPiece(nombre = 1) {
        this.pieces += nombre;
    }

    ajouterVie(nombre = 1) {
        this.vies += nombre;
    }

    appliquerCarte(carte) {
        carte.appliquerEffet(this);
    }

    reset() {
        this.tetesDeMort = 0;
        this.singes = 0;
        this.perroquets = 0;
        this.diamonds = 0;
        this.pieces = 0;
        this.vies = 1;
        this.banque = 0;
        this.objectif = null;
        this.multiplier = 1;
    }

    mettreAJour(resultats) {
        this.tetesDeMort += resultats['Tete de mort'];
        this.singes += resultats['Singe'];
        this.perroquets += resultats['Perroquet'];
        this.diamonds += resultats['Diamond'];
        this.pieces += resultats['Piece'];
        this.Epee += resultats['Epee'];
    }

    getTetesDeMort() {
        return this.tetesDeMort;
    }

    getSinges() {
        return this.singes;
    }

    getPerroquets() {
        return this.perroquets;
    }

    getDiamonds() {
        return this.diamonds;
    }

    getPieces() {
        return this.pieces;
    }

    getVies() {
        return this.vies;
    }

    getBanque() {
        return this.banque;
    }

    getObjectif() {
        return this.objectif;
    }

    getMultiplier() {
        return this.multiplier;
    }
}
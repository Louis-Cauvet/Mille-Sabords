"use strict";

class Tour {
    constructor() {
        this.carteTiree = null;
        this.tetes_de_mort = 0;
        this.singes = 0;
        this.perroquets = 0;
        this.diamants = 0;
        this.pieces = 0;
        this.epees = 0;
        this.vies = 0;
        this.nblancers = 1;
        this.objectifBateau = null;
        this.scoreBateau = null;
        this.bonusCapitaine = false;
        this.banque = false;
    }

    getCarteTiree() {
        return this.carteTiree;
    }

    setCarteTiree(carte) {
        this.carteTiree = carte;
    }

    getnblancers() {
        return this.nblancers;
    }

    setnblancers(value) {
        this.nblancers = value;
    }

    getTetesDeMort() {
        return this.tetes_de_mort;
    }

    setTetesDeMort(value) {
        this.tetes_de_mort = value;
    }

    getSinges() {
        return this.singes;
    }

    setSinges(value) {
        this.singes = value;
    }

    getPerroquets() {
        return this.perroquets;
    }

    setPerroquets(value) {
        this.perroquets = value;
    }

    getDiamants() {
        return this.diamants;
    }

    setDiamants(value) {
        this.diamants = value;
    }

    getPieces() {
        return this.pieces;
    }

    setPieces(value) {
        this.pieces = value;
    }

    getEpees() {
        return this.epees;
    }

    setEpees(value) {
        this.epees = value;
    }

    getVies() {
        return this.vies;
    }

    setVies(value) {
        this.vies = value;
    }

    getObjectifBateau() {
        return this.objectifBateau;
    }

    setObjectifBateau(value) {
        this.objectifBateau = value;
    }

    getScoreBateau() {
        return this.scoreBateau;
    }

    setScoreBateau(value) {
        this.scoreBateau = value;
    }

    getBonusCapitaine() {
        return this.bonusCapitaine;
    }

    setBonusCapitaine(value) {
        this.bonusCapitaine = value;
    }

    getBanque() {
        return this.banque;
    }

    setBanque(value) {
        this.banque = value;
    }

    appliquerCarte(carte) {
        carte.appliquerEffet(this);
    }

    mettreAJour(resultats) {
        this.tetes_de_mort += resultats['tetes_de_mort'];
        this.singes += resultats['singes'];
        this.perroquets += resultats['perroquets'];
        this.diamants += resultats['diamants'];
        this.pieces += resultats['pieces'];
        this.epees += resultats['epees'];
    }
}
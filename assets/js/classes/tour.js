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
        this.nbLancers = 0;
        this.objectifBateau = null;
        this.scoreBateau = null;
        this.bonusCapitaine = false;
        this.indiceReduction = -100;
        this.banque = false;
        this.groupeAnimaux = false;
        this.scorePotentiel = 0;
        this.modeTeteDeMort = false;
        this.tourPerdu = false;
    }

    getCarteTiree() {
        return this.carteTiree;
    }

    setCarteTiree(carte) {
        this.carteTiree = carte;
    }

    getNbLancers() {
        return this.nbLancers;
    }

    setNbLancers(value) {
        this.nbLancers = value;
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

    getIndiceReduction() {
        return this.indiceReduction;
    }

    setIndiceReduction(value) {
        this.indiceReduction = value;
    }

    getBanque() {
        return this.banque;
    }

    setBanque(value) {
        this.banque = value;
    }

    getGroupeAnimaux() {
        return this.groupeAnimaux;
    }

    setGroupeAnimaux(value) {
        this.groupeAnimaux = value;
    }

    getScorePotentiel() {
        return this.scorePotentiel;
    }

    setScorePotentiel(value) {
        this.scorePotentiel = value;
    }

    getModeTeteDeMort() {
        return this.modeTeteDeMort;
    }

    setModeTeteDeMort(value) {
        this.modeTeteDeMort = value;
    }

    getTourPerdu() {
        return this.tourPerdu;
    }

    setTourPerdu(value) {
        this.tourPerdu = value;
    }


    /*************************************
     Potential score's calculation according to the dices obtained and the card drawn
     *************************************/
    calculerScorePotentiel() {
        let score = 0;

        // If the user have obtained more than 3 skull dices, his score remains to 0
        if (this.getTourPerdu() !== true) {
            // Checking the issues concerning the card "Bateau"
            if (this.carteTiree.nom.includes('bateau')) {
                if (this.epees >= this.getObjectifBateau()) {
                    // If the card's objective is achieved, her value is added to the potential score
                    score += this.getScoreBateau();

                    // Adding classic points to the potential score
                    score = this.calculerClassiquesPoints(score);
                } else {
                    // If the objective is not achieved, the value of the card is deducted from the potential score
                    score -= this.getScoreBateau();
                }
            } else {
                score = this.calculerClassiquesPoints(score);
            }

            // Points are doubled if the user draws the ‘Pirate’ card
            if (this.getBonusCapitaine() === true) {
                score *= 2;
            }
        } else if (this.getCarteTiree().nom.includes("bateau")) {
            // Managing the case where the player gets 3 skull dices when his card is of type "Bateau" (points penality)
            score -= this.getScoreBateau();
        }

        // Allocating the calculated potential score
        this.scorePotentiel = score;

        // Displaying the potential score
        const scorePotentielArea = document.querySelector('#potential-score span');
        if (scorePotentielArea) {
            scorePotentielArea.textContent = this.scorePotentiel.toString();
        }
    }


    /*************************************
     Calculation of points based on "Pièce" and "Diamant" dices, & the accumulation of dices which had the same type
     *************************************/
    calculerClassiquesPoints(scorePotentiel) {
        // Calculating points for "Pièce" and "Diamant" dices
        scorePotentiel += this.pieces * 100;
        scorePotentiel += this.diamants * 100;

        let counts = null;

        if (this.carteTiree.nom === 'singe_perroquet') {
            // If the "Animaux" card is drawn, the dices "Singe" and "Perroquet" are added together
            const singesEtPerroquets = this.singes + this.perroquets;
            counts = [singesEtPerroquets, this.epees, this.diamants, this.pieces];
        } else {
            // Classic calculation of points by accumulating dices which had the same type
            counts = [this.singes, this.perroquets, this.epees, this.diamants, this.pieces];
        }

        counts.forEach(count => {
            switch (count) {
                case 3:
                    scorePotentiel += 100;
                    break;
                case 4:
                    scorePotentiel += 200;
                    break;
                case 5:
                    scorePotentiel += 500;
                    break;
                case 6:
                    scorePotentiel += 1000;
                    break;
                case 7:
                    scorePotentiel += 2000;
                    break;
                case 8:
                    scorePotentiel += 4000;
                    break;
                default:
                    scorePotentiel += 0;
            }
        });

        // Adding bonus points if all the dices are used
        if ((this.singes >= 3 || this.singes === 0) &&
            (this.perroquets >= 3 || this.perroquets === 0) &&
            (this.epees >= 3 || this.epees === 0) &&
            (this.tetes_de_mort === 0)) {
            scorePotentiel += 500;
        }

        return scorePotentiel;
    }
}
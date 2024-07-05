"use strict";

class Tour {
    constructor() {
        this.carteTiree = null;
        this.Six = 0;
        this.Cinq = 0;
        this.Trois = 0;
        this.Deux = 0;
        this.Un = 0;
        this.Quatre = 0;
        this.vies = 0;
        this.nbLancers = 0;
        this.objectifBateau = null;
        this.scoreBateau = null;
        this.bonusCapitaine = false;
        this.indiceReduction = -100;
        this.banque = false;
        this.groupeAnimaux = false;
        this.scorePotentiel = 0;
        this.mageUtilise = false;
        this.modeTeteDeMort = false;
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
        return this.Six;
    }

    setTetesDeMort(value) {
        this.Six = value;
    }

    getCinq() {
        return this.Cinq;
    }

    setCinq(value) {
        this.Cinq = value;
    }

    getTrois() {
        return this.Trois;
    }

    setTrois(value) {
        this.Trois = value;
    }

    getDeux() {
        return this.Deux;
    }

    setDeux(value) {
        this.Deux = value;
    }

    getUn() {
        return this.Un;
    }

    setUn(value) {
        this.Un = value;
    }

    getQuatre() {
        return this.Quatre;
    }

    setQuatre(value) {
        this.Quatre = value;
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

    mettreAJour(diceTypeCount) {
        this.Deux = diceTypeCount.Deux || 0;
        this.Un = diceTypeCount.Un || 0;
        this.Cinq = diceTypeCount.Cinq || 0;
        this.Trois = diceTypeCount.Trois || 0;
        this.Quatre = diceTypeCount.Quatre || 0;

        // Calcul du score potentiel à chaque mise à jour des dés
        this.calculerScorePotentiel();
    }

    calculerScorePotentiel() {
        let score = 0;

        // On effectue les vérifications concernant la carte "Bateau"
        if (this.carteTiree && this.carteTiree.nom.includes('bateau')) {
            if (this.Quatre >= this.getObjectifBateau()) {
                // Si l'objectif est atteint, on ajoute la valeur de la carte au score potentiel
                score += this.getScoreBateau();

                // On ajoute également les points classiques au score potentiel
                score = this.calculerClassiquesPoints(score);
            } else {
                // Si l'objectif n'est pas atteint, on retire la valeur de la carte au score potentiel
                score -= this.getScoreBateau();
            }
        } else {
            score = this.calculerClassiquesPoints(score);
        }

        // On double les points si l'utilisateur a tiré la carte "Pirate"
        if (this.getBonusCapitaine()) {
            score *= 2;
        }

        // Mise à jour du score potentiel
        this.scorePotentiel = score;

        // Affichage du score potentiel dans le div avec l'id scorePotentiel
        setTimeout(() => {
            const scorePotentielArea = document.getElementById('scorePotentiel');
            if (scorePotentielArea) {
                scorePotentielArea.textContent = this.scorePotentiel.toString();
            }
        }, 1200); // Décalage d'1,2 seconde pour attendre la fin du lancer
        console.log('Score potentiel :', this.scorePotentiel);
        
    }

    calculerClassiquesPoints(scorePotentiel) {
        scorePotentiel += this.Un * 100;
        scorePotentiel += this.Deux * 100;

        const counts = [this.Cinq, this.Trois, this.Quatre, this.Deux, this.Un];
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

        if ((this.Un === 0 || this.Un > 0) &&
            (this.Deux === 0 || this.Deux >= 0) &&
            (this.Cinq >= 3 || this.Cinq === 0) &&
            (this.Trois >= 3 || this.Trois === 0) &&
            (this.Quatre >= 3 || this.Quatre === 0) &&
            (this.Six <= 0)) {
            scorePotentiel += 500;
        }

        return scorePotentiel;
    }
}


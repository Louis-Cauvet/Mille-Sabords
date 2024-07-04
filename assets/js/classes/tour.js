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

  mettreAJour(diceTypeCount) {
    this.diamants = diceTypeCount.diamants || 0;
    this.pieces = diceTypeCount.pieces || 0;
    this.singes = diceTypeCount.singes || 0;
    this.perroquets = diceTypeCount.perroquets || 0;
    this.epees = diceTypeCount.epees || 0;

    // Calcul du score potentiel à chaque mise à jour des dés
    this.calculerScorePotentiel();
  }


   /*************************************
    Verifie si 9 donne identique
    *************************************/



    /*************************************
     Calcul du score potentiel selon les dés obtenus et la carte tirée
     *************************************/
    calculerScorePotentiel() {
        let score = 0;

        // On effectue les vérifications concernant la carte "Bateau"
        if (this.carteTiree.nom.includes('bateau')) {
            if (this.epees >= this.getObjectifBateau()) {
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

        // On double les points si l'utilisateur à tiré la carte "Pirate"
        if (this.getBonusCapitaine() === true) {
            score = score*2;
        }
        if (this.carteTiree && this.carteTiree.nom === 'singe_perroquet') {
            score = this.calculerTourAnimauxPoints();
        }


        // Attribution du score potentiel calculé à l'attribut de la classe
        this.scorePotentiel = score;

        setTimeout( ()=> {
            // Affichage du score potentiel dans le div avec l'id scorePotentiel (avec un décalage d'1,2 seconde pour attendre la fin du lancer)
            const scorePotentielArea = document.getElementById('scorePotentiel');
            if (scorePotentielArea) {
                scorePotentielArea.textContent = this.scorePotentiel.toString();
            }
        }, 1200);
    }


    /*************************************
     Calcul des points gagnés avec les dés pièces et diamant, ainsi que le cumul de dés du même type
     *************************************/
    calculerClassiquesPoints(scorePotentiel) {
        // Calcul des points liés aux dés pièces et diamants
        scorePotentiel += this.pieces * 100;
        scorePotentiel += this.diamants * 100;

        // Calcul des points liés au cumul de dés de type identique
        const counts = [this.singes, this.perroquets, this.epees, this.diamants, this.pieces];

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

        if ((this.pieces === 0 || this.pieces > 0) &&
            (this.diamants === 0 || this.diamants >= 0) &&
            (this.singes >= 3 || this.singes === 0)&&
            (this.perroquets >= 3 || this.perroquets === 0) &&
            (this.epees >= 3 || this.epees === 0)) {
            scorePotentiel += 500;
        }
        return scorePotentiel;
    }

    calculerTourAnimauxPoints() {
        let scorePotentiel = 0;

        // Calcul des points liés aux dés pièces et diamants
        scorePotentiel += this.pieces * 100;
        scorePotentiel += this.diamants * 100;

        // Calcul des points liés au cumul de dés de type identique
        let singesEtPerroquets = this.singes + this.perroquets;
        const counts = [singesEtPerroquets, this.epees, this.diamants, this.pieces];

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
        if ((this.pieces === 0 || this.pieces > 0) &&
        (this.tetes_de_mort === 0) &&
        (this.diamants === 0 || this.diamants >= 0) &&
        (singesEtPerroquets >= 3 || singesEtPerroquets === 0) &&
        (this.epees >= 3 || this.epees === 0)) {
            scorePotentiel += 500;
        }
        return scorePotentiel;
    }


    replaceSkullDice() {
        if (this.vies > 0 && !this.mageUtilise) {
            const savedDice = document.querySelectorAll('.saved-dice');
            for (let dice of savedDice) {
                if (dice.classList.contains('show-3')) {
                    unsaveDice(dice);
                    this.tetes_de_mort -= 1;
                    this.vies -= 1;
                    this.mageUtilise = true;
                    console.log("Un dé tête de mort a été replacé et une vie a été retirée.");
                    return;
                }
            }
        } else {
            console.log("Aucune vie disponible ou capacité mage déjà utilisée.");
        }
    }
}
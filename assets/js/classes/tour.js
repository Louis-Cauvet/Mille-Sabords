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
        this.indiceReduction = 100;
        this.banque = false;
        this.groupeAnimaux = false;
        this.score = 0;
        this.scorePotentiel = 0;
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

    appliquerCarte(carte) {
        carte.appliquerEffet(this);
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

// Méthode pour calculer le score potentiel en fonction des dés actuels
calculerScorePotentiel() {
    let score = 0;

    // Vérification des cartes spéciales
    if (this.carteTiree && (this.carteTiree.nom === 'bateau_300' || this.carteTiree.nom === 'bateau_500' || this.carteTiree.nom === 'bateau_1000')) {
        // Gérer les règles spécifiques pour chaque carte bateau
        if (this.carteTiree.nom === 'bateau_300') {
            if (this.epees >= 2) {
                score += 300;
                console.log('Bien joué ! Vous avez gagné 300 points !');
            } else {
                score -= 300;
                console.log('Vous avez perdu 300 points !');
            }
        } else if (this.carteTiree.nom === 'bateau_500') {
            if (this.epees >= 3) {
                score += 500;
                console.log('Bien joué ! Vous avez gagné 500 points !');
            } else {
                score -= 500;
                console.log('Vous avez perdu 500 points !');
            }
        } else if (this.carteTiree.nom === 'bateau_1000') {
            if (this.epees >= 4) {
                score += 1000;
                console.log('Bien joué ! Vous avez gagné 1000 points !');
            } else {
                score -= 1000;
                console.log('Vous avez perdu 1000 points !');
            }
        }
        score += this.diamants * 100;
        score += this.pieces * 100;

        // Calcul des points supplémentaires pour séries de dés
        const counts = [this.singes, this.perroquets, this.epees, this.diamants, this.pieces];

        counts.forEach(count => {
            if (count === 3) score += 100;
            else if (count === 4) score += 200;
            else if (count === 5) score += 500;
            else if (count === 6) score += 1000;
            else if (count === 7) score += 2000;
            else if (count === 8) score += 4000;
        });
    } else {
        // Calcul basique basé sur le nombre de diamants et pièces
        score += this.diamants * 100;
        score += this.pieces * 100;

        // Calcul des points supplémentaires pour séries de dés
        const counts = [this.singes, this.perroquets, this.epees, this.diamants, this.pieces];

        counts.forEach(count => {
            if (count === 3) score += 100;
            else if (count === 4) score += 200;
            else if (count === 5) score += 500;
            else if (count === 6) score += 1000;
            else if (count === 7) score += 2000;
            else if (count === 8) score += 4000;
        });

        // Vérification si le joueur a tiré 3 têtes de mort ou plus
        if (this.tetes_de_mort >= 3) {
            score = 0; // Réinitialisation du score potentiel à 0
            console.log("Vous avez tiré 3 têtes de mort ou plus, score potentiel est maintenant 0.");
        }
    }

    // Attribution du score potentiel calculé à l'attribut de la classe
    this.scorePotentiel = score;

    // Affichage du score potentiel dans la console
    console.log("Score potentiel calculé :", this.scorePotentiel);

    // Affichage du score potentiel dans le div avec l'id scorePotentiel
    const scorePotentielDiv = document.getElementById('scorePotentiel');
    if (scorePotentielDiv) {
        scorePotentielDiv.textContent = this.scorePotentiel.toString();
    } else {
        console.error("L'élément avec l'id scorePotentiel n'a pas été trouvé.");
    }
}
ajouterScorePotentielAuScore() {
    this.score += this.scorePotentiel;
    this.scorePotentiel = 0; // Réinitialisation du score potentiel après l'ajout

    // Mettre à jour l'affichage du score total dans l'interface si nécessaire
    const scoreTotalDiv = document.getElementById('scoreTotal');
    if (scoreTotalDiv) {
        scoreTotalDiv.textContent = this.score.toString();
    } else {
        console.error("L'élément avec l'id scoreTotal n'a pas été trouvé.");
    }
}

}
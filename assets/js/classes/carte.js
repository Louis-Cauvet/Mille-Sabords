"use strict";

class Carte {
    constructor(nom) {
        this.nom = nom;
        this.appliquerEffet();
    }

    appliquerEffet() {
        switch (this.nom) {
            case 'pirate':
                playerTour.setBonusCapitaine(2);
                playerTour.setIndiceReduction(200);
                break
            case 'piece':
                playerTour.setPieces(1);
                this.addPieceToSavedDices();
                break
            case 'diamant':
                playerTour.setDiamants(1);
                this.addDiamantToSavedDices();
                break
            case 'bateau_300':
                playerTour.setObjectifBateau(2);
                playerTour.setScoreBateau(300);
                break
            case 'bateau_500':
                playerTour.setObjectifBateau(3);
                playerTour.setScoreBateau(500);
                break
            case 'bateau_1000':
                playerTour.setObjectifBateau(4);
                playerTour.setScoreBateau(1000);
                break
            case 'singe_perroquet':
                playerTour.setGroupeAnimaux(true);
                break
            case 'tete_de_mort_1':
                playerTour.setTetesDeMort(1);
                break
            case 'tete_de_mort_2':
                playerTour.setTetesDeMort(2);
                break
            case 'tresor':
                playerTour.setBanque(true);
                break
            case 'mage':
                playerTour.setVies(1);
                break
        }
    }

    addPieceToSavedDices() {
        console.log(savedDiceContainer);
    }

    addDiamantToSavedDices() {
        console.log(savedDiceContainer);
    }
}
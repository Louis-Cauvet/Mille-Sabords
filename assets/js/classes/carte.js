"use strict";

class Carte {
    constructor(nom) {
        this.nom = nom;
        this.appliquerEffet();
    }

    /*************************************
     Applying the drawn card's effect by the user and write its description on the card's back
     *************************************/
    appliquerEffet() {
        let textDescription = '';

        // Managing the different card effects
        switch (this.nom) {
            // "Pirate" card
            case 'pirate':
                playerTour.setBonusCapitaine(true);
                playerTour.setIndiceReduction(-200);
                textDescription =
                    'Tous les points obtenus durant ce tour sont doublés. Si le joueur doit se rendre sur l\'île de La ' +
                    'Tête-de-Mort, ses adversaires perdent 200 points pour chaque tête de mort révélée.';
                break;
            // "Piece" card
            case 'piece':
                playerTour.setPieces(1);
                this.addPieceToSavedDices();
                textDescription =
                    'Le joueur commence son tour avec un symbole pièce d\'or. Cette dernière rapporte des points à la ' +
                    'fois dans une combinaison de dés mais aussi comme simple pièce, soit 100 points.';
                break;
            // "Diamant" card
            case 'diamant':
                playerTour.setDiamants(1);
                this.addDiamantToSavedDices();
                textDescription =
                    'Le joueur commence son tour avec un symbole diamant. Ce dernier rapporte des points à la ' +
                    'fois dans une combinaison de dés mais aussi comme simple diamant, soit 100 points.';
                break;
            // "Bateau" card with a goal of 300
            case 'bateau_300':
                playerTour.setObjectifBateau(2);
                playerTour.setScoreBateau(300);
                textDescription =
                    'Si le joueur obtient au moins le même nombre de sabres que celui sur la carte, il reçoit le bonus' +
                    ' de points indiqué. S\'il échoue, il obtient zéro point et on lui retire le score indiqué sur la' +
                    ' carte. Sìl obtient 4 têtes de mort ou plus au premier lancer, il perd immédiatement le tour.';
                break;
            // "Bateau" card with a goal of 500
            case 'bateau_500':
                playerTour.setObjectifBateau(3);
                playerTour.setScoreBateau(500);
                textDescription =
                    'Si le joueur obtient au moins le même nombre de sabres que celui sur la carte, il reçoit le bonus' +
                    ' de points indiqué. S\'il échoue, il obtient zéro point et on lui retire le score indiqué sur la' +
                    ' carte. Sìl obtient 4 têtes de mort ou plus au premier lancer, il perd immédiatement le tour.';
                break;
            // "Bateau" card with a goal of 1000
            case 'bateau_1000':
                playerTour.setObjectifBateau(4);
                playerTour.setScoreBateau(1000);
                textDescription =
                    'Si le joueur obtient au moins le même nombre de sabres que celui sur la carte, il reçoit le bonus' +
                    ' de points indiqué. S\'il échoue, il obtient zéro point et on lui retire le score indiqué sur la' +
                    ' carte. Sìl obtient 4 têtes de mort ou plus au premier lancer, il perd immédiatement le tour.';
                break;
            // "Animaux" card
            case 'singe_perroquet':
                playerTour.setGroupeAnimaux(true);
                textDescription =
                    'Les singes et les perroquets obtenus sur les dés comptent comme même symbole dans une combinaison. ' +
                    'Par exemple, deux perroquets et trois singes forment une combinaison de 5 dés identiques, soit 500 points.';
                break;
            // "1 Tête de mort" card
            case 'tete_de_mort_1':
                playerTour.setTetesDeMort(1);
                this.addSkullToSavedDices(1);
                textDescription =
                    'Le tour du joueur débute avec un symbole tête de mort.';
                break;
            // "2 Têtes de mort" card
            case 'tete_de_mort_2':
                playerTour.setTetesDeMort(2);
                this.addSkullToSavedDices(2);
                textDescription =
                    'Le tour du joueur débute avec deux symboles tête de mort.';
                break;
            // "Trésor" card
            case 'tresor':
                playerTour.setBanque(true);
                textDescription =
                    'Après chaque lancer, les dés se trouvant dans la zone de sauvegarde sont considérés comme acquis : ' +
                    'même si le joueur obtient trois têtes de mort et que son tour s\'arrête, les points qu\'ils ' +
                    'concernent seront bien ajoutés à son score total.';
                break;
            // "Mage" card
            case 'mage':
                playerTour.setVies(1);
                textDescription =
                    'Pendant son tour, le joueur peut exceptionnellement relancer, une fois, un dé avec une tête de mort';
                break;
        }

        // Writing the new description in the card's back
        document.getElementById('card-description').innerHTML = textDescription;
    }


    /*************************************
     Adding dynamically a "Piece" dice in the save zone
     *************************************/
    addPieceToSavedDices() {
        let pieceDiceHtml = `<div id='dice9' class="dice show-4 saved-dice locked-dice" data-result="pieces">
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div class='side active' data-face="pieces">
                                            <img src="assets/img/face_dice/piece.png" alt="face piece">
                                        </div>
                                        <div></div>
                                        <div></div>
                                    </div>`;
        savedDiceContainer.innerHTML += pieceDiceHtml;
    }

    /*************************************
     Adding dynamically a "Diamant" dice in the save zone
     *************************************/
    addDiamantToSavedDices() {
        let pieceDiceHtml = `<div id='dice9' class="dice show-1 saved-dice locked-dice" data-result="diamants">
                                        <div class='side active' data-face="diamants">
                                            <img src="assets/img/face_dice/diamond.png" alt="face diamant">
                                        </div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>`;
        savedDiceContainer.innerHTML += pieceDiceHtml;
    }

    /*************************************
     Adding dynamically one or two "Tête de mort" dice(s) in the save zone
     *************************************/
    addSkullToSavedDices(skullsNumber) {
        let index  = 9;
        let skullDicesHtml = '';

        for (let i=1; i<=skullsNumber; i++) {
            skullDicesHtml += `<div id='dice${index}' class="dice show-3 saved-dice locked-dice" data-result="tetes_de_mort">
                                        <div></div>
                                        <div></div>
                                        <div class='side active' data-face="tetes_de_mort">
                                            <img src="assets/img/face_dice/tete_de_mort.png" alt="face tete de mort">
                                        </div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                    </div>`;
            index++;
        }
        savedDiceContainer.innerHTML += skullDicesHtml;
    }
}


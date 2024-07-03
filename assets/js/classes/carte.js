"use strict";

class Carte {
    constructor(nom) {
        this.nom = nom;
        this.appliquerEffet();
    }

    /*************************************
     Application de l'effet de la carte tirée par l'utilisateur et écriture de sa description
     *************************************/
    appliquerEffet() {
        let textDescription = '';
        switch (this.nom) {
            case 'pirate':
                playerTour.setBonusCapitaine(true);
                playerTour.setIndiceReduction(200);
                textDescription =
                    'Tous les points obtenus durant ce tour sont doublés. Si le joueur doit se rendre sur l\île de La ' +
                    'Tête-de-Mort, ses adversaires perdent 200 points pour chaque tête de mort révélée';
                break;
            case 'piece':
                playerTour.setPieces(1);
                this.addPieceToSavedDices();
                textDescription =
                    'Le joueur commence son tour avec un symbole pièce d\'or. Cette dernière rapporte des points à la ' +
                    'fois dans une combinaison de dés mais aussi comme simple pièce, soit 100 points';
                break;
            case 'diamant':
                playerTour.setDiamants(1);
                this.addDiamantToSavedDices();
                textDescription =
                    'Le joueur commence son tour avec un symbole diamant. Ce dernier rapporte des points à la ' +
                    'fois dans une combinaison de dés mais aussi comme simple diamant, soit 100 points';
                break;
            case 'bateau_300':
                playerTour.setObjectifBateau(2);
                playerTour.setScoreBateau(300);
                textDescription =
                    'Le joueur doit obtenir, au minimum, autant de sabres avec les dés que le nombre de symboles sur la ' +
                    'carte. S\'il y parvient, en plus de son résultat aux dés, il reçoit le bonus indiqué en bas de la ' +
                    'carte. Dans le cas contraire, le joueur obtient zéro point quelque soit son résultat aux dés, et ' +
                    'on lui retire de son score la valeur indiquée sur la carte. Celui qui tire cette carte et qui ' +
                    'obtient 4 têtes de mort ou plus lors de son premier lancer perd immédiatement son tour.';
                break;
            case 'bateau_500':
                playerTour.setObjectifBateau(3);
                playerTour.setScoreBateau(500);
                textDescription =
                    'Le joueur doit obtenir, au minimum, autant de sabres avec les dés que le nombre de symboles sur la ' +
                    'carte. S\'il y parvient, en plus de son résultat aux dés, il reçoit le bonus indiqué en bas de la ' +
                    'carte. Dans le cas contraire, le joueur obtient zéro point quelque soit son résultat aux dés, et ' +
                    'on lui retire de son score la valeur indiquée sur la carte. <br> Celui qui tire cette carte et qui ' +
                    'obtient 4 têtes de mort ou plus lors de son premier lancer perd immédiatement son tour.';
                break;
            case 'bateau_1000':
                playerTour.setObjectifBateau(4);
                playerTour.setScoreBateau(1000);
                textDescription =
                    'Le joueur doit obtenir, au minimum, autant de sabres avec les dés que le nombre de symboles sur la ' +
                    'carte. S\'il y parvient, en plus de son résultat aux dés, il reçoit le bonus indiqué en bas de la ' +
                    'carte. Dans le cas contraire, le joueur obtient zéro point quelque soit son résultat aux dés, et ' +
                    'on lui retire de son score la valeur indiquée sur la carte. Celui qui tire cette carte et qui ' +
                    'obtient 4 têtes de mort ou plus lors de son premier lancer perd immédiatement son tour.';
                break;
            case 'singe_perroquet':
                playerTour.setGroupeAnimaux(true);
                textDescription =
                    'Les singes et les perroquets obtenus sur les dés comptent comme même symbole dans une combinaison. ' +
                    'Par exemple, deux perroquets et trois singes forment une combinaison de 5 dés identiques, soit 500 points.';
                break;
            case 'tete_de_mort_1':
                playerTour.setTetesDeMort(1);
                this.addSkullToSavedDices(1);
                textDescription =
                    'Le tour du joueur débute avec un symbole tête de mort.';
                break;
            case 'tete_de_mort_2':
                playerTour.setTetesDeMort(2);
                this.addSkullToSavedDices(2);
                textDescription =
                    'Le tour du joueur débute avec deux symboles tête de mort.';
                break;
            case 'tresor':
                playerTour.setBanque(true);
                textDescription =
                    'Après chaque lancer, les dés se trouvant dans la zone de sauvegarde sont considérés comme acquis : ' +
                    'même si le joueur obtient trois têtes de mort et que son tour s\'arrête, les points qu\'ils ' +
                    'concernent seront bien ajoutés à son score total.';
                break;
            case 'mage':
                playerTour.setVies(1);
                textDescription =
                    'Pendant son tour, le joueur peut exceptionnellement relancer, une fois, un dé avec une tête de mort';
                break;
        }

        this.setCardDescription(textDescription);
    }

    /*************************************
     Ajout de la description de la carte dans son dos
     *************************************/
    setCardDescription(description) {
        document.getElementById('card-description').innerHTML = description
    }

    /*************************************
     Ajout d'un dé pièce automatiquement dans la zone de sauvegarde si le joueur tire la carte 'Pièce'
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
     Ajout d'un dé diamant automatiquement dans la zone de sauvegarde si le joueur tire la carte 'Diamant'
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
     Ajout d'un ou plusieurs dé(s) tête de mort automatiquement dans la zone de sauvegarde si le joueur tire la carte 'Tête de mort'
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


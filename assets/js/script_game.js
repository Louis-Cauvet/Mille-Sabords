"use strict";

/*************************************
 Variables globales
 *************************************/
const gameData = JSON.parse(localStorage.getItem('gameData'));     // données de la partie (choisies dans la page précédente)
let scores = [];     // Tableau de gestion des scores
let currentPlayerIndex = 0;   // Indice du joueur actuel
let finishedPlayerTour = false;   // Blocage du bouton de lancement des dés

const diceContainer = document.getElementById('rollingDiceContainer');
const savedDiceContainer = document.getElementById('savedDiceContainer');

const rollDiceButton = document.getElementById('rollDiceButton');

const potentialScore = document.getElementById('scorePotentiel');


/*************************************
 Affichage des données de la partie au chargement de la page
 *************************************/
document.addEventListener('DOMContentLoaded', () => {
    const maxPointsInfo = document.getElementById('goalNumber');
    const playerList = document.getElementById('playersList');

    // on affiche les noms des joueurs et leurs scores, ainsi que l'objectif de points à atteindre
    if (gameData) {
        maxPointsInfo.textContent = `Objectif : ${gameData.maxPoints}`;
        gameData.players.forEach(player => {
            scores.push(0);
            const li = document.createElement('li');
            li.textContent = `${player} - Score: ${scores[scores.length - 1]}`;
            playerList.appendChild(li);
        });
    } else {
        alert('Les données de la partie n\'ont pas été trouvées');
    }

    // on démarre le tour du premier joueur
    startPlayerTour();
});


/*************************************
 Démarrage du nouveau tour d'un joueur
 *************************************/
function startPlayerTour() {
    // On ajoute la variable de tour de manière globale (en l'attachant à 'window') pour pouvoir y accéder de partout
    window.playerTour = new Tour();

    // on réinitalise les informations qui ont pu apparaître durant le tour précédent
    document.getElementById('messageContainer').classList.remove('visible');
    potentialScore.textContent = '0';
    rollDiceButton.disabled = false;
    finishedPlayerTour = false;

    highlightActiveUser(currentPlayerIndex);

    drawCard();

    insertDices();
}


/*************************************
 Indication visuelle de l'utilisateur en train de jouer
 *************************************/
function highlightActiveUser(index) {
    const playerItems = document.querySelectorAll('#playersList li');

    playerItems.forEach(item => {
        item.classList.remove('active-user');
    });

    playerItems[index].classList.add('active-user');
}


/*************************************
 Tirage d'une carte de manière aléatoire
 *************************************/
function drawCard() {
    const images = [
        'pirate',
        'pirate',
        'pirate',
        'pirate',
        'piece',
        'piece',
        'piece',
        'piece',
        'diamant',
        'diamant',
        'diamant',
        'diamant',
        'bateau_300',
        'bateau_300',
        'bateau_500',
        'bateau_500',
        'bateau_1000',
        'bateau_1000',
        'singe_perroquet',
        'singe_perroquet',
        'singe_perroquet',
        'singe_perroquet',
        'tete_de_mort_1',
        'tete_de_mort_1',
        'tete_de_mort_1',
        'tete_de_mort_2',
        'tete_de_mort_2',
        'tresor',
        'tresor',
        'tresor',
        'tresor',
        'mage',
        'mage',
        'mage',
        'mage',
    ];
    // On tire au sort une carte
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.getElementById('randomImage').src = `assets/img/cards/${randomImage}.jpg`;

    // On ajoute la variable de carte de manière globale (en l'attachant à 'window') pour pouvoir y accéder de partout
    window.playerCard = new Carte(randomImage);

    // On définit la carte tirée, et on applique son effet
    playerTour.setCarteTiree(playerCard);
}


/*************************************
 Génération et affichage des 8 dés pour le premier lancement
 *************************************/
// Générer les 8 dés pour le premier lancement
function insertDices() {
    for (let i=1; i<=8 ; i++) {
        let newDiceHtml = `<div id='dice${i}' class="dice">
                                        <div class='side' data-face="diamants">
                                            <img src="assets/img/face_dice/diamond.png" alt="face diamant">
                                        </div>
                                        <div class='side' data-face="perroquets">
                                            <img src="assets/img/face_dice/perroquet.png" alt="face perroquet">
                                        </div>
                                        <div class='side' data-face="tetes_de_mort">
                                            <img src="assets/img/face_dice/tete_de_mort.png" alt="face tete de mort">
                                        </div>
                                        <div class='side' data-face="pieces">
                                            <img src="assets/img/face_dice/piece.png" alt="face piece">
                                        </div>
                                        <div class='side' data-face="epees">
                                            <img src="assets/img/face_dice/epee.png" alt="face epee">
                                        </div>
                                        <div class='side' data-face="singes">
                                            <img src="assets/img/face_dice/singe.png" alt="face singe">
                                        </div>
                                    </div>`;
        diceContainer.innerHTML += newDiceHtml;
    }
}


/*************************************
 Ouverture d'une modale
 *************************************/
function openModal(modalId) {
    document.getElementById(modalId).classList.add('visible');
}


/*************************************
 Fermeture d'une modale
 *************************************/
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('visible');
}


/*************************************
 Lancement des dés de la zone de relance
 *************************************/
 function rollDice() {
    // on vérifie qu'il y a plus d'un dé dans la zone de relance
    if (diceContainer.querySelectorAll('.dice').length > 1) {

        // on bloque le clic du bouton pendant le lancement
        rollDiceButton.disabled = true;

        // on initialise un objet pour compter les occurrences de chaque type de dé
        const diceTypeCount = {
            diamants: 0,
            perroquets: 0,
            tetes_de_mort: 0,
            pieces: 0,
            epees: 0,
            singes: 0
        };

        const dicesToRoll = diceContainer.querySelectorAll('.dice');

        dicesToRoll.forEach(dice => {
            // On récupère une face de manière aléatoire pour chaque dé, et on fait en sorte qu'il tombe dessus (avec la classe 'show-*')
            const rollingIndex = Math.floor((Math.random() * 6) + 1);
            for (let i = 1; i <= 6; i++) {
                dice.classList.remove('show-' + i);
                if (rollingIndex === i) {
                    dice.classList.add('show-' + i);
                }
            }

            // On rend actif la face tirée au sort sur chaque dé
            dice.querySelectorAll('.side').forEach(side => {
                side.classList.remove('active');
            });
            dice.querySelector(`.side:nth-child(${rollingIndex})`).classList.add('active');

            // On incrémente le compteur du type de face correspondant à celle obtenue pour les dés de la zone de relance
            dice.dataset.result = dice.querySelector(`.side.active`).dataset.face;
            diceTypeCount[dice.dataset.result]++;

            // on fixe un délai pour laisser le temps à l'animation de s'exécuter entièrement avant le tri des dés
            setTimeout(function() {
                if (dice.dataset.result === 'tetes_de_mort') {
                    // on ajoute automatiquement le dé tête de mort à l'espace de sauvegarde et on le verrouille
                    dice.classList.add('saved-dice', 'locked-dice');
                    savedDiceContainer.appendChild(dice);

                    // si ce n'est pas le premier tour, on vérifie que l'utilisateur possède moins de 3 dés têtes de mort
                    if (playerTour.getNbLancers() > 1){
                        checkSkull();
                    }
                } else if(finishedPlayerTour == false) {
                    dice.onclick = function () {
                        // on ajoute le dé choisi par l'utilisateur à l'espace de sauvegarde
                        if (!dice.classList.contains('saved-dice')) {
                            saveDice(dice);
                        } else {
                            unsaveDice(dice);
                        }
                    };

                    diceContainer.appendChild(dice);
                }

                if (finishedPlayerTour === false){
                    rollDiceButton.disabled = false;
                }
            }, 1500);
        });

        // playerTour.mettreAJour(diceTypeCount);

        // On vérifie si le joueur à obtenu au moins 4 têtes de morts au premier lancer, et on passe en mode 'Ile de la Tête de Mort' si c'est le cas
        if (playerTour.getNbLancers() === 1) {
            if(diceTypeCount['tetes_de_mort'] >= 4) {
                setTimeout(function() {
                    document.body.style.backgroundColor = 'black';
                    document.getElementById('iledelamort').innerHTML = 'Ile de la mort !';
                    rollDiceButton.onclick = rollDiceDeadIsland;
                }, 1500);
            } else {
                checkSkull();
            }
        }

        // Si le joueur a pioché la carte du Mage, on lui accorde une change supplémentaire
        if (playerTour.getVies() > 0) {
            playerTour.replaceSkullDice();
        }

        // on incrémente le nombre de lancers de 1
        playerTour.setNbLancers(playerTour.getNbLancers() + 1);

        // On incrémente le compteur du type de face correspondant à celle obtenue pour les dés de la zone de sauvegarde
        const dicesToSave = savedDiceContainer.querySelectorAll('.saved-dice');
        dicesToSave.forEach(diceSaved => {
            diceTypeCount[diceSaved.dataset.result]++;
        });

        // On met à jour les données des dés du tour pour le calcul du score potentiel
        playerTour.setTetesDeMort(diceTypeCount.tetes_de_mort);
        playerTour.setSinges(diceTypeCount.singes);
        playerTour.setPerroquets(diceTypeCount.perroquets);
        playerTour.setDiamants(diceTypeCount.diamants);
        playerTour.setPieces(diceTypeCount.pieces);
        playerTour.setEpees(diceTypeCount.epees);

        // On calcule le score potentiel du joueur si il s'arrête à ce lancer
        playerTour.calculerScorePotentiel();
        console.log(playerTour);
    } else {
        alert("Vous ne pouvez pas relancer avec un seul dé dans votre zone de relance !")
    }
}

/*************************************
 Lancement des dès dans l'ile de la mort
 *************************************/
function rollDiceDeadIsland(){
    console.log('test');
}

/*************************************
 Vérification du nombre de tête de morts dans la zone de sauvegarde
 *************************************/
function checkSkull() {
    if (playerTour.getTetesDeMort() >= 3) {
        // si l'utilisateur a cumulé plus de 3 dés têtes de mort, on force son tour à s'achever
        finishedPlayerTour = true;
        rollDiceButton.disabled = true;

        // Si l'utilisateur n'a pas tiré la carte 'Trésor' et qu'il n'a pas un score négatif, on repasse à son score potentiel à 0
        if (playerTour.getBanque() === false || playerTour.getScorePotentiel() > 0) {
            playerTour.setScorePotentiel(0);
            potentialScore.textContent = playerTour.scorePotentiel.toString();
        }

        document.getElementById('messageContainer').classList.add('visible');
        document.querySelectorAll('.dice-container .overlay').forEach(overlay => {
            overlay.classList.add('active');
        })
    }
}

/*************************************
 Ajout d'un dé dans la zone de sauvegarde
 *************************************/
function saveDice(diceElement) {
    if (savedDiceContainer.children.length < 8) {
        diceElement.classList.add('saved-dice');
        savedDiceContainer.appendChild(diceElement);
    }
}


/*************************************
 Retrait d'un dé dans la zone de sauvegarde, pour le remettre dans la zone de relance
 *************************************/
function unsaveDice(diceElement) {
    if (savedDiceContainer.children.length > 1) {
        diceElement.classList.remove('saved-dice');
        diceContainer.appendChild(diceElement);
    } 
}

/*************************************
 Passage au tour suivant demandé par le joueur
 *************************************/
function nextTurn() {

    // On ajoute le score potentiel du lancer au score total du joueur
    scores[currentPlayerIndex] += playerTour.scorePotentiel;

    // On remet le score à 0 si il est sensé être négatif
    if (scores[currentPlayerIndex]<0) {
        scores[currentPlayerIndex] = 0;
    }

    // On remet à zéro le score potentiel
    playerTour.scorePotentiel = 0;

    // On met à jour l'affichage du score du joueur
    const playerListItems = document.querySelectorAll('#playersList li');
    playerListItems[currentPlayerIndex].textContent = `${gameData.players[currentPlayerIndex]} - Score: ${scores[currentPlayerIndex]}`;

    // On passe au joueur suivant dans la liste
    currentPlayerIndex = (currentPlayerIndex + 1) % gameData.players.length;

    // On vide les zones à dés
    diceContainer.innerHTML = '';
    savedDiceContainer.innerHTML = '';

    // On débute le tour du joueur suivant
    startPlayerTour();
}
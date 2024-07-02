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


/*************************************
 Affichage des données de partie au chargement de la page
 *************************************/
document.addEventListener('DOMContentLoaded', () => {
    const maxPointsInfo = document.getElementById('goalNumber');
    const playerList = document.getElementById('playersList');

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

    startPlayerTour();
});

/*************************************
 Démarrage du nouveau tour d'un joueur
 *************************************/
function startPlayerTour() {
    window.playerTour = new Tour();     // On ajoute la variable de tour de manière globale (en l'attachant à 'window') pour pouvoir y accéder de partout

    document.getElementById('messageContainer').classList.remove('visible');
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
        'piece',
        'diamant',
        'bateau_300',
        'bateau_500',
        'bateau_1000',
        'singe_perroquet',
        'tete_de_mort_1',
        'tete_de_mort_2',
        'tresor',
        'mage',
    ];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.getElementById('randomImage').src = `assets/img/cards/${randomImage}.jpg`;

    window.playerCard = new Carte(randomImage);

    // On définit la carte tirée, et on applique son effet
    playerTour.setCarteTiree(playerCard);

    console.log(playerTour);
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
    console.log(playerTour.getnblancers());
    if (diceContainer.querySelectorAll('.dice').length > 1) {
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
            // On récupère une face de manière aléatoire pour chaque dé, et on fait en sorte qu'il tombe dessus
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

            // On incrémente le compteur du type de face correspondant à celle obtenue
            dice.dataset.result = dice.querySelector(`.side.active`).dataset.face;
            diceTypeCount[dice.dataset.result]++;

            // on fixe un délai pour laisser le temps à l'animation de s'exécuter entièrement avant le tri des dés
            setTimeout(function() {
                if (dice.dataset.result === 'tetes_de_mort') {
                    // on ajoute automatiquement le dé tête de mort à l'espace de sauvegarde et on le verrouille
                    dice.classList.add('saved-dice', 'locked-dice');
                    savedDiceContainer.appendChild(dice);
                    console.log(playerTour.getnblancers());
                    if (playerTour.getnblancers() > 1){
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


        console.log(diceTypeCount);
        window.playerTour.mettreAJour(diceTypeCount);
        console.log(playerTour);

        // Vérifie les 4 têtes de mort au premier lancer
        if ( playerTour.getnblancers() === 1) {
            if( diceTypeCount['tetes_de_mort'] >= 4) {
                setTimeout(function() {
                    document.body.style.backgroundColor = 'black';
                    document.getElementById('iledelamort').innerHTML = 'Ile de la mort !';
                    rollDiceButton.onclick = rollDiceDeadIsland;
                }, 1500);
            }
        } else {
            checkSkull();
        }
if (playerTour.getCarteTiree().nom === 'mage') {
        playerTour.replaceSkullDice(); // Remettre un dé tête de mort dans la zone de non sauvegarde
    }
        // Incrémente le nombre de lancers
        playerTour.setnblancers(playerTour.getnblancers() + 1);

        const dicestoSave = savedDiceContainer.querySelectorAll('.saved-dice');
        dicestoSave.forEach(diceSaved => {
            diceTypeCount[diceSaved.dataset.result]++;
        });

        // Mise à jour de playerTour avec diceTypeCount
        playerTour.setTetesDeMort(diceTypeCount.tetes_de_mort);
        playerTour.setSinges(diceTypeCount.singes);
        playerTour.setPerroquets(diceTypeCount.perroquets);
        playerTour.setDiamants(diceTypeCount.diamants);
        playerTour.setPieces(diceTypeCount.pieces);
        playerTour.setEpees(diceTypeCount.epees);

        console.log(playerTour);
        // Calcul du score potentiel mis à jour
        playerTour.calculerScorePotentiel();

        // Affichage du score potentiel dans la console
        console.log("Score potentiel après ce lancer :", playerTour.scorePotentiel);
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
    if (window.playerTour.getTetesDeMort() >= 3) {
        finishedPlayerTour = true;
        rollDiceButton.disabled = true;
        document.getElementById('messageContainer').classList.add('visible');
        document.querySelectorAll('.dice-container .overlay').forEach(overlay => {
            overlay.classList.add('active');
        })
    }
}

/*************************************
 L'ile de la mort : 4 tête de morts au premier lancer
 *************************************/
 function check4Skull(diceTypeCount) {
    console.log(diceTypeCount['tetes_de_mort']);
    if (diceTypeCount['tetes_de_mort'] >= 4) {
        // Passe au mode île de la mort
        document.body.style.backgroundColor = 'black';
        alert("Vous êtes envoyé sur l'île de la mort !");
        // Config
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
        diceContainer.appendChild(diceElement); // Déplacer le dé vers le conteneur principal de dés
    } else {
        alert('Vous devez toujours avoir au moins 1 dé dans la zone de sauvegarde !');
    }
}

/*************************************
 Passage au tour suivant demandé par le joueur
 *************************************/
function nextTurn() {
    if (playerTour.tetes_de_mort < 3) {
        // Ajouter le score potentiel au score total du joueur
        scores[currentPlayerIndex] += playerTour.scorePotentiel;
    } else {
        // Si le joueur a tiré 3 têtes de mort, il perd les points potentiels
        playerTour.scorePotentiel = 0;
    }

    // Remise à zéro du score potentiel
    playerTour.scorePotentiel = 0;

    const playerListItems = document.querySelectorAll('#playersList li');
    playerListItems[currentPlayerIndex].textContent = `${gameData.players[currentPlayerIndex]} - Score: ${scores[currentPlayerIndex]}`;

    currentPlayerIndex = (currentPlayerIndex + 1) % gameData.players.length;

    // Vider les dés
    diceContainer.innerHTML = '';
    savedDiceContainer.innerHTML = '';

    startPlayerTour();
}



//
//
// const cartes = {
//     teteDeMort: new Carte("Tête de Mort", (tour) => tour.ajouterTeteDeMort(1)),
//     teteDeMort2: new Carte("Tête de Mort 2", (tour) => tour.ajouterTeteDeMort(2)),
//     piece: new Carte("Pièce", (tour) => tour.ajouterPiece(1)),
//     diamant: new Carte("Diamant", (tour) => tour.ajouterDiamond(1)),
//     gardienne: new Carte("Gardienne", (tour) => tour.ajouterVie(1)),
//     bateau: new Carte("Bateau", (tour) => tour.objectif = "Atteindre un objectif"),
//     pirate: new Carte("Pirate", (tour) => tour.multiplier *= 2),
//     ileAuTresor: new Carte("L'île au Trésor", (tour) => tour.banque += tour.getPieces() + tour.getDiamonds()),
// };
//
// function lancerDe() {
//     const de = new De();
//     return de.lancer();
// }
//
// function lancer8Des() {
//     const de = new De();
//     const resultats = {
//         Singe: 0,
//         Diamond: 0,
//         Piece: 0,
//         'Tete de mort': 0,
//         Perroquet: 0,
//         Epee: 0
//     };
//
//     for (let i = 0; i < 8; i++) {
//         const resultat = de.lancer();
//         resultats[resultat]++;
//     }
//
//     return resultats;
// }
//
// function afficherResultatsDes(resultats) {
//     const resultatsDiv = document.getElementById('resultatsDes');
//     resultatsDiv.innerHTML = '<h2>Résultats des Dés</h2>';
//     for (const [face, count] of Object.entries(resultats)) {
//         resultatsDiv.innerHTML += <span>${face}: ${count}</span>;
//     }
// }
//
// function afficherEtatTour(tour) {
//     const etatTourDiv = document.getElementById('etatTour');
//     etatTourDiv.innerHTML = '<h2>État du Tour</h2>';
//     etatTourDiv.innerHTML += <span>Têtes de Mort: ${tour.getTetesDeMort()}</span>;
//     etatTourDiv.innerHTML += <span>Singes: ${tour.getSinges()}</span>;
//     etatTourDiv.innerHTML += <span>Perroquets: ${tour.getPerroquets()}</span>;
//     etatTourDiv.innerHTML += <span>Diamants: ${tour.getDiamonds()}</span>;
//     etatTourDiv.innerHTML += <span>Pièces: ${tour.getPieces()}</span>;
//     etatTourDiv.innerHTML += <span>Vies: ${tour.getVies()}</span>;
//     etatTourDiv.innerHTML += <span>Banque: ${tour.getBanque()}</span>;
//     etatTourDiv.innerHTML += <span>Objectif: ${tour.getObjectif() ? tour.getObjectif() : 'Aucun'}</span>;
//     etatTourDiv.innerHTML += <span>Multiplicateur: x${tour.getMultiplier()}</span>;
//     etatTourDiv.innerHTML += <span>Carte Tirée: ${tour.carteTiree ? tour.carteTiree.nom : 'Aucune'}</span>; // Afficher la carte tirée
// }
//
//
// function lancerDes() {
//     const resultats = lancer8Des();
//     afficherResultatsDes(resultats);
//     monTour.mettreAJour(resultats);
//
//     const carteTiree = tirerCarteAleatoire();
//     carteTiree.appliquerEffet(monTour);
//     monTour.setCarteTiree(carteTiree); // Mettre à jour la carte tirée
//     afficherCarteTiree(carteTiree);
//
//     afficherEtatTour(monTour);
// }
//
//
// function appliquerCarte(nomCarte) {
//     const carte = cartes[nomCarte];
//     if (carte) {
//         monTour.appliquerCarte(carte);
//         afficherEtatTour(monTour);
//     } else {
//         alert('Carte non trouvée!');
//     }
// }
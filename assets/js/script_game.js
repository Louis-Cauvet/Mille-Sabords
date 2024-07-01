"use strict";

let gameData;
let scores = [];
let currentPlayerIndex = 0;
let diceCount = 0; // Nombre total de dés affichés

// Afficher les données de partie au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    gameData = JSON.parse(localStorage.getItem('gameData'));
    const maxPointsInfo = document.getElementById('goalNumber');
    const playerList = document.getElementById('playersList');

    if (gameData) {
        maxPointsInfo.textContent = `Points maximum: ${gameData.maxPoints}`;
        gameData.players.forEach(player => {
            scores.push(0);
            const li = document.createElement('li');
            li.textContent = `${player} - Score: ${scores[scores.length - 1]}`;
            playerList.appendChild(li);
        });
    } else {
        alert('Les données de la partie n\'ont pas été trouvées');
    }

    highlightActiveUser(currentPlayerIndex);

    insertDices();
});


// Mettre en avant l'utilisateur en train d'effectuer son tour (passé en paramètres)
function highlightActiveUser(index) {
    const playerItems = document.querySelectorAll('#playersList li');

    playerItems.forEach(item => {
        item.classList.remove('active-user');
    });

    playerItems[index].classList.add('active-user');
}


// Générer les 8 dés pour le premier lancement
function insertDices() {
    const diceContainer=  document.getElementById('rollingDiceContainer');
    for (let i=1; i<=8 ; i++) {
        let newDiceHtml = `<div id='dice${i}' class="dice dice-one">
                                        <div class='side' data-face="diamant">
                                            <img src="assets/img/face_dice/diamond.png" alt="face diamant">
                                        </div>
                                        <div class='side' data-face="perroquet">
                                            <img src="assets/img/face_dice/perroquet.png" alt="face perroquet">
                                        </div>
                                        <div class='side' data-face="tete-de-mort">
                                            <img src="assets/img/face_dice/tete_de_mort.png" alt="face tete de mort">
                                        </div>
                                        <div class='side' data-face="piece">
                                            <img src="assets/img/face_dice/piece.png" alt="face piece">
                                        </div>
                                        <div class='side' data-face="epee">
                                            <img src="assets/img/face_dice/epee.png" alt="face epee">
                                        </div>
                                        <div class='side' data-face="singe">
                                            <img src="assets/img/face_dice/singe.png" alt="face singe">
                                        </div>
                                    </div>`;
        diceContainer.innerHTML += newDiceHtml;
    }
}

// Ouvrir une modale
function openModal(modalId) {
    document.getElementById(modalId).classList.add('visible');
}

// Fermer une modale
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('visible');
}

// Lancer les dés
function rollDice() {
    const diceContainer = document.getElementById('rollingDiceContainer');
    const savedDiceContainer = document.getElementById('rollButton');

    const dicesToRoll = diceContainer.querySelectorAll('.dice');
    dicesToRoll.forEach(dice => {
        const rollingIndex = Math.floor((Math.random() * 6) + 1);

        for (let i = 1; i <= 6; i++) {
            dice.classList.remove('show-' + i);
            if (rollingIndex === i) {
                dice.classList.add('show-' + i);
            }
        }

        dice.dataset.result = rollingIndex;
    });

    // // Images des faces de dés disponibles
    // const diceFaces = [
    //     'diamond',
    //     'singe',
    //     'piece',
    //     'tete_de_mort',
    //     'perroquet',
    //     'epee'
    // ];
    //
    // // Liste des dés sauvegardés
    // const savedDice = Array.from(savedDiceContainer.children);
    //
    // // Initialiser un objet pour compter les occurrences de chaque type de dé
    // const diceCount = {
    //     diamond: 0,
    //     singe: 0,
    //     piece: 0,
    //     tete_de_mort: 0,
    //     perroquet: 0,
    //     epee: 0
    // };
    //
    // // Générer et afficher les dés non sauvegardés avec des images aléatoires
    // for (let i = 0; i < 8 - savedDice.length; i++) {
    //     const randomIndex = Math.floor(Math.random() * diceFaces.length);
    //     const diceFace = diceFaces[randomIndex];
    //
    //     // Incrémenter le compteur pour ce type de dé
    //     diceCount[diceFace]++;
    //
    //     const diceElement = document.createElement('div');
    //     diceElement.classList.add('dice');
    //     diceElement.style.backgroundImage = `url("assets/img/face_dice/${diceFace}.png")`;
    //
    //     // Vérifier si le dé est une tête de mort
    //     if (diceFace.includes('tete_de_mort')) {
    //         diceElement.classList.add('tete-de-mort-dice'); // Ajouter la classe pour indiquer que le dé est une tête de mort
    //         diceElement.classList.add('saved-dice', 'locked-dice'); // Verrouiller le dé tête de mort
    //         savedDiceContainer.appendChild(diceElement); // Ajouter directement au conteneur de dés sauvegardés
    //     } else {
    //         diceElement.onclick = function () {
    //             if (!diceElement.classList.contains('saved-dice')) {
    //                 saveDice(diceElement);
    //             } else {
    //                 unsaveDice(diceElement);
    //             }
    //         };
    //
    //         diceContainer.appendChild(diceElement);
    //     }
    // }
    //
    // // Afficher les résultats du comptage dans la console
    // const MonTour = new Tour();
    // MonTour.tetesDeMort = diceCount['tete_de_mort'];
    // MonTour.diamonds = diceCount['diamond'];
    // MonTour.pieces = diceCount['piece'];
    // MonTour.singes = diceCount['singe'];
    // MonTour.perroquets = diceCount['perroquet'];
    // MonTour.Epee = diceCount['epee'];
    // console.log(MonTour);
    //
    //
    // // Mettre à jour le nombre total de dés affichés
    // const totalDiceCount = diceContainer.children.length + savedDice.length;
    // console.log('Nombre total de dés affichés:', totalDiceCount);
    //
    // checkSkull(); // Vérifier s'il y a trois têtes de mort dans les dés sauvegardés après chaque sauvegarde de dé
}

// function nextTurn() {
//     const images = [
//         'pirate',
//         'piece',
//         'diamant',
//         'bateau_300',
//         'bateau_500',
//         'bateau_1000',
//         'singe_perroquet',
//         'tete_de_mort_1',
//         'tete_de_mort_2',
//         'tresor',
//         'mage',
//     ];
//     const randomImage = images[Math.floor(Math.random() * images.length)];
//     document.getElementById('randomImage').src = `assets/img/${randomImage}.jpg` ;
//     const pointsToAdd = Math.floor(Math.random() * 10) + 1;
//     scores[currentPlayerIndex] += pointsToAdd;
//
//     const playerListItems = document.querySelectorAll('#playerList li');
//     playerListItems[currentPlayerIndex].textContent = `${gameData.players[currentPlayerIndex]} - Score: ${scores[currentPlayerIndex]}`;
//
//     currentPlayerIndex = (currentPlayerIndex + 1) % gameData.players.length;
//     highlightActiveUser(currentPlayerIndex);
//
//     // Vider les dés
//     document.getElementById('diceContainer').innerHTML = '';
//     document.getElementById('savedDiceContainer').innerHTML = '';
//
//     checkSkull(); // Vérifier s'il y a trois têtes de mort dans les dés sauvegardés
// }
//
// function saveDice(diceElement) {
//     const savedDiceContainer = document.getElementById('savedDiceContainer');
//
//     // Vérifier si le nombre de dés sauvegardés est inférieur à 8
//     if (savedDiceContainer.children.length < 8) {
//         diceElement.classList.add('saved-dice'); // Ajouter la classe pour indiquer que le dé est sauvegardé
//         savedDiceContainer.appendChild(diceElement); // Déplacer le dé vers le conteneur de dés sauvegardés
//
//         checkSkull(); // Vérifier s'il y a trois têtes de mort dans les dés sauvegardés après chaque sauvegarde de dé
//     }
// }
//
// function unsaveDice(diceElement) {
//     const diceContainer = document.getElementById('diceContainer');
//     diceElement.classList.remove('saved-dice'); // Retirer la classe pour indiquer que le dé n'est plus sauvegardé
//     diceContainer.appendChild(diceElement); // Déplacer le dé vers le conteneur principal de dés
//
//     checkSkull(); // Vérifier s'il y a trois têtes de mort dans les dés sauvegardés après chaque dé-sauvegarde de dé
// }
//
// function checkSkull() {
//     const savedDiceContainer = document.getElementById('savedDiceContainer');
//     const rollDiceButton = document.querySelector('button[onclick="rollDice()"]');
//
//     if (savedDiceContainer.querySelectorAll('.locked-dice').length >= 3) {
//         document.getElementById('messageContainer').style.display = 'block'; // Afficher le message
//         rollDiceButton.disabled = true; // Désactiver le bouton de lancer de dés
//     } else {
//         document.getElementById('messageContainer').style.display = 'none'; // Masquer le message
//         rollDiceButton.disabled = false; // Activer le bouton de lancer de dés
//     }
// }
//
// class Tour {
//     constructor() {
//         this.tetesDeMort = 0;
//         this.singes = 0;
//         this.perroquets = 0;
//         this.diamonds = 0;
//         this.pieces = 0;
//         this.Epee = 0;
//         this.vies = 1;
//         this.banque = 0;
//         this.objectif = null;
//         this.multiplier = 1;
//         this.carteTiree = null;
//         console.log('ZABI');
//     }
//
//     setCarteTiree(carte) {
//         this.carteTiree = carte;
//     }
//
//     ajouterTeteDeMort(nombre = 1) {
//         this.tetesDeMort += nombre;
//     }
//
//     ajouterSinge(nombre = 1) {
//         this.singes += nombre;
//     }
//
//     ajouterPerroquet(nombre = 1) {
//         this.perroquets += nombre;
//     }
//
//     ajouterDiamond(nombre = 1) {
//         this.diamonds += nombre;
//     }
//
//     ajouterPiece(nombre = 1) {
//         this.pieces += nombre;
//     }
//
//     ajouterVie(nombre = 1) {
//         this.vies += nombre;
//     }
//
//     appliquerCarte(carte) {
//         carte.appliquerEffet(this);
//     }
//
//     reset() {
//         this.tetesDeMort = 0;
//         this.singes = 0;
//         this.perroquets = 0;
//         this.diamonds = 0;
//         this.pieces = 0;
//         this.pieces = 0;
//         this.vies = 1;
//         this.banque = 0;
//         this.objectif = null;
//         this.multiplier = 1;
//     }
//
//     mettreAJour(resultats) {
//         this.tetesDeMort += resultats['Tete de mort'];
//         this.singes += resultats['Singe'];
//         this.perroquets += resultats['Perroquet'];
//         this.diamonds += resultats['Diamond'];
//         this.pieces += resultats['Piece'];
//         this.Epee += resultats['Epee'];
//     }
//
//     getTetesDeMort() {
//         return this.tetesDeMort;
//     }
//
//     getSinges() {
//         return this.singes;
//     }
//
//     getPerroquets() {
//         return this.perroquets;
//     }
//
//     getDiamonds() {
//         return this.diamonds;
//     }
//
//     getPieces() {
//         return this.pieces;
//     }
//
//     getVies() {
//         return this.vies;
//     }
//
//     getBanque() {
//         return this.banque;
//     }
//
//     getObjectif() {
//         return this.objectif;
//     }
//
//     getMultiplier() {
//         return this.multiplier;
//     }
// }
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
// const monTour = new Tour();
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
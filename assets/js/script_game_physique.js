"use strict";

/*************************************
 Variables globales
 *************************************/
const gameData = JSON.parse(localStorage.getItem('gameData'));
let scores = [];
let currentPlayerIndex = 0;
let finishedPlayerTour = false;
let extraTurns = false;
let playerWhoReachedGoal = -1;
let extraTurnsCount = 0;

let savedDiceContainer; // Déclaration de savedDiceContainer ici

/*************************************
 Affichage des données de la partie au chargement de la page
 *************************************/
document.addEventListener('DOMContentLoaded', () => {
    const maxPointsInfo = document.getElementById('goalNumber');
    const playerList = document.getElementById('playersList');
    savedDiceContainer = document.getElementById('scorePotentiel'); // Assignation de savedDiceContainer ici

    if (gameData) {
        if(gameData["modeAnimals"] === true) {
            document.getElementById('playersList').classList.add('as--animals');
        }

        maxPointsInfo.textContent = `Objectif : ${gameData.maxPoints}`;
        gameData.players.forEach(player => {
            scores.push(0);
            const li = document.createElement('li');
            li.textContent = `${player} - Score: ${scores[scores.length - 1]}`;
            playerList.appendChild(li);

            const playerImg = document.createElement('div');
            playerImg.className = 'player-image';

            li.appendChild(playerImg);
        });
    } else {
        alert('Les données de la partie n\'ont pas été trouvées');
    }

    startPlayerTour(); // Commencer le tour du premier joueur
});

/*************************************
 Démarrage du nouveau tour d'un joueur
 *************************************/
function startPlayerTour() {
    window.playerTour = new Tour();
    savedDiceContainer.textContent = '0'; // Utilisation de savedDiceContainer ici
    resetDiceInputs(); // Réinitialiser les valeurs des inputs des dés à zéro
    finishedPlayerTour = false;
    highlightActiveUser(currentPlayerIndex);
    drawCard();

    const diceInputs = document.querySelectorAll('.dice-input');
    diceInputs.forEach(input => {
        input.addEventListener('change', (event) => {
            const inputId = event.target.id;
            const inputValue = parseInt(event.target.value, 10);
            // Mettre à jour l'objet Tour en fonction des changements d'entrée
            updatePlayerTour(inputId, inputValue);
        });
    });
}

function checkTotalDiceInputs() {
    const diceInputs = document.querySelectorAll('.dice-input');
    let total = 0;
    let allInputsFilled = true;

    // Déterminer le total attendu en fonction de la carte tirée
    let expectedTotal;
    switch (playerTour.getCarteTiree().nom) {
        case 'piece':
        case 'diamant':
        case 'tete_de_mort_1':
            expectedTotal = 9;
            break;
        case 'tete_de_mort_2':
            expectedTotal = 10;
            break;
        default:
            expectedTotal = 8;
    }

    // Calculer le total actuel des inputs
    diceInputs.forEach(input => {
        const inputValue = parseInt(input.value, 10);
        if (isNaN(inputValue)) {
            allInputsFilled = false;
        } else {
            total += inputValue;
        }
    });

    // Vérifier si tous les inputs sont remplis et si le total correspond à celui attendu
    return allInputsFilled && total === expectedTotal;
}



/*************************************
 Fonction pour tirer une carte
 *************************************/
function drawCard() {
    const images = [
        'pirate', 'pirate', 'pirate', 'pirate',
        'piece', 'piece', 'piece', 'piece',
        'diamant', 'diamant', 'diamant', 'diamant',
        'bateau_300', 'bateau_300', 'bateau_500', 'bateau_500',
        'bateau_1000', 'bateau_1000', 'singe_perroquet', 'singe_perroquet',
        'singe_perroquet', 'singe_perroquet', 'tete_de_mort_1', 'tete_de_mort_1',
        'tete_de_mort_1', 'tete_de_mort_2', 'tete_de_mort_2', 'tresor', 'tresor',
        'tresor', 'tresor', 'mage', 'mage', 'mage', 'mage'
    ];

    const backgroundImages = {
        pirate: 'assets/img/bg_game/bg_game_pirate.jpg',
        piece: 'assets/img/bg_game/bg_game_piece.jpg',
        diamant: 'assets/img/bg_game/bg_game_diamond.jpg',
        bateau_300: 'assets/img/bg_game/bg_game_bateau.jpg',
        bateau_500: 'assets/img/bg_game/bg_game_bateau.jpg',
        bateau_1000: 'assets/img/bg_game/bg_game_bateau.jpg',
        singe_perroquet: 'assets/img/bg_game/bg_game_animaux.jpg',
        tete_de_mort_1: 'assets/img/bg_game/bg_game_1tetedemort.jpg',
        tete_de_mort_2: 'assets/img/bg_game/bg_game_2tetedemort.jpg',
        tresor: 'assets/img/bg_game/bg_game_tresor.jpg',
        mage: 'assets/img/bg_game/bg_game_mage.jpg'
    };

    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.getElementById('randomImage').src = `assets/img/cards/${randomImage}.jpg`;

    const backgroundUrl = backgroundImages[randomImage];
    document.body.style.backgroundImage = `url(${backgroundUrl})`;

    window.playerCard = new Carte(randomImage);

    playerTour.setCarteTiree(playerCard);
}

/*************************************
 Mise à jour du tour du joueur actif
 *************************************/
function highlightActiveUser(index) {
    const playerItems = document.querySelectorAll('#playersList li');
    playerItems.forEach(item => {
        item.classList.remove('active-user');
    });
    playerItems[index].classList.add('active-user');
}

/*************************************
 Mise à jour du tour du joueur actif
 *************************************/
function calculateAndUpdateScore() {
    const diceInputs = document.querySelectorAll('.dice-input');
    checkVictoryCondition();

    // Vérifier le total des dés en fonction de la carte tirée
    let expectedTotal;
    switch (playerTour.getCarteTiree().nom) {
        case 'piece':
        case 'diamant':
        case 'tete_de_mort_1':
            expectedTotal = 9;
            break;
        case 'tete_de_mort_2':
            expectedTotal = 10;
            break;
        default:
            expectedTotal = 8;
    }

    // Vérifier le total des dés
    let total = 0;
    let allInputsFilled = true;
    diceInputs.forEach(input => {
        const inputValue = parseInt(input.value, 10);
        if (isNaN(inputValue)) {
            allInputsFilled = false;
        } else {
            total += inputValue;
        }
    });

    if (!allInputsFilled) {
        alert('Tous les champs de dés doivent être remplis.');
        return;
    }

    if (total !== expectedTotal) {
        alert(`Vous devez renseigner exactement ${expectedTotal} dés pour calculer le score potentiel. (Pensez à rajouter les têtes de mort/pièce/diamant des cartes)`);
        return;
    }

    // Mettre à jour playerTour avec les nouvelles valeurs des dés
    const diceTypeCount = {
        Deux: parseInt(document.getElementById('input-dice2').value, 10),
        Un: parseInt(document.getElementById('input-dice1').value, 10),
        Cinq: parseInt(document.getElementById('input-dice5').value, 10),
        Trois: parseInt(document.getElementById('input-dice3').value, 10),
        Quatre: parseInt(document.getElementById('input-dice4').value, 10),
        Six: parseInt(document.getElementById('input-dice6').value, 10) // Ajouté pour inclure le dé Six
    };

    updatePlayerTour('input-dice2', diceTypeCount.Deux);
    updatePlayerTour('input-dice1', diceTypeCount.Un);
    updatePlayerTour('input-dice5', diceTypeCount.Cinq);
    updatePlayerTour('input-dice3', diceTypeCount.Trois);
    updatePlayerTour('input-dice4', diceTypeCount.Quatre);
    updatePlayerTour('input-dice6', diceTypeCount.Six);

    // Vérifier le nombre de têtes de mort
    const totalTetesDeMort = diceTypeCount.Six;

    if (totalTetesDeMort === 3) {
        alert('Il y a 3 têtes de mort ou plus !!!');
        return; // Terminer la fonction après le changement de tour
    }

    // Recalculer le score potentiel et mettre à jour l'affichage
    if (window.playerTour) {
        playerTour.calculerScorePotentiel();
        savedDiceContainer.textContent = playerTour.getScorePotentiel().toString();
        console.log('Score potentiel :', playerTour.getScorePotentiel());
    } else {
        console.error('playerTour n\'est pas défini ou est null.');
    }
}





function updatePlayerTour(inputId, inputValue) {
    // Assurez-vous que playerTour est bien défini avant de l'utiliser ici
    if (window.playerTour) {
        const diceNumber = inputId.split('-')[1]; // Récupère le numéro du dé à partir de l'ID
        const propertyName = getPropertyNameForDiceNumber(diceNumber); // Convertit le numéro du dé en nom de propriété
        if (propertyName) {
            playerTour[propertyName] = inputValue; // Met à jour la propriété correspondante dans playerTour
        } else {
            console.error('Nom de propriété non trouvé pour le numéro de dé :', diceNumber);
        }
    } else {
        console.error('playerTour n\'est pas défini ou est null.');
    }
}


function getPropertyNameForDiceNumber(diceNumber) {
    switch (diceNumber) {
        case 'dice1': return 'Un';
        case 'dice2': return 'Deux';
        case 'dice3': return 'Trois';
        case 'dice4': return 'Quatre';
        case 'dice5': return 'Cinq';
        case 'dice6': return 'Six';
        default: return '';
    }
}


function nextTurn() {
    const diceInputs = document.querySelectorAll('.dice-input'); // Déclaration de diceInputs

    let expectedTotal;
    switch (playerTour.getCarteTiree().nom) {
        case 'piece':
        case 'diamant':
        case 'tete_de_mort_1':
            expectedTotal = 9;
            break;
        case 'tete_de_mort_2':
            expectedTotal = 10;
            break;
        default:
            expectedTotal = 8;
    }

    // Vérifier le total des dés
    let total = 0;
    let allInputsFilled = true;
    diceInputs.forEach(input => {
        const inputValue = parseInt(input.value, 10);
        if (isNaN(inputValue)) {
            allInputsFilled = false;
        } else {
            total += inputValue;
        }
    });

    if (!allInputsFilled || total !== expectedTotal) {
        alert(`Vous devez renseigner exactement ${expectedTotal} dés pour calculer le score potentiel. (Pensez à rajouter les têtes de mort/piece/diamant des cartes)`);
        return;
    }

    // Jouer le son
    let CardSound = document.getElementById('CardSound');
    CardSound.play();

    checkVictoryCondition(); // Appel de la fonction pour vérifier la condition de victoire
    calculateAndUpdateScore();

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
    playerListItems[currentPlayerIndex].innerHTML = `${gameData.players[currentPlayerIndex]} - Score: ${scores[currentPlayerIndex]} <div class="player-image"></div>`;

    const maxPoints = gameData.maxPoints;
    const currentPlayerScore = scores[currentPlayerIndex];
    if (currentPlayerScore >= maxPoints && !extraTurns) {
        openModal('modalCongrats');
        extraTurns = true;
        playerWhoReachedGoal = currentPlayerIndex;
        extraTurnsCount++;
    }

    let isLastExtraTurn = ((currentPlayerIndex + 1) % gameData.players.length) === playerWhoReachedGoal;
    if (extraTurns && isLastExtraTurn) {
        let highestScore = -1;
        let winnerIndex = -1;
        let anotherPlayerReachedGoal = false;
        for (let i = 0; i < gameData.players.length; i++) {
            if (scores[i] > highestScore) {
                highestScore = scores[i];
                winnerIndex = i;
            }
            if (i !== playerWhoReachedGoal && scores[i] >= maxPoints) {
                anotherPlayerReachedGoal = true;
            }
        }
        if (!anotherPlayerReachedGoal || highestScore >= maxPoints) {
            openModal('modalWinner');
            document.getElementById('winnerName').textContent = gameData.players[winnerIndex];
            extraTurns = false;
            playerWhoReachedGoal = -1;
            extraTurnsCount = 0;
        }
    }

    // On passe au joueur suivant
    currentPlayerIndex = (currentPlayerIndex + 1) % gameData.players.length;

    // Démarrer le tour du prochain joueur
    startPlayerTour();
}

function resetDiceInputs() {
    const diceInputs = document.querySelectorAll('.dice-input');
    diceInputs.forEach(input => {
        input.value = '0'; // Réinitialiser la valeur de chaque input à zéro
    });
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('visible');
}


/*************************************
 Fermeture d'une modale
 *************************************/
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('visible');
}

function checkVictoryCondition() {
    // Récupérer les valeurs des dés depuis playerTour
    const un = playerTour.getUn();
    const deux = playerTour.getDeux();
    const trois = playerTour.getTrois();
    const quatre = playerTour.getQuatre();
    const cinq = playerTour.getCinq();
    const six = playerTour.getSix();

    // Vérifier les conditions de victoire
    if ((un >= 9 && deux <= 0 && trois <= 0 && quatre <= 0 && cinq <= 0 && six >= 0) ||
        (un <= 0 && deux >= 9 && trois <= 0 && quatre <= 0 && cinq <= 0 && six >= 0) ||
        (un <= 0 && deux <= 0 && trois <= 0 && quatre <= 0 && cinq <= 0 && six >= 9)) {
        afficherModalGagnant();
    }
}

/*************************************
 Affichage de la modale annonçant le gagnant
 *************************************/
function afficherModalGagnant() {
    const modal = document.getElementById('modalWinner');
    const winnerNameElement = document.getElementById('winnerName');

    // On identifie le joueur actuel comme étant le gagnant de la partie
    const winnerName = gameData.players[currentPlayerIndex];

    //On met à jour le nom du gagnant
    winnerNameElement.textContent = winnerName;

    if (modal) {
        modal.style.display = 'block';
    }
}
function rejouerPartie() {
    // Insérez ici la logique pour recommencer une partie avec le même joueur
    alert('Début de la nouvelle partie avec les même joueur !');
    window.location.reload(); 
}

// Fonction pour refaire une partie en changeant de joueur
function rejouerAutreJoueur() {
    localStorage.clear(); 
    window.location.href = 'index.html'; // Adapter l'URL selon votre structure de fichiers
}
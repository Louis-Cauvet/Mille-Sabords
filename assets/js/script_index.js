"use strict";

/*************************************
 Variables globales
 *************************************/
const minPlayers = 2;
const maxPlayers = 5;
let players = [];
let maxPoints = null;


/*************************************
 Ajout de joueur
 *************************************/
function addPlayer() {
    const playerNameInput = document.getElementById('playerName');
    const playerName = playerNameInput.value.trim();

    if (playerName && players.length < maxPlayers) {
        players.push(playerName);
        addPlayerImage(playerName);
        playerNameInput.value = '';
    } else if (!playerName) {
        alert('Veuillez entrer un nom de joueur.');
    } else {
        alert('Nombre maximum de joueurs atteint.');
    }

    if (players.length >= maxPlayers) {
        document.getElementById('addPlayerButton').disabled = true;
    }
}

/*************************************
 Mise à jour de la liste des joueurs
 *************************************/
function updatePlayerList() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    players.forEach(player => {
        const playerName = document.createElement('li');
        playerName.textContent = player;

        const deletePlayerButton = document.createElement('button');
        deletePlayerButton.className = 'deletePlayerButton';
        deletePlayerButton.textContent = "x";
        deletePlayerButton.onclick = deletePlayer;

        playerName.appendChild(deletePlayerButton);
        playerList.appendChild(playerName);

    });
}

/*************************************
 Affichage d'un nouveau joueur dans la liste
 *************************************/
function addPlayerImage(playerName) {
    const playerImageContainer = document.getElementById('playerImageContainer');
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player-image-container-ind';

    const playerImg = document.createElement('div');
    playerImg.className = 'player-image';
    // playerImg.src = 'assets/img/pirate_index-removebg-preview.png'; // Utiliser l'image de pirate fixe
    // playerImg.alt = 'Pirate';

    const playerLabel = document.createElement('p');
    playerLabel.textContent = playerName;

    playerDiv.appendChild(playerImg);
    playerDiv.appendChild(playerLabel);
    playerImageContainer.appendChild(playerDiv);
}

/*************************************
 Suppression d'un joueur dans la liste
 *************************************/
function deletePlayer(event) {
    const userToDelete = event.target.parentElement;
    const playerName = userToDelete.textContent.slice(0, -1).trim(); // on supprime le 'x' du bouton du contenu textuel

    players = players.filter(player => player !== playerName);

    updatePlayerList();

    if (players.length < maxPlayers) {
        document.getElementById('addPlayerButton').disabled = false;
    }
}

/*************************************
 Ajout de l'objectif de points à atteindre
 *************************************/
function setMaxPoints() {
    const maxPointsInput = document.getElementById('maxPoints');
    const choosenObjectif = parseInt(maxPointsInput.value);

    if (choosenObjectif >= 2000) {
        if (choosenObjectif <= 10000) {
            const objectif = document.querySelector('#pointsInfo span');
            objectif.textContent = choosenObjectif;
            maxPointsInput.value = '';

            maxPoints = choosenObjectif;
        } else {
            alert('Veuillez entrer un objectif de 10000 maximum !')
        }
    } else {
        alert('Veuillez entrer un objectif de 2000 minimum !');
    }
}

/*************************************
Lancement du jeu, sous réserve de validation de tous les prérequis pour jouer (joueurs, score objectif)
 *************************************/
function createGame() {
    if (players.length >= minPlayers && maxPoints !== null) {
        const gameData = {
            players: players,
            maxPoints: maxPoints
        };
        localStorage.setItem('gameData', JSON.stringify(gameData));
        window.location.href = 'game.html';
    } else if (players.length < minPlayers) {
        alert('Il faut au moins 2 joueurs pour participer !');
    } else if (maxPoints === null) {
        alert('Définissez un score à atteindre pour gagner la partie');
    }
}
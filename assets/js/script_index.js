"use strict";

/*************************************
 Variables globales
 *************************************/
const minPlayers = 2;
const maxPlayers = 5;
let players = [];
let maxPoints = 0;


/*************************************
 Ajout de joueur
 *************************************/
function addPlayer() {
    const playerNameInput = document.getElementById('playerName');
    const playerName = playerNameInput.value.trim();

    if (playerName && players.length < maxPlayers) {
        players.push(playerName);
        updatePlayerList();
        playerNameInput.value = '';
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
    maxPoints = parseInt(maxPointsInput.value);

    if (maxPoints > 0) {
        const objectif = document.querySelector('#pointsInfo span');
        objectif.textContent = maxPoints;
        maxPointsInput.value = '';
    }
}

/*************************************
Lancement du jeu, sous réserve de validation de tous les prérequis pour jouer (joueurs, score objectif)
 *************************************/
function createGame() {
    if (players.length >= minPlayers && maxPoints > 0) {
        const gameData = {
            players: players,
            maxPoints: maxPoints
        };
        localStorage.setItem('gameData', JSON.stringify(gameData));
        window.location.href = 'game.html';
    } else if(players.length < minPlayers) {
        alert('Il faut au moins 2 joueurs pour participer !');
    } else if(maxPoints <= 0) {
        alert('Définissez un score à atteindre pour gagner la partie');
    }
}


function addPirate() {
    const pirateContainer = document.getElementById('pirateContainer');
    const pirate = document.createElement('div');
    pirate.className = 'pirate';
    pirateContainer.appendChild(pirate);
}
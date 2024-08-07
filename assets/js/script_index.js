"use strict";

/*************************************
 Global variables
 *************************************/
const minPlayers = 2;
const maxPlayers = 5;
let players = [];
let maxPoints = null;

let animalsMode = false;


/*************************************
 Background music management
 *************************************/
document.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('sound');

  // Music start during user click's interaction
  document.addEventListener('click', function() {
    if (audio.paused) {
      audio.play();
    }
  });

  // Music start during user keyboard's interaction
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && audio.paused) {
      audio.play();
    }
  });
});


/*************************************
 Add player to list
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
 Dynamic display of a new player in list
 *************************************/
function addPlayerImage(playerName) {
    const playerImageContainer = document.querySelector('.player-image-container');

    // Player's container
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player-image-container-ind';

    // Player's image
    const playerImg = document.createElement('div');
    playerImg.className = 'player-image';

    // Player's name
    const playerLabel = document.createElement('p');
    playerLabel.textContent = playerName;

    // Player's delete button
    const playerDeleteButton = document.createElement('button');
    playerDeleteButton.className = 'delete-player-button';
    playerDeleteButton.textContent = 'x';
    playerDeleteButton.onclick = deletePlayer;

    playerDiv.appendChild(playerImg);
    playerDiv.appendChild(playerLabel);
    playerDiv.appendChild(playerDeleteButton);
    playerImageContainer.appendChild(playerDiv);
}


/*************************************
 Dynamic deletion of a player from the list
 *************************************/
function deletePlayer(event) {
    const userToDelete = event.target.parentElement;
    const playerName = userToDelete.querySelector('p').textContent;

    players = players.filter(player => player !== playerName);

    updatePlayersList();

    if (players.length < maxPlayers) {
        document.getElementById('addPlayerButton').disabled = false;
    }
}


/*************************************
 Players' list update
 *************************************/
function updatePlayersList() {
    const playerList = document.querySelector('.player-image-container');
    playerList.innerHTML = '';

    players.forEach(player => {
        addPlayerImage(player);
    });
}


/*************************************
 Switch from Human mode to Animal mode & vice versa
 *************************************/
function switchPersosMode() {
    const playersDisplay = document.querySelector('.players-display');

    if (playersDisplay.classList.contains('as--animals')) {
        playersDisplay.classList.remove('as--animals');
        animalsMode = false;
    } else {
        playersDisplay.classList.add('as--animals');
        animalsMode = true;
    }
}


/*************************************
 Game launch, subject to validation of all prerequisites (players, target score)
 *************************************/
function createGame() {
    const maxPointsInput = document.getElementById('maxPoints');
    const choosenObjectif = parseInt(maxPointsInput.value);

    if (choosenObjectif >= 2000) {
        if (choosenObjectif <= 10000) {
            maxPoints = choosenObjectif;
        } else {
            maxPoints = null;
            alert('Veuillez entrer un objectif de 10000 maximum !')
        }
    } else {
        maxPoints = null;
        alert('Veuillez entrer un objectif de 2000 minimum !');
    }

    if (players.length >= minPlayers && maxPoints !== null) {
        const gameData = {
            players: players,
            maxPoints: maxPoints,
            animalsMode: animalsMode,
        };

        // Storage registration of game's data
        localStorage.setItem('gameData', JSON.stringify(gameData));
        // Redirect to the game page
        window.location.href = 'game.html';

    } else if (players.length < minPlayers) {
        alert('Il faut au moins 2 joueurs pour participer !');
    }
}

"use strict";

/*************************************
 Variables globales
 *************************************/
const minPlayers = 2;
const maxPlayers = 5;
let players = [];
let maxPoints = null;

let modeAnimals = false;

/*************************************
 Gestion de la musique en arrière plan
 *************************************/
document.addEventListener('DOMContentLoaded', function() {
      var audio = document.getElementById('sound');

      // Écouter les interactions utilisateur
      document.addEventListener('click', function() {
        if (audio.paused) {
          audio.play();
        }
      });

      document.addEventListener('keydown', function(event) {
        // Lancer l'audio si une touche spécifique est pressée
        if (event.key === 'Enter' && audio.paused) {
          audio.play();
        }
      });
    });

/*************************************
 Ajout du joueur dans la liste
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
 Affichage du nouveau joueur à l'écran
 *************************************/
function addPlayerImage(playerName) {
    const playerImageContainer = document.querySelector('.player-image-container');
    const playerDiv = document.createElement('div');
    playerDiv.className = 'player-image-container-ind';

    const playerImg = document.createElement('div');
    playerImg.className = 'player-image';

    const playerLabel = document.createElement('p');
    playerLabel.textContent = playerName;

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
 Suppression d'un joueur dans la liste
 *************************************/
function deletePlayer(event) {
    const userToDelete = event.target.parentElement;
    const playerName = userToDelete.querySelector('p').textContent;

    players = players.filter(player => player !== playerName);

    updatePlayerList();

    if (players.length < maxPlayers) {
        document.getElementById('addPlayerButton').disabled = false;
    }
}

/*************************************
 Mise à jour de la liste des joueurs
 *************************************/
function updatePlayerList() {
    const playerList = document.querySelector('.player-image-container');
    playerList.innerHTML = '';

    players.forEach(player => {
        addPlayerImage(player);
    });
}

/*************************************
 Passage du mode Humain au mode Animaux et inversement pour les personnages
 *************************************/
function switchPersosMode() {
    const playersDisplay = document.querySelector('.players-display');
    if (playersDisplay.classList.contains('as--animals')) {
        playersDisplay.classList.remove('as--animals');
        modeAnimals = false;
    } else {
        playersDisplay.classList.add('as--animals');
        modeAnimals = true;
    }
}

/*************************************
Lancement du jeu, sous réserve de validation de tous les prérequis pour jouer (joueurs, score objectif)
 *************************************/
function createGame() {
    const maxPointsInput = document.getElementById('maxPoints');
    const choosenObjectif = parseInt(maxPointsInput.value);

    if (choosenObjectif >= 2000) {
        if (choosenObjectif <= 10000) {
            maxPoints = choosenObjectif;

            const gameTypeRadios = document.getElementsByName('gameType');
            let gameTypeValue = null;

            for (let i = 0; i < gameTypeRadios.length; i++) {
                if (gameTypeRadios[i].checked) {
                    gameTypeValue = gameTypeRadios[i].value;
                    break;
                }
            }

            if (!gameTypeValue) {
                alert('Veuillez choisir le type de partie.');
                return;
            }

            let url, scriptUrl;

            if (gameTypeValue === 'dematerialiser') {
                url = 'game.html';
            } else if (gameTypeValue === 'physique') {
                url = 'game_physique.html';
            }
        } else {
            alert('Veuillez entrer un objectif de 10000 maximum !')
        }
    } else {
        alert('Veuillez entrer un objectif de 2000 minimum !');
    }


    if (players.length >= minPlayers && maxPoints !== null) {
        const gameData = {
            players: players,
            maxPoints: maxPoints,
            modeAnimals: modeAnimals,
        };
        localStorage.setItem('gameData', JSON.stringify(gameData));
        window.location.href = url;
        // loadScript(scriptUrl);
    } else if (players.length < minPlayers) {
        alert('Il faut au moins 2 joueurs pour participer !');
    }
}

// function loadScript(scriptUrl) {
//     const script = document.createElement('script');
//     script.src = scriptUrl;
//     script.async = true;
//     document.head.appendChild(script);
// }

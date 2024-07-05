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

const potentialScore = document.querySelector('#scorePotentiel span');

const nextTurnButton = document.querySelector(".next-turn-button");

let extraTurns = false;
let playerWhoReachedGoal = -1;
let extraTurnsCount = 0;

/*************************************
 Affichage des données de la partie au chargement de la page
 *************************************/
document.addEventListener('DOMContentLoaded', () => {
    const maxPointsInfo = document.getElementById('goalNumber');
    const playerList = document.getElementById('playersList');

    // on affiche les noms des joueurs et leurs scores, ainsi que l'objectif de points à atteindre
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

    // on démarre le tour du premier joueur
    startPlayerTour();
});


document.getElementById('flipCardButton').addEventListener('click', () => {
    const card = document.querySelector('.card');
    card.classList.add('clicked');
    setTimeout(() => {
        card.classList.remove('clicked');
    }, 1500);
});

/*************************************
 Gestion de la musique en arrière plan
 *************************************/
document.addEventListener('DOMContentLoaded', function() {
  let audio = document.getElementById('sound');

  // Écouter les interactions utilisateur
  document.addEventListener('click', function() {
      let horreur = document.getElementById('horreur');
      if (horreur.paused) {
          audio.play();
      }
  });

  document.addEventListener('keydown', function(event) {
    // Lancer l'audio si une touche spécifique est pressée
    let horreur = document.getElementById('horreur');
    if (event.key === 'Enter' && horreur.paused) {
      audio.play();
    }
  });
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

    insertDices();

    drawCard();
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
 Génération et affichage des 8 dés pour le premier lancement
 *************************************/
// Générer les 8 dés pour le premier lancement
function insertDices() {

    let initialRollingContent = `<div class="overlay" id="overlayrolling"></div>
                                        <div id="scorePotentiel">Votre score potentiel : <span>0</span></div>`;
    diceContainer.innerHTML = initialRollingContent;

    let initialSavedContent = `<div class="overlay" id="overlaysaved"></div>`;
    savedDiceContainer.innerHTML = initialSavedContent;

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
 Tirage d'une carte de manière aléatoire
 *************************************/
 function drawCard() {
    const images = [
        ...Array(4).fill('pirate'),
        ...Array(4).fill('piece'),
        ...Array(4).fill('diamant'),
        ...Array(2).fill('bateau_300'),
        ...Array(2).fill('bateau_500'),
        ...Array(2).fill('bateau_1000'),
        ...Array(4).fill('singe_perroquet'),
        ...Array(3).fill('tete_de_mort_1'),
        ...Array(2).fill('tete_de_mort_2'),
        ...Array(4).fill('tresor'),
        ...Array(4).fill('mage'),
    ];

    // Ajouter une correspondance entre les cartes et les backgrounds
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
        mage: 'assets/img/bg_game/bg_game_mage.jpg',
    };

    const cardSounds = {
        pirate: 'assets/audio/pirate.mp3',
        piece: 'assets/audio/piece.mp3',
        diamant: 'assets/audio/diamant.mp3',
        bateau_300: 'assets/audio/bateau.mp3',
        bateau_500: 'assets/audio/bateau.mp3',
        bateau_1000: 'assets/audio/bateau.mp3',
        singe_perroquet: 'assets/audio/animaux.mp3',
        tete_de_mort_1: 'assets/audio/ile_de_la_mort.mp3',
        tete_de_mort_2: 'assets/audio/ile_de_la_mort.mp3',
        tresor: 'assets/audio/tresor.mp3',
        mage: 'assets/audio/mage.mp3',
    };

    // On tire au sort une carte
    const randomImage = images[Math.floor(Math.random() * images.length)];
    setTimeout(() => {
        document.getElementById('randomImage').src = `assets/img/cards/${randomImage}.jpg`;
    }, 650)

    // Jouer le son correspondant à la carte tirée
    const soundUrl = cardSounds[randomImage];
    const audioElement = document.getElementById('card-sound');
    audioElement.src = soundUrl;
    audioElement.load(); // Recharger l'élément audio pour prendre en compte la nouvelle source
    setTimeout(() => {
        audioElement.play();
    }, 1000);

    // Modifier le background en fonction de la carte tirée
    const backgroundUrl = backgroundImages[randomImage];
    document.body.style.backgroundImage = `url(${backgroundUrl})`;

    // On ajoute la variable de carte de manière globale (en l'attachant à 'window') pour pouvoir y accéder de partout
    window.playerCard = new Carte(randomImage);

    // On définit la carte tirée, et on applique son effet
    playerTour.setCarteTiree(playerCard);
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
    // Vérifier si le joueur a déjà obtenu 3 têtes de mort
    if (playerTour.getTetesDeMort() >= 3) {
        alert("Vous avez déjà obtenu 3 têtes de mort. Vous ne pouvez pas relancer les dés.");
        nextTurn();
        return;
    }

    // Jouer le son
    var diceRollSound = document.getElementById('diceRollSound');
    diceRollSound.play();

    // on vérifie qu'il y a plus d'un dé dans la zone de relance
    if (diceContainer.querySelectorAll('.dice').length > 1) {
        // on incrémente le nombre de lancers de 1
        playerTour.setNbLancers(playerTour.getNbLancers() + 1);

        // on bloque le clic du bouton pendant le lancement
        rollDiceButton.disabled = true;
        nextTurnButton.disabled = true;

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
        let diceAnimationCount = 0; // Compteur pour suivre le nombre de dés dont l'animation est terminée

        dicesToRoll.forEach(dice => {
            // On récupère une face de manière aléatoire pour chaque dé, et on fait en sorte qu'il tombe dessus (avec la classe 'show-*')
            const rollingIndex = Math.floor((Math.random() * 6) + 1);
            for (let i = 1; i <= 6; i++) {
                dice.classList.remove('show-' + i);
                // On ajoute une rotation pour éviter que le dé ne bouge pas si la face reste la même
                dice.classList.add('show-'+ i +2);

                setTimeout(() => {
                    if (rollingIndex === i) {
                        dice.classList.add('show-' + i);
                    }
                }, 300);
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
                    checkVictoryCondition();

                } else if(!finishedPlayerTour) {
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

                // Compteur pour suivre le nombre de dés dont l'animation est terminée
                diceAnimationCount++;

                // Vérifier si tous les dés ont fini leur animation
                if (diceAnimationCount === dicesToRoll.length) {
                    rollDiceButton.disabled = false; // Débloquer le bouton "Lancer les dés"
                    nextTurnButton.disabled = false; // Débloquer le bouton "Prochain tour"
                }
            }, 1500);
        });


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

        setTimeout(() => {
            if (playerTour.getTetesDeMort() >= 3) {
                if (playerTour.getNbLancers() === 1 && diceTypeCount['tetes_de_mort'] >= 4 && !playerTour.getCarteTiree().nom.includes("bateau")) {
                    goToDeadIsland();
                } else {
                    CheckMage();
                    checkSkull();
                }
            } else {
                CheckMage();
                checkSkull();
            }
        }, 1800); 
        

        
    } else {
        alert("Vous ne pouvez pas relancer avec un seul dé dans votre zone de relance !")
    }
}

/*************************************
 Vérification du nombre de tête de morts dans la zone de sauvegarde
 *************************************/
function checkSkull() {
    if (playerTour.getTetesDeMort() >= 3 && playerTour.getVies() === 0) {
        // si l'utilisateur a cumulé plus de 3 dés têtes de mort, on force son tour à s'achever
        finishedPlayerTour = true;
        rollDiceButton.disabled = true;

        // Si l'utilisateur n'a pas tiré la carte 'Trésor' et qu'il n'a pas un score négatif, on repasse à son score potentiel à 0
        if (playerTour.getBanque() === false && playerTour.getScorePotentiel() > 0 && !playerTour.getCarteTiree().nom.includes("bateau")) {
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
 Vérification et application de la carte mage
 *************************************/
function CheckMage() {
    const diceHeadDead = document.getElementById('savedDiceContainer').querySelectorAll('div[data-result="tetes_de_mort"]').length;
    if (playerTour.getVies() > 0 && diceHeadDead > 0) {

        const diceElement = document.getElementById('savedDiceContainer').querySelector('div[data-result="tetes_de_mort"]');
        const activeDice = diceElement.querySelector('.active');

        if (diceElement) {
            activeDice.style.backgroundColor = 'white';
            diceElement.classList.remove('locked-dice','saved-dice');
            diceContainer.appendChild(diceElement)
        } else {
            console.warn('Element not found!');
        }

        playerTour.setVies(0);
    }
};

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
    // Jouer le son
    let CardSound = document.getElementById('CardSound');
    CardSound.play();
    setTimeout(() => {
        
    }, 1000);

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

    // On supprime tous le contenu des deux conteneurs de dés
    diceContainer.innerHTML = '';
    savedDiceContainer.innerHTML = '';

    // On réajoute l'affichage du score potentiel
    let potentialScoreHtml = `<div id="scorePotentiel">Votre score potentiel : <span>0</span></div>
                                    <div class="overlay" id="overlayrolling"></div>`;
    diceContainer.innerHTML += potentialScoreHtml;

    // On passe au joueur suivant
    currentPlayerIndex = (currentPlayerIndex + 1) % gameData.players.length;

    // Démarrer le tour du prochain joueur
    startPlayerTour();
}

/*************************************
 Vérification de la condition de victoire immédiate (si plus de 9 dés identiques)
 *************************************/
function checkVictoryCondition() {
    if (playerTour.getDiamants() >= 9 || playerTour.getPieces() >= 9 || playerTour.getTetesDeMort() >= 9) {
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


/***************************************************************************************************************************************************
 DEAD ISLAND / L'ile de la mort
 ****************************************************************************************************************************************************/

/*************************************
L'ile de la mort : 4 tête de morts au premier lancer
*************************************/
function goToDeadIsland() {

    document.querySelector('body').classList.add("deathmode");
    setTimeout(()=>{
        document.querySelector('body').classList.remove("deathmode");
    }, 700);

    playerTour.setModeTeteDeMort(true);

    // Jouer le son
    let TetedemortSound = document.getElementById('TetedemortSound');
    TetedemortSound.play();

    let audio = document.getElementById('sound');
    audio.pause();

    let horreur = document.getElementById('horreur');
    horreur.play();

    // Changer l'image de fond
    document.body.style.backgroundImage = "url('assets/img/bg_game/bg_game_iledelamort.jpg')";

    document.getElementById("messageContainer").innerHTML = "Vous débarquez sur l'Ile de la Tête de Mort mouhahahaha !!";
    document.getElementById("messageContainer").classList.add('visible');
    // On change la fonction du bouton de relance des dés
    rollDiceButton.onclick = rollDiceDeadIsland;

    // On cache le bouton de fin de tour pour éviter que l'utilisateur arrête son tour alors qu'il est sur l'île de la Tête de Mort, et on change sa fonction
    nextTurnButton.style.opacity = "0";
    nextTurnButton.onclick = nextTurnDeadIsland;

    const overlays = document.querySelectorAll('.dice-container .overlay');
    console.log('Overlays found:', overlays); // Pour vérifier si les éléments sont trouvés
    overlays.forEach((overlay) => {
        overlay.classList.add('active');
    });

    calculateNegativePoints(playerTour.getTetesDeMort());
    console.log(playerTour.getTetesDeMort());
}

/*************************************
 Calcul et affichage des points négatifs dans le mode Ile de la Tête de Mort
 *************************************/
function calculateNegativePoints(nbTetesMort) {
    let pointsmoins = nbTetesMort * playerTour.getIndiceReduction();
    playerTour.setScorePotentiel(pointsmoins);

    const scorePotentielDiv = document.getElementById('scorePotentiel');
    scorePotentielDiv.innerHTML = "Score : <span>" + playerTour.scorePotentiel.toString() + "</span> (pour les autres joueurs)";
}

/*************************************
 Lancement des dés dans le mode Ile de la Tête de Mort
 *************************************/
function rollDiceDeadIsland() {
    let diceRollSound = document.getElementById('diceRollSound');
    diceRollSound.play();

  // Jeu de l'île de la mort
  const diceTypeCount = {
    diamants: 0,
    perroquets: 0,
    tetes_de_mort: 0,
    pieces: 0,
    epees: 0,
    singes: 0,
  };

  const dicesToRoll = diceContainer.querySelectorAll(".dice");

  dicesToRoll.forEach((dice) => {
    // On récupère une face de manière aléatoire pour chaque dé, et on fait en sorte qu'il tombe dessus
    const rollingIndex = Math.floor(Math.random() * 6 + 1);
    for (let i = 1; i <= 6; i++) {
      dice.classList.remove("show-" + i);
      if (rollingIndex === i) {
        dice.classList.add("show-" + i);
      }
    }

    // On rend actif la face tirée au sort sur chaque dé
    dice.querySelectorAll(".side").forEach((side) => {
      side.classList.remove("active");
    });
    dice
      .querySelector(`.side:nth-child(${rollingIndex})`)
      .classList.add("active");

    // On incrémente le compteur du type de face correspondant à celle obtenue
    dice.dataset.result = dice.querySelector(`.side.active`).dataset.face;
    diceTypeCount[dice.dataset.result]++;

    // on fixe un délai pour laisser le temps à l'animation de s'exécuter entièrement avant le tri des dés
    setTimeout(function () {
      if (dice.dataset.result === "tetes_de_mort") {
        // on ajoute automatiquement le dé tête de mort à l'espace de sauvegarde et on le verrouille
        dice.classList.add("saved-dice", "locked-dice");
        savedDiceContainer.appendChild(dice);
      } else if (finishedPlayerTour == false) {
        dice.onclick = function () {
          // on ajoute le dé choisi par l'utilisateur à l'espace de sauvegarde
          if (!dice.classList.contains("saved-dice")) {
            saveDice(dice);
          } else {
            unsaveDice(dice);
          }
        };

        diceContainer.appendChild(dice);
      }
    }, 1100);
  });

    const allDeadHeaddice = document.querySelectorAll('.dice-container div[data-result="tetes_de_mort"]').length;

    let victoryConditionValue = 8;

    if (playerTour.getCarteTiree().nom === 'tete_de_mort') {
        victoryConditionValue = 9;
    } else if (playerTour.getCarteTiree().nom === 'tete_de_mort_2') {
        victoryConditionValue = 10;
    }

  // Vérifier si aucune tête de mort n'est obtenue et arrêter le tour si c'est le cas
  if (diceTypeCount["tetes_de_mort"] === 0 ||  allDeadHeaddice === victoryConditionValue) {
    setTimeout(function () {
        let message = '';
        switch (diceTypeCount["tetes_de_mort"]) {
            case 0:
                message = 'Votre tour est terminé, vous n\'avez pas obtenu de tête de mort sur ce lancer !';
                break;
            case 8:
                message = 'La chance, vous avez eu toutes les têtes de mort !';
                break;
        }
      document.getElementById("messageContainer").textContent = message;
      nextTurnButton.style.opacity = "1";
      rollDiceButton.disabled = true;
    }, 1100);
  } else if (diceTypeCount["tetes_de_mort"] === 0 ||  allDeadHeaddice === 9) {
    rollDiceButton.disabled = false;
  } else if (diceTypeCount["tetes_de_mort"] === 0 ||  allDeadHeaddice === 10) {
  }

  setTimeout(function () {
      const nbTetesMort = savedDiceContainer.querySelectorAll('div[data-result="tetes_de_mort"]').length;
      calculateNegativePoints(nbTetesMort);
  }, 1100);
}

/*************************************
 Passage au tour suivant demandé par le joueur dans le mode Ile de la Tete de Mort
 *************************************/
function nextTurnDeadIsland() {
    const pointsMoins = parseFloat(document.querySelector('#scorePotentiel span').textContent);

    // On parcourt la liste des joueurs pour tous leur retirer des points excepté le joueur actuel
    for (let i = 0; i < scores.length; i++) {
        // on vérifie si l'index courant n'est pas celui du joueur en cours
        if (i !== currentPlayerIndex) {
            // on soustrait le montant spécifié aux scores des autres joueurs
            scores[i] += pointsMoins;
            console.log(scores[i]);

            // On passe le score à 0 si il était sensé passer dans les négatifs
            if (scores[i] <0) {
                scores[i] = 0;
            }
        }
    }

    // on met à jour l'affichage du score total du joueur dans la liste des joueurs
    const playerListItems = document.querySelectorAll("#playersList li");
    for (let i = 0; i < gameData.players.length; i++) {
        playerListItems[i].textContent = `${gameData.players[i]} - Score: ${scores[i]}`;
    }

    // on vide l'affichage du score
    potentialScore.textContent = "";

    // on vide la zone des dés
    diceContainer.innerHTML = "";
    savedDiceContainer.innerHTML = "";

    // on passe au joueur suivant
    currentPlayerIndex = (currentPlayerIndex + 1) % gameData.players.length;

    outOfDeadIsland();
    startPlayerTour();
}

/*************************************
Sortie du mode Ile de la Tête de Mort
 *************************************/
function outOfDeadIsland() {
    playerTour.setModeTeteDeMort(false);

    // on rétablit les fonctions par défaut pour les boutons
    rollDiceButton.onclick = rollDice;
    nextTurnButton.onclick = nextTurn;

    let horreur = document.getElementById('horreur');
    horreur.pause();

    let audio = document.getElementById('sound');
    audio.play();

    document.getElementById("messageContainer").style.display = "none";
    document.getElementById("messageContainer").textContent = "Vous avez perdu ! Au suivant !";
}
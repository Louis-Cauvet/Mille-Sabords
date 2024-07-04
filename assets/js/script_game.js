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
 Gestion de la musique en arrière plan
 *************************************/
document.addEventListener('DOMContentLoaded', function() {
      var audio = document.getElementById('sound');

      // Écouter les interactions utilisateur
      document.addEventListener('click', function() {
          audio.play();
      });

      document.addEventListener('keydown', function(event) {
        // Lancer l'audio si une touche spécifique est pressée
        if (event.key === 'Enter') {
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

    // On tire au sort une carte
    const randomImage = images[Math.floor(Math.random() * images.length)];
    document.getElementById('randomImage').src = `assets/img/cards/${randomImage}.jpg`;

    // Modifier le background en fonction de la carte tirée
    const backgroundUrl = backgroundImages[randomImage];
    document.body.style.backgroundImage = `url(${backgroundUrl})`;

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

            // diceTypeCount["tetes_de_mort"] += 3; // TODO : A enlever

            // on fixe un délai pour laisser le temps à l'animation de s'exécuter entièrement avant le tri des dés
            setTimeout(function() {
                if (dice.dataset.result === 'tetes_de_mort') {
                    // on ajoute automatiquement le dé tête de mort à l'espace de sauvegarde et on le verrouille
                    dice.classList.add('saved-dice', 'locked-dice');
                    savedDiceContainer.appendChild(dice);
                    checkVictoryCondition();

                    // On vérifie si le joueur à obtenu au moins 4 têtes de morts au premier lancer, et on passe en mode 'Ile de la Tête de Mort' si c'est le cas
                    if (playerTour.getNbLancers() === 1) {
                        if (diceTypeCount['tetes_de_mort'] >= 4 && !playerTour.getCarteTiree().nom.includes("bateau")) {
                            goToDeadIsland();
                        } else {
                            CheckMage();
                            checkSkull();
                        }
                    } else {
                        CheckMage();
                        checkSkull();
                    }
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

        // Si le joueur a pioché la carte du Mage, on lui accorde une change supplémentaire
        if (playerTour.getVies() > 0) {
            playerTour.replaceSkullDice();
        }

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

    diceContainer.innerHTML = '';
    savedDiceContainer.innerHTML = '';

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
    // Jouer le son
    let TetedemortSound = document.getElementById('TetedemortSound');
    TetedemortSound.play();

    let audio = document.getElementById('sound');
    audio.pause();

    let horreur = document.getElementById('horreur');
    audio.play();

    // Changer l'image de fond
    document.body.style.backgroundImage = "url('assets/img/bg_game/bg_game_iledelamort.jpg')";

    document.getElementById("iledelamort").innerHTML = "Ile de la mort !";
    // On change la fonction du bouton de relance des dés
    rollDiceButton.onclick = rollDiceDeadIsland;

    // On cache le bouton de fin de tour pour éviter que l'utilisateur arrête son tour alors qu'il est sur l'île de la Tête de Mort, et on change sa fonction
    nextTurnButton.style.display = "none";
    nextTurnButton.onclick = nextTurnDeadIsland;

    // On empêche le clic sur les zones de sauvegarde et de relance
    document.querySelectorAll(".dice-container .overlay").forEach((overlay) => {
        overlay.classList.add("active");
    });

    calculateNegativePoints(playerTour.getTetesDeMort());
}

/*************************************
 Calcul et affichage des points négatifs dans le mode Ile de la Tête de Mort
 *************************************/
function calculateNegativePoints(nbTetesMort) {
    let pointsmoins = nbTetesMort * playerTour.getIndiceReduction();
    playerTour.setScorePotentiel(pointsmoins);
    potentialScore.textContent = playerTour.scorePotentiel.toString() + " (pour les autres joueurs)";
}

/*************************************
 Lancement des dés dans le mode Ile de la Tête de Mort
 *************************************/
function rollDiceDeadIsland() {
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

  // Vérifier si aucune tête de mort n'est obtenue et arrêter le tour si c'est le cas
  if (diceTypeCount["tetes_de_mort"] === 0 || diceTypeCount["tetes_de_mort"] === 8) {
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
      document.getElementById("messageContainer").style.display = "block";
      nextTurnButton.style.display = "block";
      rollDiceButton.disabled = true;
    }, 1100);
  } else {
    rollDiceButton.disabled = false;
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
    const pointsMoins = parseInt(potentialScore.textContent, 10);

    // On parcourt la liste des joueurs pour tous leur retirer des points excepté le joueur actuel
    for (let i = 0; i < scores.length; i++) {
        // on vérifie si l'index courant n'est pas celui du joueur en cours
        if (i !== currentPlayerIndex) {
            // on soustrait le montant spécifié aux scores des autres joueurs
            scores[i] += pointsMoins;

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
    // on rétablit les fonctions par défaut pour les boutons
    rollDiceButton.onclick = rollDice;
    nextTurnButton.onclick = nextTurn;


    document.getElementById("iledelamort").textContent = "";
    document.getElementById("messageContainer").style.display = "none";
    document.getElementById("messageContainer").textContent = "Vous avez perdu ! Au suivant !";
}
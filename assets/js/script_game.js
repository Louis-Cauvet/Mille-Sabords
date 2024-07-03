"use strict";

/*************************************
 Variables globales
 *************************************/
const gameData = JSON.parse(localStorage.getItem("gameData")); // données de la partie (choisies dans la page précédente)
let scores = []; // Tableau de gestion des scores
let currentPlayerIndex = 0; // Indice du joueur actuel
let finishedPlayerTour = false; // Blocage du bouton de lancement des dés

const diceContainer = document.getElementById("rollingDiceContainer");
const savedDiceContainer = document.getElementById("savedDiceContainer");

const rollDiceButton = document.getElementById("rollDiceButton");

const scorePotentiel = document.getElementById("scorePotentiel");

const nextTurnbutton = document.getElementById("nextTurn");

/*************************************
 Affichage des données de partie au chargement de la page
 *************************************/
document.addEventListener("DOMContentLoaded", () => {
  const maxPointsInfo = document.getElementById("goalNumber");
  const playerList = document.getElementById("playersList");

  if (gameData) {
    maxPointsInfo.textContent = `Objectif : ${gameData.maxPoints}`;
    gameData.players.forEach((player) => {
      scores.push(0);
      const li = document.createElement("li");
      li.textContent = `${player} - Score: ${scores[scores.length - 1]}`;
      playerList.appendChild(li);
    });
  } else {
    alert("Les données de la partie n'ont pas été trouvées");
  }

  startPlayerTour();
});

/*************************************
 Démarrage du nouveau tour d'un joueur
 *************************************/
function startPlayerTour() {
  window.playerTour = new Tour(); // On ajoute la variable de tour de manière globale (en l'attachant à 'window') pour pouvoir y accéder de partout

  document.getElementById("messageContainer").classList.remove("visible");
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
  const playerItems = document.querySelectorAll("#playersList li");

  playerItems.forEach((item) => {
    item.classList.remove("active-user");
  });

  playerItems[index].classList.add("active-user");
}

/*************************************
 Tirage d'une carte de manière aléatoire
 *************************************/
function drawCard() {
  const images = [
    "pirate",
    "piece",
    "diamant",
    "bateau_300",
    "bateau_500",
    "bateau_1000",
    "singe_perroquet",
    "tete_de_mort_1",
    "tete_de_mort_2",
    "tresor",
    "mage",
  ];
  const randomImage = images[Math.floor(Math.random() * images.length)];
  document.getElementById(
    "randomImage"
  ).src = `assets/img/cards/${randomImage}.jpg`;

  window.playerCard = new Carte(randomImage);

  // On définit la carte tirée, et on applique son effet
  playerTour.setCarteTiree(playerCard);
}

/*************************************
 Génération et affichage des 8 dés pour le premier lancement
 *************************************/
// Générer les 8 dés pour le premier lancement
function insertDices() {
  for (let i = 1; i <= 8; i++) {
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
  document.getElementById(modalId).classList.add("visible");
}

/*************************************
 Fermeture d'une modale
 *************************************/
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove("visible");
}

/*************************************
 Lancement des dés de la zone de relance
 *************************************/
function rollDice() {
  if (diceContainer.querySelectorAll(".dice").length > 1) {
    rollDiceButton.disabled = true;

    // on initialise un objet pour compter les occurrences de chaque type de dé
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
          check4Skull(diceTypeCount);
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

        if (finishedPlayerTour === false) {
          rollDiceButton.disabled = false;
        }
      }, 1500);
    });

    diceTypeCount["tetes_de_mort"] += 3;

    const dicestoSave = savedDiceContainer.querySelectorAll(".saved-dice");
    dicestoSave.forEach((diceSaved) => {
      diceTypeCount[diceSaved.dataset.result]++;
    });

    // Mise à jour de playerTour avec diceTypeCount
    playerTour.setTetesDeMort(diceTypeCount.tetes_de_mort);
    playerTour.setSinges(diceTypeCount.singes);
    playerTour.setPerroquets(diceTypeCount.perroquets);
    playerTour.setDiamants(diceTypeCount.diamants);
    playerTour.setPieces(diceTypeCount.pieces);
    playerTour.setEpees(diceTypeCount.epees);
    playerTour.calculerScorePotentiel();

    // Incrémente le nombre de lancers
    playerTour.setnblancers(playerTour.getnblancers() + 1);
  } else {
    alert(
      "Vous ne pouvez pas relancer avec un seul dé dans votre zone de relance !"
    );
  }
}

/*************************************
 Vérification du nombre de tête de morts dans la zone de sauvegarde
 *************************************/
function checkSkull() {
  if (playerTour.getTetesDeMort() >= 3) {
    finishedPlayerTour = true;
    rollDiceButton.disabled = true;
    document.getElementById("messageContainer").classList.add("visible");
    document.querySelectorAll(".dice-container .overlay").forEach((overlay) => {
      overlay.classList.add("active");
    });
  }
}

/*************************************
 Ajout d'un dé dans la zone de sauvegarde
 *************************************/
function saveDice(diceElement) {
  if (savedDiceContainer.children.length < 8) {
    diceElement.classList.add("saved-dice");
    savedDiceContainer.appendChild(diceElement);
  }
}

/*************************************
 Retrait d'un dé dans la zone de sauvegarde, pour le remettre dans la zone de relance
 *************************************/
function unsaveDice(diceElement) {
  if (savedDiceContainer.children.length > 1) {
    diceElement.classList.remove("saved-dice");
    diceContainer.appendChild(diceElement); // Déplacer le dé vers le conteneur principal de dés
  } else {
    alert(
      "Vous devez toujours avoir au moins 1 dé dans la zone de sauvegarde !"
    );
  }
}

/*************************************
 Passage au tour suivant demandé par le joueur
 *************************************/
function nextTurn() {
  // Calculer le score potentiel actuel du joueur
  playerTour.calculerScorePotentiel();

  // Ajouter le score potentiel au score total du joueur
  scores[currentPlayerIndex] += playerTour.scorePotentiel;

  // Mettre à jour l'affichage du score total du joueur dans la liste des joueurs
  const playerListItems = document.querySelectorAll("#playersList li");
  playerListItems[
    currentPlayerIndex
  ].textContent = `${gameData.players[currentPlayerIndex]} - Score: ${scores[currentPlayerIndex]}`;

  // Passage au joueur suivant
  currentPlayerIndex = (currentPlayerIndex + 1) % gameData.players.length;

  // Vider les dés
  diceContainer.innerHTML = "";
  savedDiceContainer.innerHTML = "";

  // Démarrer le tour du prochain joueur
  outOfDeadIsland();
  startPlayerTour();
}
/***************************************************************************************************************************************************
 DEAD ISLAND / L'ile de la mort
 ****************************************************************************************************************************************************/

/*************************************
L'ile de la mort : 4 tête de morts au premier lancer
*************************************/
function check4Skull(diceTypeCount) {
  const carteNom = playerTour.getCarteTiree().nom;

  if (diceTypeCount["tetes_de_mort"] >= 4 && !carteNom.includes("bateau")) {
    if (playerTour.getnblancers() === 1) {
      setTimeout(function () {
        document.body.style.backgroundColor = "aqua";
        document.getElementById("iledelamort").innerHTML = "Ile de la mort !";
        rollDiceButton.onclick = rollDiceDeadIsland;
        nextTurnbutton.style.display = "none";
        nextTurnbutton.onclick = nextTurnDeadIsland;
        document
          .querySelectorAll(".dice-container .overlay")
          .forEach((overlay) => {
            overlay.classList.add("active");
          });
      }, 200);

      let pointsmoins = diceTypeCount["tetes_de_mort"] * 100;
      scorePotentiel.textContent = pointsmoins;
    }
  } else {
    checkSkull();
  }
}

/*************************************
 Lancement des dès dans l'ile de la mort
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
  if (diceTypeCount["tetes_de_mort"] === 0) {
    setTimeout(function () {
      document.getElementById("messageContainer").textContent =
        "Tour terminé, vous n'avez obtenu aucune tête de mort !";
      document.getElementById("messageContainer").style.display = "block";
      nextTurnbutton.style.display = "block";
      rollDiceButton.disabled = true;
    }, 200);
  } else {
    rollDiceButton.disabled = false;
  }

  setTimeout(function () {
    const nbrestetesdemorts = savedDiceContainer.querySelectorAll(
      'div[data-result="tetes_de_mort"]'
    ).length;
    let pointsmoins = nbrestetesdemorts * playerTour.indiceReduction;
    scorePotentiel.textContent = pointsmoins;
  }, 1100);
}

/*************************************
Sortir de l'ile de la mort
 *************************************/
function outOfDeadIsland() {
  document.body.style.backgroundColor = "white";
  rollDiceButton.onclick = rollDice;
  nextTurnbutton.onclick = nextTurn;
  document.getElementById("iledelamort").textContent = "";
  document.getElementById("messageContainer").style.display = "none";
  document.getElementById("messageContainer").textContent =
    "Vous avez perdu ! Au suivant !";
}

/*************************************
 Passage au tour suivant demandé par le joueur : Ile de la mort
 *************************************/
function nextTurnDeadIsland() {
  const scorePotentieldiv = document.getElementById("scorePotentiel");
  const pointsMoins = parseInt(scorePotentieldiv.textContent, 10);

  for (let i = 0; i < scores.length; i++) {
    // Vérifie si l'index courant n'est pas celui du joueur en cours
    if (i !== currentPlayerIndex) {
      // Soustrait le montant spécifié aux scores des autres joueurs
      scores[i] -= pointsMoins;
    }
  }

  // Mettre à jour l'affichage du score total du joueur dans la liste des joueurs
  const playerListItems = document.querySelectorAll("#playersList li");
  for (let i = 0; i < gameData.players.length; i++) {
    playerListItems[
      i
    ].textContent = `${gameData.players[i]} - Score: ${scores[i]}`;
  }

  // Passage au joueur suivant
  currentPlayerIndex = (currentPlayerIndex + 1) % gameData.players.length;
  // Vider le score
  scorePotentieldiv.textContent = "";
  // Vider les dés
  diceContainer.innerHTML = "";
  savedDiceContainer.innerHTML = "";

  outOfDeadIsland();
  startPlayerTour();
}

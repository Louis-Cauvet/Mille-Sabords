"use strict";

/*************************************
 Global variables
 *************************************/
const gameData = JSON.parse(localStorage.getItem('gameData'));     // Party's data (chosen in the previous page)

let scores= [];                      // Scores' array
let currentPlayerIndex= 0;         // Current player's index
let finishedPlayerTour= false;     // Allow to block the dices' launch

let isInExtraTurn = false;           // Indicates if we are in the extra-turn
let isExtraTurnPassed= false;        // Indicates if the extra-turn is passed
let playerWhoReachedGoal= -1;      // Indicates the player who trigger the extra-turn

const diceContainer = document.getElementById('rolling-dice-container');
const savedDiceContainer = document.getElementById('saved-dice-container');
const rollDiceButton = document.getElementById('roll-dice-button');
const potentialScore = document.querySelector('#potential-score span');
const nextTurnButton = document.querySelector(".next-turn-button");


/*************************************
 Display game data during page's loading
 *************************************/
document.addEventListener('DOMContentLoaded', () => {

    // Verifying than party's data are finded
    if (!gameData) {
        alert('Les données de la partie n\'ont pas été trouvées');
        window.location.href = 'index.html';
    }

    const goalNumber = document.getElementById('goal-number');
    const playersList = document.getElementById('players-list');

    // Checking the players' appearance choice
    if(gameData["animalsMode"] === true) {
        playersList.classList.add('as--animals');
    }

    // Displaying the goal number to reached
    goalNumber.textContent = `Objectif : ${gameData.maxPoints}`;

    // Displaying the players' score
    gameData.players.forEach((player, index) => {
        scores.push(0);
        const listItem = document.createElement('li');

        listItem.textContent = `${player} - Score: ${scores[index]}`;
        listItem.innerHTML += '<div class="player-image"></div>';
        playersList.appendChild(listItem);
    });

    // Starting musics
    startMusics();

    // Starting the first player's turn
    startPlayerTour();
});


/*************************************
 Background music management
 *************************************/
function startMusics() {
    const bgSound = document.getElementById('bg-sound');
    const horrorSound = document.getElementById('horror-sound');

    const playBgMusic = () => {
        if (horrorSound.paused) {
            bgSound.play();
        }
    };

    document.addEventListener('click', playBgMusic);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            playBgMusic();
        }
    });
}


/*************************************
 Modal opening
 *************************************/
function openModal(modalId) {
    document.getElementById(modalId).classList.add('visible');
}


/*************************************
 Modal closing
 *************************************/
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('visible');
}


/*************************************
 Starting new player's turn
 *************************************/
function startPlayerTour() {
    // Adding the tower variable globally (by attaching it to 'window') so that it can be accessed from anywhere
    window.playerTour = new Tour();

    // Reinitalising any information that may have dynamicaly appeared during the previous round
    document.getElementById('message-container').classList.remove('visible');
    potentialScore.textContent = '0';
    rollDiceButton.disabled = false;
    finishedPlayerTour = false;

    highlightActiveUser(currentPlayerIndex);

    insertDices();

    drawCard();
}


/*************************************
 Adding visual indication of the current player
 *************************************/
function highlightActiveUser(index) {
    const playerItems = document.querySelectorAll('#players-list li');

    playerItems.forEach(item => {
        item.classList.remove('active-user');
    });

    playerItems[index].classList.add('active-user');
}


/*************************************
 Generating dynamicaly 8 dices for the first user's throw
 *************************************/
function insertDices() {

    diceContainer.innerHTML = `<div class="overlay" id="overlay-rolling"></div>
                               <div id="potential-score">Votre score potentiel : <span>0</span></div>`;

    savedDiceContainer.innerHTML = `<div class="overlay" id="overlay-saved"></div>`;

    for (let i=1; i<=8 ; i++) {
        const newDiceHtml = `
            <div id='dice${i}' class="dice">
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
            </div>
        `;
        diceContainer.innerHTML += newDiceHtml;
    }
}


/*************************************
 Draw a random card
 *************************************/
 function drawCard() {
    // Creating an arraw which contains different cards' types
    const cardsTypes = [
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

    // Adding a link between the card's type and the background image
    const bgImages = {
        pirate: 'assets/img/bg/bg_game_pirate.jpg',
        piece: 'assets/img/bg/bg_game_piece.jpg',
        diamant: 'assets/img/bg/bg_game_diamond.jpg',
        bateau_300: 'assets/img/bg/bg_game_bateau.jpg',
        bateau_500: 'assets/img/bg/bg_game_bateau.jpg',
        bateau_1000: 'assets/img/bg/bg_game_bateau.jpg',
        singe_perroquet: 'assets/img/bg/bg_game_animaux.jpg',
        tete_de_mort_1: 'assets/img/bg/bg_game_1tetedemort.jpg',
        tete_de_mort_2: 'assets/img/bg/bg_game_2tetedemort.jpg',
        tresor: 'assets/img/bg/bg_game_tresor.jpg',
        mage: 'assets/img/bg/bg_game_mage.jpg',
    };

    // Adding a link between the card's type and his sound
    const cardsSounds = {
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

    // Drawning a random card and gave it its own image
    const cardRandomImage = cardsTypes[Math.floor(Math.random() * cardsTypes.length)];
    setTimeout(() => {
        document.getElementById('card-image').src = `assets/img/cards/${cardRandomImage}.jpg`;
    }, 650)

    // Launching the flip card animation
    const card = document.querySelector('.card');
    card.classList.add('clicked');
    setTimeout(() => {
        card.classList.remove('clicked');
    }, 1500);

    // Playing the flip card's sound
    document.getElementById('flip-sound').play();

    // Playing the own card's sound
    const cardSound = document.getElementById('card-sound');
    cardSound.src = cardsSounds[cardRandomImage];
    cardSound.load();            // Reloading the audio item to take account of the new source
    setTimeout(() => {
        cardSound.play();
    }, 1000);

    // Changing game's background
    const backgroundUrl = bgImages[cardRandomImage];
    document.body.style.backgroundImage = `url(${backgroundUrl})`;

    // Adding the card variable globally (by attaching it to 'window') so that it can be accessed from anywhere
    window.playerCard = new Carte(cardRandomImage);

    // Applying the card drawn
    playerTour.setCarteTiree(playerCard);
}

/*************************************
 Rolling dices in the rolling area
 *************************************/
function rollDice() {
    // Checking if the player has already obtained 3 skulls
    if (playerTour.getTetesDeMort() >= 3) {
        alert("Vous avez déjà obtenu 3 têtes de mort. Vous ne pouvez pas relancer les dés.");
        nextTurn();
        return;
    }

    // Removing the filter which not allow to click on a dice
    diceContainer.querySelectorAll('.dice').forEach(dice => {
        dice.classList.remove('locked-dice', 'saved-dice');
    })

    // Checking that there is more than 1 dice in the rolling area
    if (diceContainer.querySelectorAll('.dice').length > 1) {
        // Playing the roll dice sound
        const rollDiceSound = document.getElementById('roll-dice-sound');
        rollDiceSound.play();

        // Increasing the number of throws by 1
        playerTour.setNbLancers(playerTour.getNbLancers() + 1);

        // Blocking the buttons' click during launch
        rollDiceButton.disabled = true;
        nextTurnButton.disabled = true;

        // Initialising an object to count the occurrences of each dice's type
        const diceTypeCount = {
            diamants: 0,
            perroquets: 0,
            tetes_de_mort: 0,
            pieces: 0,
            epees: 0,
            singes: 0
        };

        const dicesToRoll = diceContainer.querySelectorAll('.dice');
        let diceAnimationCount = 0; // Counter to keep track of the number of dice whose animation has been completed

        dicesToRoll.forEach(dice => {
            // Getting a random face for each die, and make it fall on it (using the 'show-*' class)
            const rollingIndex = Math.floor((Math.random() * 6) + 1);
            for (let i = 1; i <= 6; i++) {
                dice.classList.remove('show-' + i);

                // A rotation is added to prevent the die from moving if the face remains the same
                dice.classList.add('show-'+ i +2);

                // After a little time, asking the dice to rest on the face randomly drawn
                setTimeout(() => {
                    if (rollingIndex === i) {
                        dice.classList.add('show-' + i);
                    }
                }, 300);
            }

            // Making active on the dice the face randomly drawn
            dice.querySelectorAll('.side').forEach(side => {
                side.classList.remove('active');
            });
            dice.querySelector(`.side:nth-child(${rollingIndex})`).classList.add('active');

            // Incrementing the counter which concerning the dice's face
            dice.dataset.result = dice.querySelector(`.side.active`).dataset.face;
            diceTypeCount[dice.dataset.result]++;

            // Allowing a time limit for the launch animation before than the user starts to sort dices
            setTimeout(function() {
                if (dice.dataset.result === 'tetes_de_mort') {
                    // Skull dices are automatically added and locked to the save area
                    dice.classList.add('saved-dice', 'locked-dice');
                    savedDiceContainer.appendChild(dice);
                    checkVictoryCondition();
                } else if(!finishedPlayerTour) {
                    // Adding the die chosen by the user to the save area, or remove it if it's already there
                    dice.onclick = function () {
                        if (!dice.classList.contains('saved-dice')) {
                            saveDice(dice);
                        } else {
                            unsaveDice(dice);
                        }
                    };

                    diceContainer.appendChild(dice);
                }

                diceAnimationCount++;

                // If all the dice have finished their animation, unlocking buttons
                if (diceAnimationCount === dicesToRoll.length) {
                    rollDiceButton.disabled = false;
                    nextTurnButton.disabled = false;
                }
            }, 1500);
        });


        // Incrementing the counter with the types of dices that are located in the save area
        const dicesToSave = savedDiceContainer.querySelectorAll('.saved-dice');
        dicesToSave.forEach(diceSaved => {
            diceTypeCount[diceSaved.dataset.result]++;
        });

        // Updating the turn data for calculate the potential score
        playerTour.setTetesDeMort(diceTypeCount.tetes_de_mort);
        playerTour.setSinges(diceTypeCount.singes);
        playerTour.setPerroquets(diceTypeCount.perroquets);
        playerTour.setDiamants(diceTypeCount.diamants);
        playerTour.setPieces(diceTypeCount.pieces);
        playerTour.setEpees(diceTypeCount.epees);

        setTimeout(() => {
            if (playerTour.getNbLancers() === 1 && diceTypeCount['tetes_de_mort'] >= 4 && !playerTour.getCarteTiree().nom.includes("bateau")) {
                // Triggering the Dead Island mode
                goToDeadIsland();
            } else {
                checkMage();
                checkSkull();

                // Calculating the user's potential score
                playerTour.calculerScorePotentiel();
            }
        }, 1500);

    } else {
        alert("Vous ne pouvez pas relancer avec un seul dé dans votre zone de relance !")
    }
}


/*************************************
 Checking immediate victory's condition (if more than 9 identical dices)
 *************************************/
function checkVictoryCondition() {
    if (playerTour.getDiamants() >= 9 || playerTour.getPieces() >= 9 || playerTour.getTetesDeMort() >= 9) {
        openModal('modal-winner');
        document.getElementById('winner-name').textContent = gameData.players[currentPlayerIndex];
    }
}


/*************************************
 Checking and applying the mage card's effect
 *************************************/
function checkMage() {
    const diceHeadDead = document.getElementById('saved-dice-container').querySelector('div[data-result="tetes_de_mort"]');
    if (playerTour.getVies() > 0 && diceHeadDead) {
        // Using the user's life to recover a skull's dice
        diceContainer.appendChild(diceHeadDead)
        playerTour.setVies(0);
        playerTour.setTetesDeMort(playerTour.getTetesDeMort()-1);
    }
}


/*************************************
 Checking the number of skulls in the save area
 *************************************/
function checkSkull() {
    if (playerTour.getTetesDeMort() >= 3 && playerTour.getVies() === 0) {
        // If the user has accumulated more than 3 skull dices, the turn is forced to end
        finishedPlayerTour = true;
        rollDiceButton.disabled = true;

        // If the user has not drawn the 'Treasure' card and does not have a negative score, the potential score is reset to 0
        if (playerTour.getBanque() === false) {
            // Indicate than the player have obtained more than 3 skull dices
            playerTour.setTourPerdu(true);
        }

        document.getElementById('message-container').classList.add('visible');
        document.querySelectorAll('.dice-container .overlay').forEach(overlay => {
            overlay.classList.add('active');
        })
    }
}


/*************************************
 Adding dice in the save area
 *************************************/
function saveDice(diceElement) {
    if (savedDiceContainer.children.length < 8) {
        diceElement.classList.add('saved-dice');
        savedDiceContainer.appendChild(diceElement);
    }
}


/*************************************
 Removing dice from the save area, to put it in the rolling area
 *************************************/
function unsaveDice(diceElement) {
    if (savedDiceContainer.children.length > 1) {
        diceElement.classList.remove('saved-dice');
        diceContainer.appendChild(diceElement);
    } else {
        alert('Vous devez toujours avoir au moins 1 dé dans la zone de sauvegarde !');
    }
}


/*************************************
 Start the next user's turn after the current player's request
 *************************************/
function nextTurn() {
    // The potential score of the turn is added to the player's total score
    scores[currentPlayerIndex] += playerTour.scorePotentiel;

    // Reset the score to 0 if it is supposed to be negative
    if (scores[currentPlayerIndex] < 0) {
        scores[currentPlayerIndex] = 0;
    }

    // The player's score is updated
    const playersListItems = document.querySelectorAll('#players-list li');
    playersListItems[currentPlayerIndex].innerHTML = `${gameData.players[currentPlayerIndex]} - Score: ${scores[currentPlayerIndex]} <div class="player-image"></div>`;

    // The potential score is reset to 0
    playerTour.scorePotentiel = 0;

    // Checking if the user has reached the goal score
    const maxPoints = gameData.maxPoints;
    if (scores[currentPlayerIndex] >= maxPoints && isInExtraTurn == false) {
        if (isExtraTurnPassed === false) {
            // Indicating than a player has reached the goal score and starting the extra-turn
            openModal('modal-congrats');
            document.getElementById('reach-goal-name').textContent = gameData.players[currentPlayerIndex];
            isInExtraTurn = true;
            playerWhoReachedGoal = currentPlayerIndex;
        } else {
            // Announcing the winner of sudden death mode
            openModal('modal-winner');
            document.getElementById('winner-name').textContent = gameData.players[currentPlayerIndex];
        }
    }

    // Getting the player placed just before the player who reached the score's goal
    const isLastExtraTurn = ((currentPlayerIndex + 1) % gameData.players.length) === playerWhoReachedGoal;

    if (isInExtraTurn == true && isLastExtraTurn == true) {
        let highestScore = -1;
        let winnerIndex = null;

        for (let i = 0; i < gameData.players.length; i++) {
            if (scores[i] > highestScore) {
                // Storing the higher score reached during the extra-turn, and the player who have this score
                highestScore = scores[i];
                winnerIndex = i;
            }
        }

        if (highestScore >= maxPoints) {
            // Announcing the winner of extra-turn
            openModal('modal-winner');
            document.getElementById('winner-name').textContent = gameData.players[winnerIndex];
        } else {
            // Announcing the end of extra-turn and starting the sudden death mode
            isInExtraTurn = false;
            isExtraTurnPassed = true;
            openModal('modal-lost-extraturn');
        }
    }

    // Deleting all the contents of dices' containers
    diceContainer.innerHTML = '';
    savedDiceContainer.innerHTML = '';

    // Go to the next player
    currentPlayerIndex = (currentPlayerIndex + 1) % gameData.players.length;

    // Starting the next player's turn
    startPlayerTour();
}


/*************************************
 Restart a new party with same parameters (score's goal, players)
 *************************************/
function restartIdenticalParty() {
    alert("C'est reparti pour une nouvelle aventure, préparez vos dés mousaillons !");
    window.location.reload(); 
}

/*************************************
 Return to home page for change party parameters (score's goal, players)
 *************************************/
function changePartyParameters() {
    localStorage.clear(); 
    window.location.href = 'index.html';
}


/***************************************************************************************************************************************************
 DEAD ISLAND MODE
 ****************************************************************************************************************************************************/

/*************************************
 Enter in dead island mode
*************************************/
function goToDeadIsland() {

    // Adding a dark fade for the transition
    document.querySelector('body').classList.add("deathmode");
    setTimeout(()=>{
        document.querySelector('body').classList.remove("deathmode");
    }, 700);

    // Activating the dead island mode in players' turn parameters
    playerTour.setModeTeteDeMort(true);

    // Changing sounds
    const bgSound = document.getElementById('bg-sound');
    bgSound.pause();

    const deathSound = document.getElementById('death-sound');
    deathSound.play();

    const horrorSound = document.getElementById('horror-sound');
    horrorSound.play();

    // Changing background-image
    document.body.style.backgroundImage = "url('assets/img/bg/bg_game_iledelamort.jpg')";

    // Displaying message
    document.getElementById("message-container").innerHTML = "Vous débarquez sur l'Ile de la Tête de Mort mouhahahaha !!";
    document.getElementById("message-container").classList.add('visible');

    // Changing the function of the relaunch dices button
    rollDiceButton.onclick = rollDicesDeadIsland;

    // Hiding the end-of-turn button to prevent the user from stopping their turn while on Dead Island, and we change its function
    nextTurnButton.style.opacity = "0";
    nextTurnButton.onclick = nextTurnDeadIsland;

    // Activating overlays to prevent player to switch a dice's area
    const overlays = document.querySelectorAll('.dice-container .overlay');
    overlays.forEach((overlay) => {
        overlay.classList.add('active');
    });

    // Calculating negative points for other players
    calculateNegativePoints(playerTour.getTetesDeMort());
}

/*************************************
 Calculating and displaying negative points for other players
 *************************************/
function calculateNegativePoints(nbTetesMort) {
    const minusPoints = nbTetesMort * playerTour.getIndiceReduction();
    playerTour.setScorePotentiel(minusPoints);

    const potentialScoreDiv = document.getElementById('potential-score');
    potentialScoreDiv.innerHTML = "Score : <span>" + playerTour.scorePotentiel.toString() + "</span> (pour les autres joueurs)";
}

/*************************************
 Rolling dices in Dead Island Mode
 *************************************/
function rollDicesDeadIsland() {
    // Playing rolling dices sound
    const rollDiceSound = document.getElementById('roll-dice-sound');
    rollDiceSound.play();

    // Blocking the buttons' click during launch
    rollDiceButton.disabled = true;
    nextTurnButton.disabled = true;

    // Initialising an object to count the occurrences of each dice's type
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
        // Getting a random face for each die, and make it fall on it (using the 'show-*' class)
        const rollingIndex = Math.floor(Math.random() * 6 + 1);
        for (let i = 1; i <= 6; i++) {
            dice.classList.remove("show-" + i);

            // A rotation is added to prevent the die from moving if the face remains the same
            dice.classList.add('show-'+ i +2);

            // After a little time, asking the dice to rest on the face randomly drawn
            setTimeout(() => {
                if (rollingIndex === i) {
                    dice.classList.add('show-' + i);
                }
            }, 300);
        }

          // Making active on the dice the face randomly drawn
        dice.querySelectorAll(".side").forEach((side) => {
            side.classList.remove("active");
        });
        dice.querySelector(`.side:nth-child(${rollingIndex})`).classList.add("active");

        // Incrementing the counter which concerning the dice's face
        dice.dataset.result = dice.querySelector(`.side.active`).dataset.face;
        diceTypeCount[dice.dataset.result]++;

        // Allowing a time limit for the launch animation before than the user starts to sort dices
        setTimeout(function () {
            if (dice.dataset.result === "tetes_de_mort") {
                // Skull dices are automatically added and locked to the save area
                dice.classList.add("saved-dice", "locked-dice");
                savedDiceContainer.appendChild(dice);
            } else if (finishedPlayerTour == false) {
                // Adding the die chosen by the user to the save area, or remove it if it's already there
                dice.onclick = function () {
                    if (!dice.classList.contains("saved-dice")) {
                        saveDice(dice);
                    } else {
                        unsaveDice(dice);
                    }
                };

                diceContainer.appendChild(dice);

                // Deblocking the buttons' click after launch
                rollDiceButton.disabled = false;
                nextTurnButton.disabled = false;
            }
        }, 1500);
    });

    // Definin the maximun number of skull dices than the user can reach
    let totalSkullNumbers = 0;
    switch (playerTour.getCarteTiree().nom) {
        case 'tete_de_mort':
            totalSkullNumbers = 9;
            break;
        case 'tete_de_mort_2':
            totalSkullNumbers = 10;
            break;
        default:
            totalSkullNumbers = 8;
    }

    setTimeout(function () {
        // Stopping the player's turn if he doesn't have a skull dice in his last dices' launch, or if he had enough identical dices for win the game
        if (diceTypeCount["tetes_de_mort"] === 0 ||  diceTypeCount["tetes_de_mort"] === totalSkullNumbers) {
            let message = '';
            switch (diceTypeCount["tetes_de_mort"]) {
                case 0:
                    message = 'Votre tour est terminé, vous n\'avez pas obtenu de tête de mort sur ce lancer !';
                    break;
                case 8:
                    message = 'La chance, vous avez obtenu toutes les têtes de mort !';
                    break;
            }

            document.getElementById("message-container").textContent = message;
            rollDiceButton.disabled = true;
            nextTurnButton.style.opacity = "1";
        }

        // Getting the number a skull dices obtained to calculate the potential score to retire to other players
        const nbTetesMort = savedDiceContainer.querySelectorAll('div[data-result="tetes_de_mort"]').length;
        calculateNegativePoints(nbTetesMort);
    }, 1500);
}


/*************************************
 Moving to the next turn requested by the player in Dead Island mode
 *************************************/
function nextTurnDeadIsland() {
    const minusPoints = parseFloat(document.querySelector('#potential-score span').textContent);

    // Going through the players' list to deduct points from all of them except the current player
    const playersListItems = document.querySelectorAll("#players-list li");
    for (let i = 0; i < gameData.players.length; i++) {
        // Checking if the current index isn't that of the current player
        if (i !== currentPlayerIndex) {
            // Substracting the amount specified from the score
            scores[i] += minusPoints;

            // The score is reduced to 0 if it was supposed to be negative
            if (scores[i] <0) {
                scores[i] = 0;
            }
        }

        playersListItems[i].innerHTML = `${gameData.players[i]} - Score: ${scores[i]} <div class="player-image"></div>`;
    }


    // Deleting all the contents of dices' containers
    diceContainer.innerHTML = '';
    savedDiceContainer.innerHTML = '';

    // Go to the next player
    currentPlayerIndex = (currentPlayerIndex + 1) % gameData.players.length;

    // Finishing the Dead Island Mode
    outOfDeadIsland();

    // Starting the next player's turn
    startPlayerTour();
}

/*************************************
 Releasing from the Dead Island mode
 *************************************/
function outOfDeadIsland() {
    playerTour.setModeTeteDeMort(false);

    // Restoring the default functions for the buttons
    rollDiceButton.onclick = rollDice;
    nextTurnButton.onclick = nextTurn;

    // Change the background music
    const horrorSound = document.getElementById('horror-sound');
    horrorSound.pause();
    const bgSound = document.getElementById('bg-sound');
    bgSound.play();

    // Restoring the default display for the message
    document.getElementById("message-container").classList.remove('visible')
    document.getElementById("message-container").textContent = "Vous avez perdu ! Au suivant !";
}
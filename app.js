class Tour {
    constructor() {
        this.tetesDeMort = 0;
        this.singes = 0;
        this.perroquets = 0;
        this.diamonds = 0;
        this.pieces = 0;
        this.vies = 1; 
        this.banque = 0; 
        this.objectif = null; 
        this.multiplier = 1; 
        this.carteTiree = null; 
    }

    setCarteTiree(carte) {
        this.carteTiree = carte;
    }

    ajouterTeteDeMort(nombre = 1) {
        this.tetesDeMort += nombre;
    }

    ajouterSinge(nombre = 1) {
        this.singes += nombre;
    }

    ajouterPerroquet(nombre = 1) {
        this.perroquets += nombre;
    }

    ajouterDiamond(nombre = 1) {
        this.diamonds += nombre;
    }

    ajouterPiece(nombre = 1) {
        this.pieces += nombre;
    }

    ajouterVie(nombre = 1) {
        this.vies += nombre;
    }

    appliquerCarte(carte) {
        carte.appliquerEffet(this);
    }

    reset() {
        this.tetesDeMort = 0;
        this.singes = 0;
        this.perroquets = 0;
        this.diamonds = 0;
        this.pieces = 0;
        this.vies = 1;
        this.banque = 0;
        this.objectif = null;
        this.multiplier = 1;
    }

    mettreAJour(resultats) {
        this.tetesDeMort += resultats['Tete de mort'];
        this.singes += resultats['Singe'];
        this.perroquets += resultats['Perroquet'];
        this.diamonds += resultats['Diamond'];
        this.pieces += resultats['Piece'];
        this.Epee += resultats['Epee'];
    }

    getTetesDeMort() {
        return this.tetesDeMort;
    }

    getSinges() {
        return this.singes;
    }

    getPerroquets() {
        return this.perroquets;
    }

    getDiamonds() {
        return this.diamonds;
    }

    getPieces() {
        return this.pieces;
    }

    getVies() {
        return this.vies;
    }

    getBanque() {
        return this.banque;
    }

    getObjectif() {
        return this.objectif;
    }

    getMultiplier() {
        return this.multiplier;
    }
}

class Carte {
    constructor(nom, effet) {
        this.nom = nom;
        this.effet = effet;
    }

    appliquerEffet(tour) {
        this.effet(tour);
    }
}

const cartes = {
    teteDeMort: new Carte("Tête de Mort", (tour) => tour.ajouterTeteDeMort(1)),
    teteDeMort2: new Carte("Tête de Mort 2", (tour) => tour.ajouterTeteDeMort(2)),
    piece: new Carte("Pièce", (tour) => tour.ajouterPiece(1)),
    diamant: new Carte("Diamant", (tour) => tour.ajouterDiamond(1)),
    gardienne: new Carte("Gardienne", (tour) => tour.ajouterVie(1)),
    bateau: new Carte("Bateau", (tour) => tour.objectif = "Atteindre un objectif"),
    pirate: new Carte("Pirate", (tour) => tour.multiplier *= 2),
    ileAuTresor: new Carte("L'île au Trésor", (tour) => tour.banque += tour.getPieces() + tour.getDiamonds()),
};

class De {
    constructor() {
        this.faces = ['Singe', 'Diamond', 'Piece', 'Tete de mort', 'Perroquet', 'Epee'];
    }

    lancer() {
        const randomIndex = Math.floor(Math.random() * this.faces.length);
        return this.faces[randomIndex];
    }
}

function lancerDe() {
    const de = new De();
    return de.lancer();
}

function lancer8Des() {
    const de = new De();
    const resultats = {
        Singe: 0,
        Diamond: 0,
        Piece: 0,
        'Tete de mort': 0,
        Perroquet: 0,
        Epee: 0
    };

    for (let i = 0; i < 8; i++) {
        const resultat = de.lancer();
        resultats[resultat]++;
    }

    return resultats;
}

function afficherResultatsDes(resultats) {
    const resultatsDiv = document.getElementById('resultatsDes');
    resultatsDiv.innerHTML = '<h2>Résultats des Dés</h2>';
    for (const [face, count] of Object.entries(resultats)) {
        resultatsDiv.innerHTML += `<span>${face}: ${count}</span>`;
    }
}

function afficherEtatTour(tour) {
    const etatTourDiv = document.getElementById('etatTour');
    etatTourDiv.innerHTML = '<h2>État du Tour</h2>';
    etatTourDiv.innerHTML += `<span>Têtes de Mort: ${tour.getTetesDeMort()}</span>`;
    etatTourDiv.innerHTML += `<span>Singes: ${tour.getSinges()}</span>`;
    etatTourDiv.innerHTML += `<span>Perroquets: ${tour.getPerroquets()}</span>`;
    etatTourDiv.innerHTML += `<span>Diamants: ${tour.getDiamonds()}</span>`;
    etatTourDiv.innerHTML += `<span>Pièces: ${tour.getPieces()}</span>`;
    etatTourDiv.innerHTML += `<span>Vies: ${tour.getVies()}</span>`;
    etatTourDiv.innerHTML += `<span>Banque: ${tour.getBanque()}</span>`;
    etatTourDiv.innerHTML += `<span>Objectif: ${tour.getObjectif() ? tour.getObjectif() : 'Aucun'}</span>`;
    etatTourDiv.innerHTML += `<span>Multiplicateur: x${tour.getMultiplier()}</span>`;
    etatTourDiv.innerHTML += `<span>Carte Tirée: ${tour.carteTiree ? tour.carteTiree.nom : 'Aucune'}</span>`; // Afficher la carte tirée
}


function lancerDes() {
    const resultats = lancer8Des();
    afficherResultatsDes(resultats);
    monTour.mettreAJour(resultats);

    const carteTiree = tirerCarteAleatoire();
    carteTiree.appliquerEffet(monTour);
    monTour.setCarteTiree(carteTiree); // Mettre à jour la carte tirée
    afficherCarteTiree(carteTiree);

    afficherEtatTour(monTour);
}


const monTour = new Tour();

function appliquerCarte(nomCarte) {
    const carte = cartes[nomCarte];
    if (carte) {
        monTour.appliquerCarte(carte);
        afficherEtatTour(monTour);
    } else {
        alert('Carte non trouvée!');
    }
}
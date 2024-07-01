"use strict";
class De {
    constructor() {
        this.faces = ['Singe', 'Diamond', 'Piece', 'Tete de mort', 'Perroquet', 'Epee'];
    }

    lancer() {
        const randomIndex = Math.floor(Math.random() * this.faces.length);
        return this.faces[randomIndex];
    }
}
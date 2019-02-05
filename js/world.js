// Définition de 2 personnages et d'une map
const player1=new Character("Brad",100,10,"character.png");
const player2=new Character("Igor",100,10,"character2.png");
const testMap = new Map(10,10,64,"medieval");

$(function(){

testMap.initGame();

// Affichage de la map une fois initialisée
// Attention voir s'il n'y pas d'incidence ou si on peut afficher à tout moment (dans ce cas on parlera plutôt d'update)
testMap.displayMap();

// Test déplacement
player1.deplace(testMap);

});

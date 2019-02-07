// Définition de 2 personnages et d'une map
const player1=new Character("Brad",100,10,"character.png");
const player2=new Character("Igor",100,10,"character2.png");
const testMap = new Map(10,10,64,"medieval");

$(function(){

    $('#playNow').one('click', function(){
        testMap.initGame(10,4,2);
    }
    );

});

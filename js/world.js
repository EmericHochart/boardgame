// Définition de 2 personnages et d'une map
const player1=new Character("Brad",100,10,"character.png");
const player2=new Character("Igor",100,10,"character2.png");
const player3=new Character("Clint",100,10,"archer.png");

$(function(){

    // Autorisation des tooltips sur la page
    $('[data-toggle="tooltip"]').tooltip()

    $('#playNow').one('click', function(){
        const testMap = new Map(10,10,64,"desert");
        testMap.initGame(10,4,3);
    }
    );

});

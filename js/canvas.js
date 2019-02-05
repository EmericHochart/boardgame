$(function() {
    // test sur l'outil canvas avec jQuery
    // Le but est d'utiliser canvas pour afficher les tiles sur la map.
    // Recherche de la meilleure stratégie.
    
    
   var ts = new Tileset("assets/images/tileset.png");

   function displayCanvas(){
        // On vide le div contenant le plateau
        let boardElt=$('#board');
        boardElt.html("");   
        // Chaque case est un élément du tableau à deux dimensions
        // On parcours les lignes
        for (let i=0; i<testMap.maxLine;i++){
            // On crée un div pour chaque ligne avec un identifiant unique et une classe ligne
            let ligne=$('<div/>').attr({id:'L'+i,class:'ligne'});
            // On parcours les colonnes de la ligne
            for (let j=0; j<testMap.maxColumn; j++) {
                // On crée un canvas pour chaque case avec un identifiant unique et une classe caseCanvas
                let caseElt=$('<canvas/>').attr({id:'L'+i+'C'+j,class:'case'});
                // On définit une couleur pour les obstacles 
                //let couleur=(testMap.board[i][j].model=="-1")?"red":"green";
                //caseElt.css('background-color',couleur);
                // On affiche la valeur de model si la case n'est pas un obstacle et n'est pas vide
                let objet=(testMap.board[i][j].model>=1)?testMap.board[i][j].model:"";
                caseElt.html(objet);
                // Ajout des cases à la ligne
                caseElt.appendTo(ligne);
                let canvasElt = caseElt[0];
                // taille
                canvasElt.width=32;
                canvasElt.height=32;
                let ctxElt = canvasElt.getContext('2d');
                (testMap.board[i][j].model=="-1")?ts.dessinerTile(3, ctxElt, 0, 0):ts.dessinerTile(1, ctxElt, 0, 0);
                
            
            };
            // Ajout des lignes au plateau
            ligne.appendTo(boardElt);
        };
    };

   
   ts.image.onload = function() {
    displayCanvas();
    };

});
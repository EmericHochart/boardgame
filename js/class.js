class Map {

    constructor(maxLine,maxColumn,size=64,world="medieval"){
        this.maxLine = maxLine;
        this.maxColumn = maxColumn;
        this.size = size;
        this.world = "../boardgame/assets/images/"+world+"/";
        this.board = new Array();
    }

    initGame(obstacles,weapon,player){
        this.initMap();
        this.initObstacle(obstacles);
        this.initWeapon(weapon);
        this.initPlayer(player);
    }
    
    initMap(){
        for (let i = 0 ; i < this.maxLine ; i++) {
            this.board[i] = new Array();
            for (let j = 0 ; j < this.maxColumn ; j++) {
                this.board[i][j] = new Case(i,j);
                this.board[i][j].isEmpty(true);
            }
        };
    }

    initObstacle(percentage=10){
        percentage = (percentage>25)?25:percentage;
        for (let k = 0 ; k < (percentage/100*this.maxLine*this.maxColumn) ; k++) {
            let [x,y] = this.randomCoordinates();
            (!this.board[x][y].isEmpty())?k--:this.board[x][y].isObstacle(true);
        };
    }
    
    // TO DO 
    // ATTENTION ici on place l'arme sur une case vide et sans conteneur, l'arme est unique
    initWeapon(amount=4){
        let armesUniques = new Array(amount);

        for (let l = 0 ; l < amount ; l++) {
            let [x,y] = this.randomCoordinates();
            let square = this.board[x][y];
            if (square.isObstacle() || square.conteneur!==null) {
                l--;
            }
            else
            {
                let condition = true;
                while( condition == true) {
                    condition = false;
                    square.hasWeapon("weapon");
                    let weapon = square.conteneur[0];
                    // On compare les armes via leur nom qui est unique !!!! Attention !!!
                    $.each(armesUniques,function(index,value) {
                        if (value == weapon.name) {
                            square.conteneur[0].posX = null;
                            square.conteneur[0].posY = null;
                            // là on vide complètement le conteneur : A AMELIORER
                            square.removeConteneur();
                            condition = true;
                        };
                    });
                }
                armesUniques[l] = square.conteneur[0].name;
            };
        };
    }

    // TO DO : vérifier que le nombre de joueurs n'est pas trop grand 
    // TO DO : mettre des players différents
    initPlayer(player=2){ 
        let posPlayer = new Array();
        
        for (let p = 0 ; p < player ; p++) {
            let [x,y] = this.randomCoordinates();
            let square = this.board[x][y];
            // Vérifier ici car risque de redondance dans le code !!!!!!!!!!!!!!!
            // ici utiliser une méthode getter sur conteneur plutôt
            if (square.isObstacle()||square.conteneur!=null) {
                p--;
            }
            else {
                        
                // pour le premier joueur il peut se placer où il veut
                if(p==0) {
                    // On place le joueur 1 dans le conteneur de la case
                    // A MODIFIER ................................................................
                    square.setConteneur(player1);
                    posPlayer.push([x,y]);

                    // Debug
                    console.log("Joueur 1 : Brad");
                    console.log([x,y]);
                    
                }
                else {
                    // on vérifie que le joueur p n'est pas à côté d'un autre joueur
                    let alone = true;
                    $.each(posPlayer,function(index,value){
                        if ((Math.abs(x-value[0])<=1)&&(Math.abs(y-value[1])<=1)) {
                            alone = false;
                        };
                    });
                    
                    if (alone==true) {
                        // A MODIFIER ............................................................
                        square.setConteneur(player2);
                        posPlayer.push([x,y]);
                        // Debug
                        console.log("Joueur 2 : Igor");
                        console.log([x,y]);
                    }
                    else {
                        p--;
                    };
                };
            };
        };
    }
    
    displayMap(){
        let map = this;
        let boardElt = $('#board');
        boardElt.css('width',(this.maxColumn*this.size)+"px").css('height',(this.maxLine*this.size)+"px").html("");
        
        $.each(map.board,function(abscisse,ligne) {
            
            let ligneElt = $('<div/>').attr({id:'L'+abscisse,class:'ligne'});
            ligneElt.appendTo(boardElt);
            
            $.each(ligne,function(ordonnee,cellulle) {
                
                map.board[abscisse][ordonnee].displayCase(map);
                map.board[abscisse][ordonnee].displayConteneur(map);
                
            });
        });
    }
    removeDisplayMove(){
        $('.move').remove();
    }
    randomCoordinates(){
        let x = Math.floor(Math.random()*this.maxLine);
        let y = Math.floor(Math.random()*this.maxColumn);
        return [x,y];
    }

    // TO DO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    fight(player1,player2){
        console.log("combat");
        player1.attack(player2);
        player1.describe();
        player2.describe();
        if (player2.health>=0){
            this.fight(player2,player1);
        }
        else {
            console.log("Combat terminé");
        }
        
    }

}

class Case {

    constructor(line,column,ground=0,image=null){
        this.line=line;
        this.column=column;
        this.ground=ground;
        this.image=image;
        this.conteneur=null;
    }
     
    displayCase(map){
        let ligneElt = '#L'+this.line;
        let caseElt = $('<div/>').attr({id:'L'+this.line+'C'+this.column,class:'case'});
        this.setCaseSize(map,caseElt);
        this.setBackground(map,caseElt,this.image);  
        caseElt.appendTo(ligneElt);              
    }
    displayMove(map){
        let idElt = '#L'+this.line+'C'+this.column;
        let divElt = $('<div/>').attr({class : 'move'});
        this.setCaseSize(map,divElt);
        this.setBackground(map,divElt,"move.png");
        divElt.appendTo(idElt);
    }
    setCaseSize(map,elt){
        elt.css('left',this.column*map.size).css('top',this.line*map.size).css('width',map.size).css('height',map.size).css('background-size',map.size);
    }
    setBackground(map,elt,image){
        elt.css('background-image', "url('"+map.world+image+"')");
    }


    // TO DO : gestion de plusieurs éléments dans le conteneur
    displayConteneur(map){
        
        // Si le conteneur est vide, on affiche rien
        // Si le conteneur n'est pas vide alors il contient un élément ou plus :
        if (this.conteneur!==null) {
            
            // TO DO : voir si on peut pas optimiser les 3 lignes en dessous 
            let divElt = $('<div/>').attr({id:'ConteneurL'+this.line+'C'+this.column,class:'conteneur'});
            this.setCaseSize(map,divElt);
            divElt.appendTo('#L'+this.line+'C'+this.column);
            
            
            // Si le conteneur contient un personnage on l'affiche sinon on affiche le premier item
            let inventaire = this.conteneur;
            $.each(inventaire,function(index,value) {
                
                let url = "url('"+map.world+value.image+"')";
                divElt.css('background-image', url);

                if(value instanceof Character) {
                    //Affichage du personnage
                    // ATTENTION id du personnage à revoir 
                    divElt.attr('id',value.name);
                    divElt.css('z-index','150');
                }
                else {
                    //Affichage des armes ???????????????????????????????????????
                                    
                }
            });    
        };
    }

    // TO DO
    setConteneur(element){
        if(this.conteneur===null) {
            this.conteneur = new Array();
        };
        element.line = this.line;
        element.column = this.column;
        this.conteneur.push(element);        
    }

    // TO DO : A améliorer
    removeConteneur(element=null){
        if(element===null) {
            this.conteneur = null;
            return true;
        }
        else {
            let inventory = this.conteneur;
            // TO DO : vérifier que c'est un array car il peut être null
            $.each(inventory,function(index,value) {
                if(element.name==value.name) {
                    inventory.splice(index,1);
                    return true;
                };
            });
            return false;
        };
    }

    // TO DO : 
    hasWeapon(model=null){
        let conteneur = this.conteneur;
        if(model===null) {
            if (conteneur!==null) {
                let condition = false;
                $.each(conteneur,function(index,value) {
                    if (value instanceof Item && value.model=="weapon"){
                        condition = true;
                    }
                });
                return condition;
            }
            else {
                return false;
            }
        }
        else { 
            this.setConteneur(this.randomItem("weapon"));
        }
    }
  
    // REVOIR la méthode
    // TO DO : Setter
    hasPlayer(player=null){
        let conteneur = this.conteneur;
        if(player===null) {
            if (conteneur!==null) {
                let condition = false;
                $.each(conteneur,function(index,value) {
                    if (value instanceof Character) {
                        condition = true;
                    }
                });
                return condition;
            }
            else {
                return false;
            }
        }
        else {
            // On indique qu'on veut que la case ait un joueur
            // TO DO
        }

    }

    // TO DO
    randomItem(model){
        // ICI MODIFIER LE 4 et vérifier qu'il y a assez d'items demandés
        let aleatoire = Math.floor(Math.random()*4);
        switch (aleatoire) {
            case 1:
            return {
            name: "Dague",
            image : "dagger.png",
            posX: null,
            posY: null,
            model: "weapon",
            damage: "15"
            };
            break;
            case 2:
            return {
            name: "Epée",
            image : "sword.png",
            posX: null,
            posY: null,
            model: "weapon",
            damage: "20"
            };
            break;
            case 3:
            return {
            name: "Hache",
            image : "axe.png",
            posX: null,
            posY: null,
            model: "weapon",
            damage: "25"
            };
            break;
            case 4:
            return {
            name: "Marteau",
            image : "hammer.png",
            posX: null,
            posY: null,
            model: "weapon",
            damage: "30"
            };
            break;
            default:
            return {
            name: "Epée en bois",
            image : "woodSword.png",
            posX: null,
            posY: null,
            model: "weapon",
            damage: "10"
            };
            break;
        }
    }

    isEmpty(ground=null){
        if(ground===null) {
            return (this.ground==0)?true:false;
        }
        else {
            this.ground = 0;
            this.image = "empty.png";
        }
    }    
    isObstacle(ground=null){
        if(ground===null) {
            return (this.ground==-1)?true:false;
        }
        else {
            this.ground = -1;
            this.image = "obstacle.png";
        }
    }
    
}

class Character {
    
    constructor(name,health,strength,image="character.png",line,column){
        this.name = name;
        this.health = health;
        this.strength = strength;
        this.image = image;
        this.line = line;
        this.column = column;
    }

    // TO DO
    describe(){
        let plural = (this.health==0)?"":"s";
        return console.log(`${this.name} a ${this.health} point${plural} de vie et ${this.strength} points de force. Sa position est ${this.line},${this.column}`);
        
    }

    // TO DO : actions lors du drop, affecter nouvelles variables, remove variables, stopper draggable etc...
    // TO DO : ajouter condition sur joueur adverse !!!!!!!
    // TO DO : faire méthode d'attribution des caractéristiques CSS pour une case
    deplace(map){
        let player = this;
        let line = this.line;
        let column = this.column;
        
        let selElt = '#'+this.name;  
        $(selElt).draggable({containment : '#board' , revert : 'invalid', snap : true, grid : [map.size , map.size]});
                
        // Modèle de déplacement
        // Déplacement de 3 cases autour du joueur
        
        // Déplacement à droite
        for (let i = 1 ; i < 4 ;i++) {
            if ((column+i)>=0&&(column+i)<=map.maxColumn-1) {
                let idElt = '#L'+line+'C'+(column+i);
                if(map.board[line][column+i].ground!==-1&&map.board[line][column+i].hasPlayer()==false) {
                    map.board[line][column+i].displayMove(map);
                    
                    $(idElt).droppable({
                                            accept : selElt, 
                                            drop : function(){
                                                
                                                $(selElt).draggable( "destroy" );

                                                // IL FAUDRAIT DEPLACER LE selElt mais pas vraiment gênant à vérifier
                                                player.line = line;
                                                player.column = column+i;
                                                map.removeDisplayMove();
                                                $( '.ui-droppable' ).droppable( "destroy" );
                                                map.board[line][column].removeConteneur(player);
                                                
                                                map.board[line][column+i].setConteneur(player);
                                                
                                                player.characterAround(map);
                                                
                                                // Simulation temporaire de tour par tour
                                                if (player1.health>=0&&player2.health>=0) {
                                                    if (player==player1) {
                                                        player2.deplace(map);}
                                                    else {
                                                            player1.deplace(map);
                                                    };
                                                    };
                                            }
                                        });
                }
                else {
                    i = 4;
                }
            }
        }
        // Déplacement à gauche
        for (let i = -1 ; i > -4 ; i--) {
            if ((column+i)>=0&&(column+i)<=map.maxColumn-1) {
                let idElt = '#L'+line+'C'+(column+i);
                if(map.board[line][column+i].ground!==-1&&map.board[line][column+i].hasPlayer()==false) {
                    map.board[line][column+i].displayMove(map);
                    
                    $(idElt).droppable({
                                            accept : selElt, 
                                            drop : function(){
                                                player.line = line;
                                                player.column = column+i;
                                                $(selElt).draggable( "destroy" );
                                                map.removeDisplayMove();
                                                $( '.ui-droppable' ).droppable( "destroy" );
                                                map.board[line][column].removeConteneur(player);
                                                
                                                map.board[line][column+i].setConteneur(player);
                                                
                                                player.characterAround(map);
                                                // Simulation temporaire de tour par tour
                                                if (player1.health>=0&&player2.health>=0) {
                                                    if (player==player1) {
                                                        player2.deplace(map);}
                                                    else {
                                                            player1.deplace(map);
                                                    };
                                                    };
                                            }
                                        });
                }
                else {
                    i = -4;
                }
            }
        }
        // Déplacement en haut
        for (let j = -1 ; j > -4 ; j--) {
            if ((line+j)>=0&&(line+j)<=map.maxLine-1) {
                let idElt = '#L'+(line+j)+'C'+column;
                if(map.board[line+j][column].ground!==-1&&map.board[line+j][column].hasPlayer()==false) {
                    map.board[line+j][column].displayMove(map);
                    
                    $(idElt).droppable({
                                            accept : selElt, 
                                            drop : function(){
                                                player.line = line+j;
                                                player.column = column;
                                                $(selElt).draggable( "destroy" );
                                                map.removeDisplayMove();
                                                $( '.ui-droppable' ).droppable( "destroy" );
                                                map.board[line][column].removeConteneur(player);
                                                
                                                map.board[line+j][column].setConteneur(player);
                                                
                                                player.characterAround(map);
                                                // Simulation temporaire de tour par tour
                                                if (player1.health>=0&&player2.health>=0) {
                                                    if (player==player1) {
                                                        player2.deplace(map);}
                                                    else {
                                                            player1.deplace(map);
                                                    };
                                                    };
                                            }
                                        });
                }
                else {
                    j = -4;
                }
            }
        }
        // Déplacement en bas
        for (let j = 1 ; j < 4 ; j++){
            if ((line+j)>=0&&(line+j)<=map.maxLine-1) {
                let idElt = '#L'+(line+j)+'C'+column;
                if(map.board[line+j][column].ground!==-1&&map.board[line+j][column].hasPlayer()==false) {
                    map.board[line+j][column].displayMove(map);
                    
                    $(idElt).droppable({
                                            accept : selElt, 
                                            drop : function(){
                                                player.line = line+j;
                                                player.column = column;
                                                $(selElt).draggable( "destroy" );
                                                map.removeDisplayMove();
                                                $( '.ui-droppable' ).droppable( "destroy" );
                                                map.board[line][column].removeConteneur(player);

                                                map.board[line+j][column].setConteneur(player);

                                                player.characterAround(map);
                                                // Simulation temporaire de tour par tour
                                                if (player1.health>=0&&player2.health>=0) {
                                                if (player==player1) {
                                                    player2.deplace(map);}
                                                else {
                                                        player1.deplace(map);
                                                };
                                                };
                                            }
                                        });
                }
                else {
                    j = 4;
                }
            }
        }
   
    }

    // TO DO
    characterAround(map){
        
        // Nous choisissons de vérifier les 4 cases autour plutôt que de regarder par rapport à chaque joueur
        

        let characters = new Array();

        if (this.column+1<=map.maxColumn-1) {
            if (map.board[this.line][this.column+1].hasPlayer()) {
                map.fight(player1,player2);
            }
            else {
                console.log("test");
            };
            
        };
        if (this.column-1>=0) {
            map.board[this.line][this.column-1].hasPlayer()? map.fight(player1,player2) : console.log("test");
        };
        if (this.line+1<=map.maxLine-1) {
            map.board[this.line+1][this.column].hasPlayer()? map.fight(player1,player2) : console.log("test");
        };
        if (this.line-1>=0) {
            map.board[this.line-1][this.column].hasPlayer()? map.fight(player1,player2) : console.log("test");
        };
        

        
        
    }

    // TO DO
    attack(target){
        // Définition d'une attaque réussi sur le principe du pile ou face et/ou du bandit manchot ?
        let faceToFace = [];
        for (let i = 0 ; i < 3 ; i++) {
            faceToFace[i] = (Math.random()<0.5)?0:1;
        };
        console.log(faceToFace);
        if (equalityTable(faceToFace,[1,1,1])) {
            // Définition de la formule de dommage
            //let damage=Math.floor(this.strength*Math.random());
            let damage = this.strength;
            // Calcul de la vie de la cible
            target.health-= damage;
            return console.log(`${this.name} a attaqué ${target.name} qui perd ${damage} de vie. Ses points de vie sont réduits à ${target.health}.`);
        }
        else {
            return console.log(`${this.name} a raté son attaque sur ${target.name}.`);
        }
    }

    // TO DO
    defend(target){

    }
}

class Item{
    
    constructor(name,image,line,column,model){
        this.name = name;
        this.image = image;
        this.line = line;
        this.column = column;
        this.model = model;
    }
    
}
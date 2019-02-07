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
        this.displayMap();
        // Test déplacement
        player1.deplace(this);
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
                            square.conteneur[0].line = null;
                            square.conteneur[0].column = null;
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
        let weaponBasic = new Item("Epée en bois","woodSword.png",null,null,"weapon");
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
                    // A MODIFIER : ajout de l'arme de base manuellement
                    
                    player1.setConteneur(weaponBasic);
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
                        // A MODIFIER : ajout de l'arme de base manuellement
                        player2.setConteneur(weaponBasic);
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
            alert("Combat terminé");
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
        
        let that = this;
        let divElt;
        let persoElt;
        
        // Si le conteneur est vide, on ne crée pas de div conteneur

        // Si le conteneur n'est pas vide alors il contient un élément ou plus :
        if (this.conteneur!==null) {
            
            // Si le conteneur n'a pas d'affichage on le crée sinon on le récupère
            if ($('#ConteneurL'+this.line+'C'+this.column).length == 0) {
            divElt = $('<div/>').attr({id:'ConteneurL'+this.line+'C'+this.column,class:'conteneur'});
            this.setCaseSize(map,divElt);
            divElt.appendTo('#L'+this.line+'C'+this.column);
            }
            else {
                divElt = $('#ConteneurL'+this.line+'C'+this.column);
                
            };
            
            
            // Si le conteneur contient :
            // 1 personnage alors on n'affiche que lui (on crée un div personnage dans le div conteneur
            // sinon si on a qu'un item on affiche l'item (change l'url background) 
            // TO DO : sinon il y a plusieurs items on affiche un coffre et on lui ajoute un évènement ouverture ...
            let inventaire = this.conteneur;
            $.each(inventaire,function(index,value) {
                
                let url = "url('"+map.world+value.image+"')";
                
                //Affichage du personnage
                if(value instanceof Character) {
                    
                    if ($('#'+value.name).length == 0) {
                        persoElt = $('<div/>').attr({id: value.name, class:'conteneur'});
                        persoElt.css('background-image', url);
                        that.setCaseSize(map,persoElt);
                        persoElt.appendTo('#board');
                        persoElt.css('z-index','150');
                    }
                    else {
                        persoElt = $('#'+value.name);
                    };
                    
                    
                }
                else {
                    divElt.css('background-image', url);        
                }
            });    
        };
    }

    // Méthode qui ajoute un élément dans le conteneur
    setConteneur(element){
        if(this.conteneur===null) {
            this.conteneur = new Array();
        };       
        element.line = this.line;
        element.column = this.column;
        this.conteneur.push(element);        
    }

    // Méthode qui vide entièrement le conteneur ou enlève un élément précis du conteneur
    removeConteneur(element=null){
        if(element===null) {
            this.conteneur = null;
            return true;
        }
        else {
            let inventory = this.conteneur;
            
            $.each(inventory,function(index,value) {
                if(element==value) {
                    inventory.splice(index,1);
                    return true;
                };
            });
            return false;
        };
    }

    // Méthode qui retourne la dernière arme d'un conteneur s'il est présent sinon une chaîne vide 
    getWeapon(){
        let inventory = this.conteneur;
        let weapon="";
            $.each(inventory,function(index,value) {
                if (value instanceof Item && value.model==="weapon"){
                    weapon = value;
                }
            });
        return weapon;
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
            return new Item ("Dague","dagger.png",null,null,"weapon");
            break;
            case 2:
            return new Item ("Epée","sword.png",null,null,"weapon");
            break;
            case 3:
            return new Item ("Hache","axe.png",null,null,"weapon");
            break;
            case 4:
            return new Item ("Marteau","hammer.png",null,null,"weapon");
            break;
            default:
            return new Item ("Epée en bois","woodSword.png",null,null,"weapon");
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

    // PROGRESS ........................................................................

    weaponOnPath(map,player,originLine,originColumn){
        // Méthode qui regarde si une arme est sur le chemin
        // besoin de la position actuelle et de l'ancienne
        // Normalement on doit pouvoir obtenir player dans la case ...
        
        let signLine = Math.sign(this.line-originLine);
        let signColumn = Math.sign(this.column-originColumn);
        
       
        switch(signLine) {
            case 1 :
                
                for (let i = originLine+1 ; i <= this.line ; i++){
                    if (map.board[i][originColumn].hasWeapon()==true) {
                        let weaponConteneur = map.board[i][originColumn].getWeapon();
                        map.board[i][originColumn].removeConteneur(weaponConteneur);
                        let weaponCharacter = player.getWeapon();
                        player.removeConteneur(weaponCharacter);
                        map.board[i][originColumn].setConteneur(weaponCharacter);
                        player.setConteneur(weaponConteneur);
                        $('#ConteneurL'+i+'C'+originColumn).css('background-image',"url('"+map.world+weaponCharacter.image+"')");
                        /// AFFICHAGE DE L'ARME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                    }
                };
                break;
            case -1 :
                
                for (let i = originLine-1 ; i >= this.line ; i--){
                    if (map.board[i][originColumn].hasWeapon()) {
                        let weaponConteneur = map.board[i][originColumn].getWeapon();
                        map.board[i][originColumn].removeConteneur(weaponConteneur);
                        let weaponCharacter = player.getWeapon();
                        player.removeConteneur(weaponCharacter);
                        map.board[i][originColumn].setConteneur(weaponCharacter);
                        player.setConteneur(weaponConteneur);
                        $('#ConteneurL'+i+'C'+originColumn).css('background-image',"url('"+map.world+weaponCharacter.image+"')");
                    }
                }
                break;
            case 0 :
                
                switch(signColumn){
                    case 1:
                        for (let j = originColumn+1 ; j <= this.column ; j++){
                            if (map.board[originLine][j].hasWeapon()) {
                                let weaponConteneur = map.board[originLine][j].getWeapon();
                                map.board[originLine][j].removeConteneur(weaponConteneur);
                                let weaponCharacter = player.getWeapon();
                                player.removeConteneur(weaponCharacter);
                                map.board[originLine][j].setConteneur(weaponCharacter);
                                player.setConteneur(weaponConteneur);
                                $('#ConteneurL'+originLine+'C'+j).css('background-image',"url('"+map.world+weaponCharacter.image+"')");
                            }
                        }
                    break;
                    case -1:
                        for (let j = originColumn-1 ; j >= this.column ; j--){
                            if (map.board[originLine][j].hasWeapon()) {
                                let weaponConteneur = map.board[originLine][j].getWeapon();
                                map.board[originLine][j].removeConteneur(weaponConteneur);
                                let weaponCharacter = player.getWeapon();
                                player.removeConteneur(weaponCharacter);
                                map.board[originLine][j].setConteneur(weaponCharacter);
                                player.setConteneur(weaponConteneur);
                                $('#ConteneurL'+originLine+'C'+j).css('background-image',"url('"+map.world+weaponCharacter.image+"')");
                            }
                        }
                    break;
                }
                break;
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
        this.conteneur = null;
    }

    // TO DO
    describe(){
        let plural = (this.health==0)?"":"s";
        return console.log(`${this.name} a ${this.health} point${plural} de vie et ${this.strength} points de force. Sa position est ${this.line},${this.column}`);
        
    }

    
    // TO DO : ajouter condition sur joueur adverse !!!!!!!    
    deplace(map){
        let player = this;
        let line = this.line;
        let column = this.column;
        
        let selElt = '#'+player.name;  
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
                                            drop : () => {
                                                map.board[line][column+i].weaponOnPath(map,player,player.line,player.column);
                                                player.stopMove(map,line,column+i);
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
                                            drop : () => {
                                                map.board[line][column+i].weaponOnPath(map,player,player.line,player.column);
                                                player.stopMove(map,line,column+i);
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
                                            drop : () => {
                                                map.board[line+j][column].weaponOnPath(map,player,player.line,player.column);
                                                player.stopMove(map,line+j,column);
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
                                            drop : () => {
                                                map.board[line+j][column].weaponOnPath(map,player,player.line,player.column);
                                                player.stopMove(map,line+j,column);
                                            }
                                        });
                }
                else {
                    j = 4;
                }
            }
        }
   
    }

    // TO DO : améliorer
    stopMove(map,newLine,newColumn){
        let selElt = '#'+this.name; 
        $(selElt).draggable( "destroy" );
        map.removeDisplayMove();
        $( '.ui-droppable' ).droppable( "destroy" );
        map.board[this.line][this.column].removeConteneur(this);        
        map.board[newLine][newColumn].setConteneur(this);        
        this.updateCoordinatesConteneur(); 
        this.characterAround(map);
       
        // Simulation temporaire de tour par tour
        if (player1.health>=0&&player2.health>=0) {
            if (this===player1) {
                player2.deplace(map);}
            else {
                    player1.deplace(map);
            };
        };  
    }

    // TO DO
    characterAround(map){
        
        // Nous choisissons de vérifier les 4 cases autour plutôt que de regarder par rapport à chaque joueur
        

        let characters = new Array();

        if (this.column+1<=map.maxColumn-1) {
            map.board[this.line][this.column+1].hasPlayer()? map.fight(player1,player2) : console.log("test");          
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

    // Méthode qui retourne l'arme d'un conteneur s'il est présent sinon false
    getWeapon(){
        let inventory = this.conteneur;
        let weapon="";
            $.each(inventory,function(index,value) {
                if (value instanceof Item && value.model==="weapon"){
                    weapon = value;
                }
            });
        return weapon;              
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
                if(element==value) {
                    inventory.splice(index,1);
                    return true;
                };
            });
            return false;
        };
    }

    // TO DO : A améliorer
    updateCoordinatesConteneur(){
        let player = this;
        $.each(player.conteneur,function(index,value) {
                value.line = player.line;
                value.column = player.column;                
        });            
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
class Case {

    constructor(line,column,ground=0,image=null){
        this.line = line;
        this.column = column;
        this.ground = ground;
        this.image = image;
        this.conteneur = null;
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
    
    displayConteneur(map){
        // TODO : managing multiple items in the container
        let that = this;
        let divElt;
        let persoElt;        
        // If the container is not empty then it contains one or more elements
        if (this.conteneur!==null) {
            // If the container has no display it is created otherwise it is retrieved
            if ($('#ConteneurL'+this.line+'C'+this.column).length == 0) {
            divElt = $('<div/>').attr({id:'ConteneurL'+this.line+'C'+this.column,class:'conteneur'});
            this.setCaseSize(map,divElt);
            divElt.appendTo('#L'+this.line+'C'+this.column);
            }
            else {
                divElt = $('#ConteneurL'+this.line+'C'+this.column);
                
            }; 
            // If the container contains 1 character so we only display him otherwise if we have one item we display the item
            let inventaire = this.conteneur;
            $.each(inventaire,function(index,value) {
                // Character Display
                if(value instanceof Character) {
                    let url = "url('"+map.world+"characters/"+value.image+"')";
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
                    // Item Display
                    let url = "url('"+map.world+"weapons/"+value.image+"')";
                    divElt.css('background-image', url);        
                }
            });    
        };
    }

    setConteneur(element){
        if(this.conteneur===null) {
            this.conteneur = new Array();
        };       
        element.line = this.line;
        element.column = this.column;
        this.conteneur.push(element);
    }

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

    getWeapon(){
        let inventory = this.conteneur;
        let weapon = "";
        $.each(inventory,function(index,value) {
            if (value instanceof Item && value.model==="weapon"){
                weapon = value;
            };
        });
        return weapon;
    }

    getCharacter(){
        let inventory = this.conteneur;
        let character = "";
        $.each(inventory,function(index,value) {
            if (value instanceof Character){
                character = value;
            };
        });
        return character;
    }

    // TODO : attention ici le getter met une arme aléatoire
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
            console.log("Not currently managing")
        }
    }

    // TODO : REVOIR la méthode , Setter ?
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
    
    /*
    randomWeapon(){
        let aleatoire = Math.floor(Math.random()*(weapons.length));
        return weapons[aleatoire];
    }
    */

    isEmpty(ground=null){
        if(ground===null) {
            return (this.ground==0)?true:false;
        }
        else {
            this.ground = 0;
            this.image = "empty.png";
        };
    }

    isObstacle(ground=null){
        if(ground===null) {
            return (this.ground==-1)?true:false;
        }
        else {
            this.ground = -1;
            this.image = "obstacle.png";
        };
    }

    // TODO Simplifier à l'aide d'une fonction le code redondant
    weaponOnPath(map,player,originLine,originColumn){
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
                        $('#ConteneurL'+i+'C'+originColumn).css('background-image',"url('"+map.world+"weapons/"+weaponCharacter.image+"')");
                        $('#weapon-'+player.name).attr('src',map.world+"weapons/"+weaponConteneur.image);
                        $('#weapon-'+player.name).attr('title',weaponConteneur.name);

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
                        $('#ConteneurL'+i+'C'+originColumn).css('background-image',"url('"+map.world+"weapons/"+weaponCharacter.image+"')");
                        $('#weapon-'+player.name).attr('src',map.world+"weapons/"+weaponConteneur.image);
                        $('#weapon-'+player.name).attr('title',weaponConteneur.name);
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
                                $('#ConteneurL'+originLine+'C'+j).css('background-image',"url('"+map.world+"weapons/"+weaponCharacter.image+"')");
                                $('#weapon-'+player.name).attr('src',map.world+"weapons/"+weaponConteneur.image);
                                $('#weapon-'+player.name).attr('title',weaponConteneur.name);
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
                                $('#ConteneurL'+originLine+'C'+j).css('background-image',"url('"+map.world+"weapons/"+weaponCharacter.image+"')");
                                $('#weapon-'+player.name).attr('src',map.world+"weapons/"+weaponConteneur.image);
                                $('#weapon-'+player.name).attr('title',weaponConteneur.name);
                            }
                        }
                    break;
                }
                break;
        }

    }
}
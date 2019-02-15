class Character {
    
    constructor(name,health,image,line=null,column=null){
        this.name = name;
        this.health = health;        
        this.image = image;
        this.line = line;
        this.column = column;
        this.conteneur = null;
        this.shield = 0;
    }

    deplace(map){
        let player = this;
        let line = this.line;
        let column = this.column;
        let selElt = '#'+player.name;  
        $(selElt).draggable({containment : '#board' , revert : 'invalid', snap : true, grid : [map.size , map.size]});
        // Movement model : Move 3 squares around the player
        // Move right
        for (let i = 1 ; i < 4 ;i++) {
            // We make sure that the box is in the map
            if ((column+i)>=0&&(column+i)<=map.maxColumn-1) {
                let idElt = '#L'+line+'C'+(column+i);
                // If there is no obstacle or character
                if(map.board[line][column+i].ground!==-1&&map.board[line][column+i].hasPlayer()==false) {
                    // We indicate that we can move the character on this box
                    map.board[line][column+i].displayMove(map);
                    $(idElt).droppable({
                        accept : selElt,
                        drop : () => {
                            // We recover the weapons on the way
                            map.board[line][column+i].weaponOnPath(map,player,player.line,player.column);
                            // Stop the move and start the checks
                            player.stopMove(map,line,column+i);
                        }
                    });
                    // We check if we cross a character
                    if((line+1)<=(map.maxLine-1)&&map.board[line+1][column+i].hasPlayer()==true){
                        break;
                    }
                    else if((line-1)>=0&&map.board[line-1][column+i].hasPlayer()==true){
                        break;
                    };
                }
                else {
                    break;
                };
            };
        };
        // Move left
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
                    if((line+1)<=(map.maxLine-1)&&map.board[line+1][column+i].hasPlayer()==true){
                        break;
                    }
                    else if((line-1)>=0&&map.board[line-1][column+i].hasPlayer()==true){
                        break;
                    };
                }
                else {
                    break;
                };
            };
        };
        // Move up
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
                    if((column+1)<=(map.maxColumn-1)&&map.board[line+j][column+1].hasPlayer()==true){
                        break;
                    }
                    else if((column-1)>=0&&map.board[line+j][column-1].hasPlayer()==true){
                        break;
                    };
                }
                else {
                    break;
                };
            };
        };
        // Move down
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
                    if((column+1)<=(map.maxColumn-1)&&map.board[line+j][column+1].hasPlayer()==true){
                        break;
                    }
                    else if((column-1)>=0&&map.board[line+j][column-1].hasPlayer()==true){
                        break;
                    };                            
                }
                else {
                    break;
                };
            };
        };
    }

    stopMove(map,newLine,newColumn){
        let selElt = '#'+this.name; 
        $(selElt).draggable( "destroy" );
        map.removeDisplayMove();
        $( '.ui-droppable' ).droppable( "destroy" );
        map.board[this.line][this.column].removeConteneur(this);        
        map.board[newLine][newColumn].setConteneur(this);        
        this.updateCoordinatesConteneur(); 
        this.characterAround(map);       
    }

    // TODO : cas où plusieurs joueurs sont autour PROBLEME !!!!!!!!!!!!!!!!
    characterAround(map){
        
        // We choose to check the 4 boxes around rather than looking at each player       
        let nextTurn = false;
        // To the right
        if (this.column+1<=map.maxColumn-1) {
            map.board[this.line][this.column+1].hasPlayer()? map.fight(this,map.board[this.line][this.column+1].getCharacter()) : nextTurn=true;          
        };
        // To the Left
        if (this.column-1>=0) {
            map.board[this.line][this.column-1].hasPlayer()? map.fight(this,map.board[this.line][this.column-1].getCharacter()) : nextTurn=true;;
        };
        // Below
        if (this.line+1<=map.maxLine-1) {
            map.board[this.line+1][this.column].hasPlayer()? map.fight(this,map.board[this.line+1][this.column].getCharacter()) : nextTurn=true;;
        };
        // Up
        if (this.line-1>=0) {
            map.board[this.line-1][this.column].hasPlayer()? map.fight(this,map.board[this.line-1][this.column].getCharacter()) : nextTurn=true;;
        };
        // We check that it remains a character alive
        if (nextTurn == true) {
            if (map.characters.length>1) {
            map.updateCurrent();    
            map.characters[map.current].deplace(map);
            }
            else {
                console.log("Debug");
            }; 
        };
    }

    attack(target){
        // Damage calculation
        let damage = this.conteneur[0].damage*(1-target.shield);
        // Animation of the damage
        $('#damage-'+target.name).html('<b>'+damage+'</>');
        $('#damage-'+target.name).fadeIn('slow');
        $('#damage-'+target.name).fadeOut('slow');
        // Update Health of the target & reset of Shield
        target.health-= damage;
        target.shield = 0;
    }

    defend(){
        // Set Shield at 50%
        this.shield = 0.5;       
    }
    
    updateHealth(shield=null){
        let healthElt = $('#health-'+this.name);        
        if (shield===null){
            // No Shield only Health on UI
            healthElt.attr('aria-valuenow',this.health).css('width',this.health+"%");
            $('#health-'+this.name).css('background-image','none');
        }
        else {
            // Health + Shield on UI
            healthElt.attr('aria-valuenow',this.health).css('width',this.health+"%");
            $('#health-'+this.name).css('background-image','linear-gradient(to right, #ff0000 '+((this.health-shield)*100/this.health)+'%, #0d7ef0 '+(shield*100/this.health)+'%)');
        };
    }
        
    getWeapon(){
        // TODO : for the moment a single weapon in the inventory, to improve to have several weapons of which one equipped
        let inventory = this.conteneur;
        let weapon="";
            $.each(inventory,function(index,value) {
                if (value instanceof Item && value.model==="weapon"){
                    weapon = value;
                }
            });
        return weapon;              
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

    updateCoordinatesConteneur(){
        let player = this;
        $.each(player.conteneur,function(index,value) {
                value.line = player.line;
                value.column = player.column;                
        });            
    }

}
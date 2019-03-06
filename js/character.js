class Character {
    
    constructor(name,health,image,line=null,column=null){
        this.name = name;
        this.health = health;        
        this.image = image;
        this.line = line;
        this.column = column;
        this.container = null;
        this.shield = 0;
    }
    // Moving the character
    deplace(map){
        let player = this;
        let line = this.line;
        let column = this.column;
        let selElt = '#'+player.name; 
        // We make the character draggable 
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
    // We stop moving
    stopMove(map,newLine,newColumn){
        let selElt = '#'+this.name;
        // We destroy the draggable element
        $(selElt).draggable( "destroy" );
        // Displays the displacement boxes
        map.removeDisplayMove();
        // We destroy the droppable element
        $( '.ui-droppable' ).droppable( "destroy" );
        // We remove the character of the container from the original case
        map.board[this.line][this.column].removeContainer(this);  
        // Place the character in the container of the arrival case      
        map.board[newLine][newColumn].setContainer(this);
        // We update the coordinates of the container        
        this.updateCoordinatesContainer();
        // We check if there are characters around 
        this.characterAround(map);       
    }
    // Are there any characters around ?
    characterAround(map){
        
        // We choose to check the 4 boxes around rather than looking at each player       
                
        if ( (this.column+1<=map.maxColumn-1) && (map.board[this.line][this.column+1].hasPlayer()) ){
                // To the right
                map.fight(this,map.board[this.line][this.column+1].getCharacter());                      
        }
        else if ( (this.column-1>=0) && (map.board[this.line][this.column-1].hasPlayer()) ){
                // To the Left
                map.fight(this,map.board[this.line][this.column-1].getCharacter());
        }
        else if ( (this.line+1<=map.maxLine-1) && (map.board[this.line+1][this.column].hasPlayer()) ){
                // Below
                map.fight(this,map.board[this.line+1][this.column].getCharacter());
        }        
        else if ( (this.line-1>=0) && (map.board[this.line-1][this.column].hasPlayer()) ){
            // Up
            map.fight(this,map.board[this.line-1][this.column].getCharacter());
        }
        else {
            // We check that it remains a character alive
            if (map.characters.length>1) {
            // We update the game turn   
            map.updateCurrent();
            // We call the next player's move    
            map.characters[map.current].deplace(map);
            }
            else {
                console.log("Debug");
            }; 
        };
    }
    // Attack
    attack(target){
        // Damage calculation
        let damage = this.container[0].damage*(1-target.shield);
        // Animation of the damage
        $('#damage-'+target.name).html('<b>'+damage+'</>');
        $('#damage-'+target.name).fadeIn('slow');
        $('#damage-'+target.name).fadeOut('slow');
        // Update Health of the target & reset of Shield
        target.health-= damage;
        target.shield = 0;
    }
    // Defend
    defend(){
        // Set Shield at 50%
        this.shield = 0.5;       
    }
    // We update the life or the shield in the UI
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
    // Get the weapon   
    getWeapon(){
        // TODO : for the moment a single weapon in the inventory, to improve to have several weapons of which one equipped
        let inventory = this.container;
        let weapon="";
            // We go through the container and if we find a weapon, we send it back
            $.each(inventory,function(index,value) {
                // If there is a weapon, we return it
                if (value instanceof Item && value.model==="weapon"){
                    weapon = value;
                }
            });
        return weapon;              
    }
    // Initialize the container with an element 
    setContainer(element){
        // If the container does not exist, it is created
        if(this.container===null) {
            this.container = new Array();
        };
        // We fix its line and its column
        element.line = this.line;
        element.column = this.column;
        // We place the element in the container
        this.container.push(element);        
    }
    // empty the container
    removeContainer(element=null){
        // If null then we completely empty the container and return true
        if(element===null) {
            this.container = null;
            return true;
        } // Otherwise we remove the requested element from the container if it exists
        else {
            let inventory = this.container;
            $.each(inventory,function(index,value) {
                if(element==value) {
                    inventory.splice(index,1);
                    return true;
                };
            });
            return false;
        };
    }
    // The coordinates of the container are updated
    updateCoordinatesContainer(){
        let player = this;
        // We update the coordinates of each element of the container
        $.each(player.container,function(index,value) {
                value.line = player.line;
                value.column = player.column;                
        });            
    }

}
class Case {

    constructor(line,column,ground=0,image=null){
        this.line = line;
        this.column = column;
        this.ground = ground;
        this.image = image;
        this.container = null;
    }
    
    // Display of a case
    displayCase(map){
        let ligneElt = '#L'+this.line;
        let caseElt = $('<div/>').attr({id:'L'+this.line+'C'+this.column,class:'case'});
        this.setCaseSize(map,caseElt);
        this.setBackground(map,caseElt,this.image);
        caseElt.appendTo(ligneElt);
    }
    // Displays displacement boxes
    displayMove(map){
        let idElt = '#L'+this.line+'C'+this.column;
        let divElt = $('<div/>').attr({class : 'move'});
        this.setCaseSize(map,divElt);
        this.setBackground(map,divElt,"move.png");
        divElt.appendTo(idElt);
    }
    // Adjust the size of the element
    setCaseSize(map,elt){
        elt.css('left',this.column*map.size).css('top',this.line*map.size).css('width',map.size).css('height',map.size).css('background-size',map.size);
    }
    // Set the background of the element
    setBackground(map,elt,image){
        elt.css('background-image', "url('"+map.world+image+"')");
    }
    // Container display
    displayContainer(map){
        // TODO : managing multiple items in the container
        let that = this;
        let divElt;
        let persoElt;        
        // If the container is not empty then it contains one or more elements
        if (this.container!==null) {
            // If the container has no display it is created otherwise it is retrieved
            if ($('#ContainerL'+this.line+'C'+this.column).length == 0) {
            divElt = $('<div/>').attr({id:'ContainerL'+this.line+'C'+this.column,class:'containerGame'});
            this.setCaseSize(map,divElt);
            divElt.appendTo('#L'+this.line+'C'+this.column);
            }
            else {
                divElt = $('#ContainerL'+this.line+'C'+this.column);                
            }; 
            // If the container contains 1 character so we only display him otherwise if we have one item we display the item
            let inventaire = this.container;
            $.each(inventaire,function(index,value) {
                // Character Display                
                if(value instanceof Character) {
                    let url = "url('"+map.world+"characters/"+value.image+"')";
                    // If the class was not built, it was built
                    if ($('#'+value.name).length == 0) {
                        persoElt = $('<div/>').attr({id: value.name, class:'containerGame'});
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
    // Get the weapon
    getWeapon(){
        let inventory = this.container;
        let weapon = "";
        // We go through the container and if we find a weapon, we send it back
        $.each(inventory,function(index,value) {
            if (value instanceof Item && value.model==="weapon"){
                weapon = value;
            };
        });
        return weapon;
    }
    // Get the character
    getCharacter(){
        let inventory = this.container;
        let character = "";
        // We go through the container and if we find a character, we send it back
        $.each(inventory,function(index,value) {
            if (value instanceof Character){
                character = value;
            };
        });
        return character;
    }
    // Does it contain a weapon ?
    hasWeapon(model=null){
        let container = this.container;
        // If null then we send true if there is a weapon if not false
        if(model===null) {
            if (container!==null) {
                let condition = false;
                $.each(container,function(index,value) {
                    if (value instanceof Item && value.model=="weapon"){
                        condition = true;
                    }
                });
                return condition;
            }
            else {
                return false;
            }
        } // if not yet currently managing
        else {
            console.log("Not currently managing");
        }
    }
    // Does it contain a character ?
    hasPlayer(player=null){
        let container = this.container;
        // If null then we send true if there is a character if not false
        if(player===null) {
            if (container!==null) {
                let condition = false;
                $.each(container,function(index,value) {
                    if (value instanceof Character) {
                        condition = true;
                    }
                });
                return condition;
            }
            else {
                return false;
            }
        } // if not yet currently managing
        else {
            console.log("Not currently managing");
        }

    }
    // Is it empty?
    isEmpty(ground=null){
        // If null then we check if the box is empty
        if(ground===null) {
            return (this.ground==0)?true:false;
        } // else we indicate that the case is empty
        else {
            this.ground = 0;
            this.image = "empty.png";
        };
    }
    // Is it obstacle?
    isObstacle(ground=null){
        // If null then we check if the box is a obstacle
        if(ground===null) {
            return (this.ground==-1)?true:false;
        } // else we indicate that the case is a obstacle
        else {
            this.ground = -1;
            this.image = "obstacle.png";
        };
    }
    // We exchange the player's weapon
    changeWeapon(map,player){
        // We recover the weapon in the container of the case
        let weaponContainer =this.getWeapon();
        // It is removed from the container of the case
        this.removeContainer(weaponContainer);
        // We recover the weapon in the container of the character
        let weaponCharacter = player.getWeapon();
        // It is removed from the container of the character
        player.removeContainer(weaponCharacter);
        // We put the weapons in the containers
        this.setContainer(weaponCharacter);
        player.setContainer(weaponContainer);
        // We manage the display
        $('#ContainerL'+this.line+'C'+this.column).css('background-image',"url('"+map.world+"weapons/"+weaponCharacter.image+"')");
        $('#weapon-'+player.name).attr('src',map.world+"weapons/"+weaponContainer.image);
        $('#weapon-'+player.name).attr('title',weaponContainer.name);
    }
    // Weapon management on the character passge
    weaponOnPath(map,player,originLine,originColumn){
        // Position relative to the point of origin
        let signLine = Math.sign(this.line-originLine);
        let signColumn = Math.sign(this.column-originColumn);
        // Following the lines
        switch(signLine) {
            // Positive
            case 1 :
                // We go through the cases from the origin until the arrival
                for (let i = originLine+1 ; i <= this.line ; i++){
                    // If we find a weapon on a square, we exchange it with the weapon of character
                    if (map.board[i][originColumn].hasWeapon()) {
                        map.board[i][originColumn].changeWeapon(map,player);
                    }
                };
                break;
            // Negative
            case -1 : 
                // We go through the cases from the origin until the arrival               
                for (let i = originLine-1 ; i >= this.line ; i--){
                    // If we find a weapon on a square, we exchange it with the weapon of character
                    if (map.board[i][originColumn].hasWeapon()) {
                        map.board[i][originColumn].changeWeapon(map,player);
                    }
                }
                break;
            // Zero
            case 0 : 
                // Following the columns               
                switch(signColumn){
                    case 1:
                        // We go through the cases from the origin until the arrival
                        for (let j = originColumn+1 ; j <= this.column ; j++){
                            // If we find a weapon on a square, we exchange it with the weapon of character
                            if (map.board[originLine][j].hasWeapon()) {
                                map.board[originLine][j].changeWeapon(map,player);
                            }
                        }
                    break;
                    case -1:
                        // We go through the cases from the origin until the arrival
                        for (let j = originColumn-1 ; j >= this.column ; j--){
                            // If we find a weapon on a square, we exchange it with the weapon of character
                            if (map.board[originLine][j].hasWeapon()) {
                                map.board[originLine][j].changeWeapon(map,player);
                            }
                        }
                    break;
                }
                break;
        }

    }
}
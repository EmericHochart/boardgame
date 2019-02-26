class Case {

    constructor(line,column,ground=0,image=null){
        this.line = line;
        this.column = column;
        this.ground = ground;
        this.image = image;
        this.container = null;
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

    setContainer(element){
        if(this.container===null) {
            this.container = new Array();
        };       
        element.line = this.line;
        element.column = this.column;
        this.container.push(element);
    }

    removeContainer(element=null){
        if(element===null) {
            this.container = null;
            return true;
        }
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

    getWeapon(){
        let inventory = this.container;
        let weapon = "";
        $.each(inventory,function(index,value) {
            if (value instanceof Item && value.model==="weapon"){
                weapon = value;
            };
        });
        return weapon;
    }

    getCharacter(){
        let inventory = this.container;
        let character = "";
        $.each(inventory,function(index,value) {
            if (value instanceof Character){
                character = value;
            };
        });
        return character;
    }

    hasWeapon(model=null){
        let container = this.container;
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
        }
        else {
            console.log("Not currently managing");
        }
    }
    
    hasPlayer(player=null){
        let container = this.container;
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
        }
        else {
            console.log("Not currently managing");
        }

    }

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

    changeWeapon(map,player){
        let weaponContainer =this.getWeapon();
        this.removeContainer(weaponContainer);
        let weaponCharacter = player.getWeapon();
        player.removeContainer(weaponCharacter);
        this.setContainer(weaponCharacter);
        player.setContainer(weaponContainer);
        $('#ContainerL'+this.line+'C'+this.column).css('background-image',"url('"+map.world+"weapons/"+weaponCharacter.image+"')");
        $('#weapon-'+player.name).attr('src',map.world+"weapons/"+weaponContainer.image);
        $('#weapon-'+player.name).attr('title',weaponContainer.name);
    }
    
    weaponOnPath(map,player,originLine,originColumn){
        let signLine = Math.sign(this.line-originLine);
        let signColumn = Math.sign(this.column-originColumn);
        switch(signLine) {
            case 1 :
                for (let i = originLine+1 ; i <= this.line ; i++){
                    if (map.board[i][originColumn].hasWeapon()) {
                        map.board[i][originColumn].changeWeapon(map,player);
                    }
                };
                break;
            case -1 :
                
                for (let i = originLine-1 ; i >= this.line ; i--){
                    if (map.board[i][originColumn].hasWeapon()) {
                        map.board[i][originColumn].changeWeapon(map,player);
                    }
                }
                break;
            case 0 :
                
                switch(signColumn){
                    case 1:
                        for (let j = originColumn+1 ; j <= this.column ; j++){
                            if (map.board[originLine][j].hasWeapon()) {
                                map.board[originLine][j].changeWeapon(map,player);
                            }
                        }
                    break;
                    case -1:
                        for (let j = originColumn-1 ; j >= this.column ; j--){
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
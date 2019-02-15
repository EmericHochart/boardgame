class Map {

    constructor(maxLine,maxColumn,size=64,world="medieval"){
        this.maxLine = maxLine;
        this.maxColumn = maxColumn;
        this.size = size;
        this.world = "../boardgame/assets/images/"+world+"/";
        this.board = new Array();
        this.characters = new Array();
        this.current = 0;
    }

    initGame(obstacles,weapon,player){
        this.initMap();
        this.initObstacle(obstacles);
        this.initWeapon(weapon);
        this.initPlayer(player);
        this.displayMap();        
        this.start();
    }

    initMap(){
        for (let i = 0 ; i < this.maxLine ; i++) {
            this.board[i] = new Array();
            for (let j = 0 ; j < this.maxColumn ; j++) {
                this.board[i][j] = new Case(i,j);
                this.board[i][j].isEmpty(true);
            };
        };
    }

    initObstacle(percentage=10){
        percentage = (percentage>15)?15:percentage;
        for (let k = 0 ; k < (percentage/100*this.maxLine*this.maxColumn) ; k++) {
            let [x,y] = this.randomCoordinates();
            (!this.board[x][y].isEmpty())?k--:this.board[x][y].isObstacle(true);
        };
    }

    initWeapon(amount=4){
        //Limit to length of weapons
        if (amount>weapons.length){
            amount = weapons.length;
        };
        let map=this;
        // Array of active Weapons
        let activeWeapons = new Array(amount);        
        let tableIndexWeapon = new Array();
        for ( let i = 0 ; i < weapons.length ; i++) {
            tableIndexWeapon[i]=i;
        };
        let indexWeapon = 0;
        for (let j = 0; j < amount; j++){
            indexWeapon = Math.floor(Math.random()*tableIndexWeapon.length);
            activeWeapons[j]=weapons[tableIndexWeapon[indexWeapon]];
            tableIndexWeapon.splice(indexWeapon,1);
        };
        let [x,y] = new Array();
        let square;
        $.each(activeWeapons, function(index,value){
            // We make sure that there are no obstacles and no items or characters on the box
            do {
                [x,y] = map.randomCoordinates();
                square = map.board[x][y];
            }
            while (square.isObstacle() || square.conteneur!==null);            
            // We place the weapon in the box's container
            square.setConteneur(value);
        });
    }
    
    initPlayer(player=2){
        // Limit to 4 characters
        if (player>4){
            player = 4;
        };
        let map=this;
        // We initialize the character table with different random avatars
        let tableIndexAvatar = new Array();
        for ( let i = 0 ; i < characters.length ; i++) {
            tableIndexAvatar[i]=i;
        };
        let indexAvatar = 0;
        for (let j = 0; j < player; j++) {
            indexAvatar = Math.floor(Math.random()*tableIndexAvatar.length);
            map.characters[j]=characters[tableIndexAvatar[indexAvatar]];
            tableIndexAvatar.splice(indexAvatar,1);
        };
        // Array of active Characters
        let activeCharacters = map.characters;
        // Array with coordinates of Characters
        let posPlayer = new Array();
        // Default Weapon 
        let weaponBasic = new Item("Epée en bois","woodSword.png",null,null,"weapon",10);
            
        $.each(activeCharacters, function(index,value){
            let [x,y]=new Array();
            let square;
            let alone = true;
            // We make sure that there are no obstacles and objects on the box and no characters around
            do {
                [x,y] = map.randomCoordinates();
                square = map.board[x][y];
                // We check that there is no character around
                $.each(posPlayer,function(index,value){
                    if ((Math.abs(x-value[0])<=1)&&(Math.abs(y-value[1])<=1)) {
                        alone = false;
                    };
                });
            }
            while ( square.isObstacle()||square.conteneur!=null||alone==false );
            // We place the character in the box's container
            square.setConteneur(value);
            // We place the basic weapon in the container of the character
            value.setConteneur(weaponBasic);
            // We add the coordinates of the character in the position table
            posPlayer.push([x,y]);
            // We display the UI of the character
            map.displayUI(value);   
        });
    }

    displayUI(player){
        let uiElt = $('#ui-players');
        let playerElt = $('<div/>').attr({id:'ui-'+player.name,class:'row'});
        playerElt.html('<div class="col-md-3"><img id="avatar-'+player.name+'" src="'+this.world+"characters/"+player.image+'" width="64px" height="64px"></div><div class="col-md-6"><div class="row"><b>'+player.name+'</b></div><div class="progress md-progress"><div id="health-'+player.name+'" class="progress-bar" role="progressbar" style="width:'+player.health+'%" aria-valuenow="'+player.health+'" aria-valuemin="0" aria-valuemax="100"></div></div><div class="damage"><span id="damage-'+player.name+'"></span></div></div><div class="col-md-3"><img id="weapon-'+player.name+'" data-toggle="tooltip" title="'+player.conteneur[0].name+'" src="'+this.world+"weapons/"+player.conteneur[0].image+'" width="64px" height="64px"></div>');
        playerElt.appendTo(uiElt);
        $('<hr/>').appendTo(uiElt);
    }
    
    displayMap(){
        let map = this;
        let boardElt = $('#board');
        boardElt.css('width',(this.maxColumn*this.size)+"px").css('height',(this.maxLine*this.size)+"px").html("");
        $.each(map.board,function(abscisse,ligne) {
            let ligneElt = $('<div/>').attr({id:'L'+abscisse,class:'ligne'});
            ligneElt.appendTo(boardElt);            
            $.each(ligne,function(ordonnee) {
                // Display square
                map.board[abscisse][ordonnee].displayCase(map);
                // Display Container
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

    fight(player1,player2){
        let map = this;
        let charactersTemp = this.characters;
        $(function(){

            $('.ui-draggable').draggable( "destroy" );
            map.removeDisplayMove();
            $( '.ui-droppable' ).droppable( "destroy" );
            $('#ui-players>h3').html(player1.name+ " : A vous de jouer !");
            // ATTACK
            $('#attack').on('click', function(){
                $('#ui-players>h3').html(player1.name+" attaque !");
                player1.attack(player2);
                player2.updateHealth();
                $('#attack').off('click');
                $('#defense').off('click');
                // We check that the target is alive
                if (player2.health<=0){
                    $.each(charactersTemp,function(index,value) {
                        if (typeof value === "undefined") {
                            charactersTemp.splice(index,1);
                        }
                        else if(value.health<=0) {
                            charactersTemp.splice(index,1);
                        };
                    });                    
                    map.board[player2.line][player2.column].removeConteneur();
                    $('#ui-players>h3').html(player1.name+" a gagné");
                    $('#avatar-'+player2.name).attr('src',map.world+"grave.png");
                    $('#'+player2.name).css('background-image',"url('"+map.world+"grave.png')");
                    // We check that it remains a character alive
                    if (map.characters.length>1) {
                        map.updateCurrent();
                        map.characters[map.current].deplace(map);
                    }
                    else {
                        map.endGame();                        
                    }; 
                }
                else {
                    // Otherwise the fight continues
                    map.fight(player2,player1);
                };        
            });
            //DEFENSE
            $('#defense').on('click', function(){
                $('#ui-players>h3').html(player1.name+" se défend !");
                player1.defend();
                player1.updateHealth(player2.conteneur[0].damage*player1.shield);
                $('#defense').off('click');
                $('#attack').off('click');
                map.fight(player2,player1);
            });
        }); 
    }

    start(){
        // We randomly select a character to start the game
        this.current = Math.floor(Math.random()*this.characters.length);
        this.characters[this.current].deplace(this);
    }
    
    endGame(){
        $('#ui-players').html('<h3>Rejouez</h3><hr/><button id="gameAgain" class="btn btn-indigo btn-md">Recommencer une partie</button>');
        $('#gameAgain').on('click',function(){
            window.location.reload(true);
        });
    }

    updateCurrent(){
        if (this.current >= (this.characters.length - 1)) {
            this.current = 0;            
        }
        else 
        {
            this.current++;            
        };
    }

}
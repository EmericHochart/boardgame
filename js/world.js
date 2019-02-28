$(function(){

    // Tooltips
    $('[data-toggle="tooltip"]').tooltip()

    // Animations initialization
    // new WOW().init();    

    // Play Now 
    $('#playNow').on('click', function(e){
        $('.play').attr('disabled','true');
        $('#loadGame').css('display','none');
        var nowMap = null;
        var nowMap = new Map(10,10,64,"medieval");        
        nowMap.initGame(10,4,2,0);
        e.preventDefault();
    });

    // Play by Setup
    $('#config').on('submit',function(e){        
        let c_lines = Number($('#configLines').val());
        let c_columns = Number($('#configColumns').val());
        let c_size = Number($('#configSize').val());
        let c_obstacles = Number($('#configObstacles').val());
        let c_weapons = Number($('#configWeapons').val());
        let c_world = $('#configWorld').val();
        let c_players = Number($('#configPlayers').val());
        let c_ia = Number($('#configIA').val());
        $('.play').attr('disabled','true');
        $('#loadGame').css('display','none');
        var configMap = null;
        configMap = new Map(c_lines,c_columns,c_size,c_world);
        $('html,body').animate({scrollTop: $("#board").offset().top},'slow');
        configMap.initGame(c_obstacles,c_weapons,c_players,c_ia);   
        e.preventDefault();
    });

    // Load Game
    $('#loadGame').on('click', function(e){        
        
        $('.play').attr('disabled','true');
        $('#loadGame').css('display','none');        
        
        var mapLoaded = JSON.parse(localStorage.getItem("boardgame"));
        
        console.log(mapLoaded.world);
        let world = mapLoaded.world.substr(20,mapLoaded.world.length-1);        
        console.log(world);
        var newMap = new Map(mapLoaded.maxLine,mapLoaded.maxColumn,mapLoaded.size,world);

        for (let i = 0 ; i < newMap.maxLine ; i++) {
                    newMap.board[i] = new Array();
                    for (let j = 0 ; j < newMap.maxColumn ; j++) {
                        newMap.board[i][j] = new Case(i,j,0,"empty.png");
                        newMap.board[i][j].ground = mapLoaded.board[i][j].ground;
                        newMap.board[i][j].image = mapLoaded.board[i][j].image;
                        
                            $.each(mapLoaded.board[i][j].conteneur,function(index,value){
                                if (value.health==undefined){                                   
                                    let item = new Item(value.name,value.image,value.line,value.column,value.model,value.damage);  
                                    newMap.board[i][j].setConteneur(item);
                                }; 
                            });
                    };
        };
        for (let i = 0 ; i < mapLoaded.characters.length ; i++) {
            newMap.characters[i] = new Character(mapLoaded.characters[i].name,mapLoaded.characters[i].health,mapLoaded.characters[i].image,mapLoaded.characters[i].line,mapLoaded.characters[i].column);
            
            $.each(mapLoaded.characters[i].conteneur,function(index,value){
                let item = new Item(value.name,value.image,value.line,value.column,value.model,value.damage);                  
                newMap.characters[i].setConteneur(item);                
            });

            newMap.characters[i].shield = mapLoaded.characters[i].shield;
            newMap.board[mapLoaded.characters[i].line][mapLoaded.characters[i].column].setConteneur(newMap.characters[i]);
            newMap.displayUI(newMap.characters[i]);
        };
                     
        newMap.current = mapLoaded.current;
        newMap.readyWeapons = true;
        newMap.readyCharacters = true;        
        newMap.isReady();
        e.preventDefault();        
    });    

});
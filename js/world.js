$(function(){

    // Tooltips
    $('[data-toggle="tooltip"]').tooltip()

    // Animations initialization
    new WOW().init();    

    // Play Now 
    $('#playNow').on('click', function(e){
        // Disable button play
        $('.play').attr('disabled','true');
        // Disable url Load
        $('#loadGame').css('display','none');
        let nowMap = null;
        // Managing Mobile
        let size = 64;
        if ($(window).width()<740){
        let sizeMax = parseInt($(window).width()/10);
        if (64>sizeMax){
            size = sizeMax;
        };
        };
        // Initialize Map
        nowMap = new Map(10,10,size,"medieval");        
        nowMap.initGame(10,4,2);        
    });

    // Play by Setup
    $('#config').on('submit',function(e){
        // Retrieve form values        
        let c_lines = Number($('#configLines').val());
        let c_columns = Number($('#configColumns').val());
        let c_size = Number($('#configSize').val());
        let c_obstacles = Number($('#configObstacles').val());
        let c_weapons = Number($('#configWeapons').val());
        let c_world = $('#configWorld').val();
        let c_players = Number($('#configPlayers').val());
        //let c_ia = Number($('#configIA').val());
        // Disable button play
        $('.play').attr('disabled','true');
        // Disable url Load
        $('#loadGame').css('display','none');
        var configMap = null;
        // Managing Mobile        
        if ($(window).width()<740){
        let sizeMax = parseInt($(window).width()/10);
        if (c_size>sizeMax){
            c_size = sizeMax;
        };
        };
        // Initialize Custom Map
        configMap = new Map(c_lines,c_columns,c_size,c_world);
        // Animated displacement
        $('html,body').animate({scrollTop: $("#board").offset().top},'slow');
        configMap.initGame(c_obstacles,c_weapons,c_players);   
        e.preventDefault();
    });

    // Load Game
    $('#loadGame').on('click', function(e){        
        // Disable button play
        $('.play').attr('disabled','true');
        // Disable url Load
        $('#loadGame').css('display','none');        
        
        // Recovering the backup
        var mapLoaded = JSON.parse(localStorage.getItem("boardgame"));
        // Recovery of the name of the world for reconstruction        
        let world = mapLoaded.world.substr(20,mapLoaded.world.length-1);        
        // Initialize Map Loaded
        var newMap = new Map(mapLoaded.maxLine,mapLoaded.maxColumn,mapLoaded.size,world);
        // Reconstruction of the instance of Map
        for (let i = 0 ; i < newMap.maxLine ; i++) {
                    newMap.board[i] = new Array();
                    for (let j = 0 ; j < newMap.maxColumn ; j++) {
                        newMap.board[i][j] = new Case(i,j,0,"empty.png");
                        newMap.board[i][j].ground = mapLoaded.board[i][j].ground;
                        newMap.board[i][j].image = mapLoaded.board[i][j].image;
                        
                            $.each(mapLoaded.board[i][j].container,function(index,value){
                                if (value.health==undefined){                                   
                                    let item = new Item(value.name,value.image,value.line,value.column,value.model,value.damage);  
                                    newMap.board[i][j].setContainer(item);
                                }; 
                            });
                    };
        };
        for (let i = 0 ; i < mapLoaded.characters.length ; i++) {
            newMap.characters[i] = new Character(mapLoaded.characters[i].name,mapLoaded.characters[i].health,mapLoaded.characters[i].image,mapLoaded.characters[i].line,mapLoaded.characters[i].column);
            
            $.each(mapLoaded.characters[i].container,function(index,value){
                let item = new Item(value.name,value.image,value.line,value.column,value.model,value.damage);                  
                newMap.characters[i].setContainer(item);                
            });

            newMap.characters[i].shield = mapLoaded.characters[i].shield;
            newMap.board[mapLoaded.characters[i].line][mapLoaded.characters[i].column].setContainer(newMap.characters[i]);
            newMap.displayUI(newMap.characters[i]);
        };                     
        newMap.current = mapLoaded.current;
        newMap.readyWeapons = true;
        newMap.readyCharacters = true;
        // Call of the method isReady to launch the game        
        newMap.isReady();
        e.preventDefault();        
    });    

});
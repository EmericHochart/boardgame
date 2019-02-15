let weapons=new Array();
let characters=new Array();

$(function(){

    // Tooltips
    $('[data-toggle="tooltip"]').tooltip()

    // Animations initialization
    // new WOW().init();

    // Json : weapons 
    $.ajax({
        type: 'GET',
        url: 'json/weapon.json',
        timeout: 2000,
        success: function(data) {   
                $.each(data,function(index,value){
                    weapons.push(new Item(value.name,value.image,null,null,"weapon",value.damage));
                });
            },
        error: function() {
            alert('La requête n\'a pas abouti'); }
    });

    // Json : characters
    $.ajax({
        type: 'GET',
        url: 'json/character.json',
        timeout: 2000,
        success: function(data) {   
                $.each(data,function(index,value){
                    characters.push(new Character(value.name,value.health,value.image,null,null));
                });
            },
        error: function() {
            alert('La requête n\'a pas abouti'); }
    });

    // Play Now 
    $('#playNow').on('click', function(){
        $('.play').attr('disabled','true');
        var nowMap = null;
        var nowMap = new Map(10,10,64,"medieval");
        nowMap.initGame(10,4,2);
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
        //let c_ia = Number($('#configIA').val());
        $('.play').attr('disabled','true');
        var configMap = null;
        var configMap = new Map(c_lines,c_columns,c_size,c_world);
        $('html,body').animate({scrollTop: $("#board").offset().top},'slow');
        configMap.initGame(c_obstacles,c_weapons,c_players);   
        e.preventDefault();
    });
    

});

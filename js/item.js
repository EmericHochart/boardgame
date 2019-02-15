class Item{
    // Model is currently set to only weapon
    // We can extend the Item class to the Weapon class when we have other item models
    constructor(name,image,line,column,model,damage){
        this.name = name;
        this.image = image;
        this.line = line;
        this.column = column;
        this.model = model;
        this.damage = damage;
    }
    
}
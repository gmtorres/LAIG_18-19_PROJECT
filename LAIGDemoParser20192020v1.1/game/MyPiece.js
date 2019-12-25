class MyPiece{

    constructor(orchestrator,uniqueID,type,tile){
        this.orchestrator = orchestrator;
        this.setType(type);
        this.setTile(tile);
        this.uniqueID = uniqueID;
        this.selectable = true;
        this.animated = false;
    }

    setType(type){
        this.type = type;
    }
    getType(){
        return this.type;
    }

    setTile(tile){
        if(this.tile != null){
            this.tile.setPiece(null);
        }
        this.tile = tile;
        if(this.tile == null)   return;
        this.tile.setPiece(this);
    }
    getTile(){
        return this.tile;
    }

    getId(){
        return this.uniqueID;
    }

    display(forceDisplay){
        if(!this.animated || (forceDisplay != undefined && forceDisplay == true)){
            if(this.selectable){
                this.orchestrator.getScene().registerForPick(this.uniqueID,this);
            }
            this.orchestrator.getScene().pushMatrix();
            this.orchestrator.getScene().translate(this.tile.x,0,this.tile.y);
            this.type.display();
            this.orchestrator.getScene().popMatrix();
            if(this.selectable){
                this.orchestrator.getScene().clearPickRegistration();
            }
        }
    }

    clone() {
        let copy = new this.constructor();
        for (let attr in this) {
            if (this.hasOwnProperty(attr)) copy[attr] = this[attr];
        }
        return copy;
    }


}
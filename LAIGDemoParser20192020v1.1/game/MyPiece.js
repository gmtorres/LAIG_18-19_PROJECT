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
        this.tile = tile;
        this.tile.setPiece(this);
    }
    getTile(){
        return this.tile;
    }

    getId(){
        return this.uniqueID;
    }

    display(){
        if(!this.animated){
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

}
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

    display(forceDisplay) {
        let tempTex = [];
        tempTex.tex = 'none';
        let tempApp = new CGFappearance(this.orchestrator.getScene());
        
        if(!this.animated || (forceDisplay != undefined && forceDisplay == true)){
            if(this.selectable){
                this.orchestrator.getScene().registerForPick(this.uniqueID,this);
            }
            this.orchestrator.getScene().pushMatrix();
            this.orchestrator.getScene().translate(this.tile.x,0,this.tile.y);
            this.orchestrator.getScene().translate(0.5,0,0.5);
            if(this.uniqueID >= 150 && this.uniqueID < 200){
                this.orchestrator.getScene().rotate(Math.PI,0,1,0);
            }
            this.orchestrator.getScene().translate(-0.5,0,-0.5);
            this.orchestrator.theme.displayFunction(
                this.type,
                tempApp,
                tempTex,
                1,
                1
            );
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
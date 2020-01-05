class MyTile{

    constructor(orchestrator,uniqueID,type,x,y,z){
        this.orchestrator = orchestrator;
        this.setType(type);
        this.setPosition(x,y);
        this.uniqueID = uniqueID;
        this.piece = null;
        this.selectable = false;
        
        if(z != undefined){
            this.z = z;
        }else this.z = 0;

        this.lastSelected = -1;
    }
    setPosition(x,y){
        this.x = x;
        this.y = y;
    }

    getId(){
        return this.uniqueID;
    }

    setType(type){
        this.type = type;
    }
    getType(){
        return this.type;
    }

    getPosition(){
        return [this.x,this.z,this.y];
    }

    getPiecePosition(){
        return [this.x - 0.5,this.z,this.y - 0.5];
    }

    display() {
        let tempTex = [];
        tempTex.tex = 'none';
        let tempApp = new CGFappearance(this.orchestrator.getScene());

        if(this.selectable){
            this.orchestrator.getScene().registerForPick(this.uniqueID,this);
        }
        this.orchestrator.getScene().pushMatrix();
        this.orchestrator.getScene().translate(this.x,this.z,this.y);
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

    setPiece(piece){
        this.piece = piece;
    }
    getPiece(){
        return this.piece;
    }

    clone() {
        let copy = new this.constructor();
        for (let attr in this) {
            if (this.hasOwnProperty(attr)) copy[attr] = this[attr];
        }
        return copy;
    }

}
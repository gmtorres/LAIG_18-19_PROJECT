class MyTile{

    constructor(orchestrator,uniqueID,type,x,y){
        this.orchestrator = orchestrator;
        this.setType(type);
        this.setPosition(x,y);
        this.uniqueID = uniqueID;
        this.piece = null;
        this.selectable = false;
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

    display(){
        if(this.selectable){
            this.orchestrator.getScene().registerForPick(this.uniqueID,this);
        }
        this.orchestrator.getScene().pushMatrix();
        this.orchestrator.getScene().translate(this.x,0,this.y);
        this.type.display();
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



}
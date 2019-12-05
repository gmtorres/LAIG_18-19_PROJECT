class MyGameMove{

    constructor(gameBoardPrev , piece,origTile, destTile){
        this.gameBoardPrev = gameBoardPrev;
        this.piece = piece;
        this.origTile = origTile; 
        this.destTile = destTile;
        this.gameBoardAfter = null;
    }

    animate(){

    }

    getReverseMove(){
        return new MyGameMove(this.gameBoardAfter,this.piece,this.destTile,this.origTile);
    }

}
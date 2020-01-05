class MyGameMoves{
    
    constructor(gameBoardPrev,myGameMoves,undoMove){

        this.gameBoardPrev = new MyGameBoard(gameBoardPrev.orchestrator,gameBoardPrev.board);
        this.gameBoardPrev.piecesOffset = gameBoardPrev.piecesOffset;

        this.gameBoardAfter = null;

        if(undoMove == undefined){
            this.undoMove = false;
        }else this.undoMove = undoMove;

        this.moves = [];
        for (let i = 0; i < myGameMoves.length; i++) {
            this.moves.push(myGameMoves[i]);
        }

        this.setBoard();

    }

    setAfterBoard(boardAfter){
        this.gameBoardAfter = boardAfter;
    }

    setBoard(){
        this.gameBoardPrev.setPieceType();
        this.gameBoardPrev.setTilesType();
    }

    animate(time){
        let ret = false;
        this.moves.forEach(element => {
            if(element.animate(time)){
                ret = true;
            }
        });
        return ret;
    }

    setPiecesAnimated(value){
        this.moves.forEach(move => {
            let origTile = move.origTile;
            if(this.undoMove)
                origTile = move.destTile;
            let piece = this.gameBoardPrev.getPieceByTile(origTile.x,origTile.y);
            if(piece != null){
                piece.animated = value;
            }
        });
    }

    getReverseMove(){
        let moves = [];
        this.moves.forEach(move => {
            moves.push(new MyGameMove(move.piece,move.destTile,move.origTile));
        });
        return new MyGameMoves(this.gameBoardPrev,moves,true);
    }

    display(){
        this.setPiecesAnimated(true);
        this.gameBoardPrev.display();
        this.setPiecesAnimated(false);
        this.moves.forEach(element=> {
            element.display();
        });
    }

}
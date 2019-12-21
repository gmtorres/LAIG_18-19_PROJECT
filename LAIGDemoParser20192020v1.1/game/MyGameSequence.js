class MyGameSequence{

    constructor(){
        this.sequence = [];
        this.index = 0;
    }
    reset(){
        this.sequence = [];
        this.index = 0;
    }

    replay(){
        this.index = 0;
    }
    
    addMove(move){
        this.sequence.push(move);
    }

    next(){
        if(this.index >= this.sequence.length)
            return null;
        let nextMove = this.sequence[this.index];
        if(nextMove.undoMove == false)
            this.index++;
        else if(nextMove.undo == true){
            this.sequence.pop();
            this.index--;
        }
        return nextMove;
    }
    
    setAfterBoardOfPreviousMove(afterBoard){
        this.sequence[this.sequence.length-1].setAfterBoard(afterBoard);
    }

    undo(){
        
    }
}
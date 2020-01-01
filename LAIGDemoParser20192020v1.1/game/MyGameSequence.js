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

    end(){
        this.index = this.sequence.length;
    }
    
    addMove(move){
        this.sequence.push(move);
    }

    next(){
        if(this.index >= this.sequence.length){
            return null;
        }else if(this.index < 0){
            this.index = 0;
            return null;
        }
        let nextMove = this.sequence[this.index];
        if(nextMove.undoMove == false)
            this.index++;
        else if(nextMove.undoMove == true){
            this.sequence.pop();
            //this.index--;
        }
        return nextMove;
    }
    
    setAfterBoardOfPreviousMove(afterBoard){
        this.sequence[this.sequence.length-1].setAfterBoard(afterBoard);
    }

    undo(){
        if(this.sequence.length == 0)
            return false;
        let move = this.sequence.pop();
        if(this.index >= this.sequence.length)
            this.index = this.sequence.length;
        let reverseMove = move.getReverseMove();
        this.addMove(reverseMove);
        return move.gameBoardPrev;
    }

    getBfrBoard(){
        if(this.sequence.length <= 1)
            return [
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0]
            ];
        else return this.sequence[this.sequence.length-2].gameBoardPrev.board;
    }

}
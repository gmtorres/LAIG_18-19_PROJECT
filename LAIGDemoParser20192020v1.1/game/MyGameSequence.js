class MyGameSequence{

    constructor(){
        this.sequence = [];
        this.index = 0;
    }
    reset(){
        this.index = 0;
    }
    
    addMove(move){
        this.sequence.push(move);
    }

    next(){
        if(this.index >= this.sequence.length)
            return null;
        else
            return this.sequence[this.index++];
    }

    undo(){
        let undo = this.sequence.pop();
        this.index--;
        return null;
        //return new MyGameMove(this.sequence[index].gameBoardPrev,)
    }
}
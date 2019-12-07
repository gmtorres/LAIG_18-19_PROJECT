class MyGameSequence{

    constructor(){
        this.sequence = [];
    }
    addMove(move){
        this.sequence.push(move);
    }
    undo(){
        let undo = this.sequence.pop();
        return undo.getReverseMove();
    }
}
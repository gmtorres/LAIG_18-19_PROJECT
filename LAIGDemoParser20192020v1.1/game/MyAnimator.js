class MyAnimator{
    constructor(orchestrator,gameSequence){
        this.orchestrator = orchestrator;
        this.gameSequence = gameSequence;
        this.currentGameMovement = null;
    }
    
    reset(){
        this.gameSequence.reset();
    }

    start(){
        this.currentGameMovement = this.gameSequence.next();
    }

    update(time){
        if(this.currentGameMovement != null){
            this.currentGameMovement.update(time);
        }
    }
    display(){
        if(this.currentGameMovement != null){
            this.currentGameMovement.display();
        }
    }

}
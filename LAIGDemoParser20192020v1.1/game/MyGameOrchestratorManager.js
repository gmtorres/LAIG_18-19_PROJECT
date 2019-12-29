class MyGameOrchestratorManager{

    constructor(orchestrator,position){
        this.orchestrator = orchestrator;
        if(position == undefined)
            this.position = [0,0,0];
        else this.position = position;

        this.plane = new MyRectangle(this.orchestrator.getScene(),0,0,3,0,1);
        //this.replayButton = new MyCircle(this.orchestrator.getScene(),50,.2,30);
        this.replayButton = new MySphere(this.orchestrator.getScene(),50,0.25,15,15);
        this.undoButton = new MySphere(this.orchestrator.getScene(),51,0.25,15,15);
    }

    parseSelected(id){
        if(id == this.replayButton.uniqueID){
            if( this.orchestrator.state == this.orchestrator.gameStates['Destination Piece Selection'] ||
                this.orchestrator.state == this.orchestrator.gameStates['Destination Tile Selection']){

                this.orchestrator.animator.replay();
                this.orchestrator.state = this.orchestrator.gameStates['Replay Animation'];
                console.log('replay');
            }else if (this.orchestrator.state == this.orchestrator.gameStates['Replay Animation']){
                this.orchestrator.animator.end();
                this.orchestrator.resetSelection();
                this.orchestrator.state = this.orchestrator.gameStates['Destination Piece Selection'];
                this.orchestrator.animating = false;
                console.log('stop replay');
            }
            return true;
        }else if(id == this.undoButton.uniqueID){
            if( this.orchestrator.state == this.orchestrator.gameStates['Destination Piece Selection'] ||
                this.orchestrator.state == this.orchestrator.gameStates['Destination Tile Selection']){

                let prevGameBoard = this.orchestrator.gameSequence.undo();
                if(prevGameBoard == false){
                    return true;
                }
                this.orchestrator.state = this.orchestrator.gameStates['Undo Animation'];
                this.orchestrator.gameBoard = prevGameBoard;
                console.log('undo');
            }
            return true;
        }

        return false;
    }   

    displayPickableObject(obj){
        obj.enablePickable();
        obj.display();
        obj.disablePickable();
    }

    display(){
        this.orchestrator.getScene().pushMatrix();
        let board = this.orchestrator.boardCoords;
        this.orchestrator.getScene().translate(board[0],board[1],board[2]);
        this.orchestrator.getScene().translate(this.position[0],this.position[1],this.position[2]);
        this.orchestrator.getScene().rotate(-.4,1,0,0);
        this.plane.display();

        this.orchestrator.getScene().pushMatrix();
        this.orchestrator.getScene().scale(1,1,.1);
        this.orchestrator.getScene().translate(2.5,0.5,0.01);
        this.orchestrator.getScene().rotate(Math.PI/2,1,0,0);
        this.displayPickableObject(this.replayButton);
        this.orchestrator.getScene().popMatrix();

        this.orchestrator.getScene().pushMatrix();
        this.orchestrator.getScene().scale(1,1,.1);
        this.orchestrator.getScene().translate(1.8,0.5,0.01);
        this.orchestrator.getScene().rotate(Math.PI/2,1,0,0);
        this.displayPickableObject(this.undoButton);
        this.orchestrator.getScene().popMatrix();


        this.orchestrator.getScene().popMatrix();
    }
} 
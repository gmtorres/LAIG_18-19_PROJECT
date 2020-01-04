class MyGameOrchestratorManager{

    constructor(orchestrator,position){
        this.orchestrator = orchestrator;
        if(position == undefined)
            this.position = [0,0,0];
        else this.position = position;

        this.plane = new MyRectangle(this.orchestrator.getScene(),0,0,3,0,1);

        this.replayButton = new MyRectangle(this.orchestrator.getScene(),50,0,0.6,0,0.3);
        this.undoButton = new MyRectangle(this.orchestrator.getScene(),51,0,0.6,0,0.3);
        this.playerScore = new MyRectangle(this.orchestrator.getScene(),52,0,0.6,0,0.6);
        this.label = new MyRectangle(this.orchestrator.getScene(),53,0,0.6,0,0.3);

        this.upButton = new MyRectangle(this.orchestrator.getScene(),54,0,0.2,0,0.2);
        this.downButton = new MyRectangle(this.orchestrator.getScene(),55,0,0.2,0,0.2);

        this.playerTurn = new MyRectangle(this.orchestrator.getScene(),55,0,0.2,0,0.2);


        this.materialWhite = new CGFappearance(this.orchestrator.scene);
        this.materialWhite.setAmbient(0.1, 0.1, 0.1, 1);
        this.materialWhite.setDiffuse(0.9, 0.9, 0.9, 1);
        this.materialWhite.setSpecular(0.1, 0.1, 0.1, 1);
        this.materialWhite.setShininess(10.0);

        this.undoTexture = new CGFtexture(this.orchestrator.scene, "scenes/images/undo.jpg");
        this.replayTexture = new CGFtexture(this.orchestrator.scene, "scenes/images/replay.jpg");
        this.numbers = [];
        this.numbers[1] = new CGFtexture(this.orchestrator.scene, "scenes/images/1.jpg");
        this.numbers[2] = new CGFtexture(this.orchestrator.scene, "scenes/images/2.jpg");
        this.numbers[3] = new CGFtexture(this.orchestrator.scene, "scenes/images/3.jpg");
        this.numbers[4] = new CGFtexture(this.orchestrator.scene, "scenes/images/4.jpg");
        this.numbers[5] = new CGFtexture(this.orchestrator.scene, "scenes/images/5.jpg");
        this.numbers[6] = new CGFtexture(this.orchestrator.scene, "scenes/images/6.jpg");
        this.numbers[7] = new CGFtexture(this.orchestrator.scene, "scenes/images/7.jpg");
        this.numbers[8] = new CGFtexture(this.orchestrator.scene, "scenes/images/8.jpg");
        this.numbers[9] = new CGFtexture(this.orchestrator.scene, "scenes/images/9.jpg");
        this.numbers[0] = new CGFtexture(this.orchestrator.scene, "scenes/images/0.jpg");

        this.player1Label = new CGFtexture(this.orchestrator.scene, "scenes/images/player1.jpg");
        this.player2Label = new CGFtexture(this.orchestrator.scene, "scenes/images/player2.jpg");

        this.timeLabel = new CGFtexture(this.orchestrator.scene, "scenes/images/time.jpg");

        this.upLabel = new CGFtexture(this.orchestrator.scene, "scenes/images/up.jpg");
        this.downLabel = new CGFtexture(this.orchestrator.scene, "scenes/images/down.jpg");


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
        }else if(id == this.upButton.uniqueID){
            if(this.orchestrator.gameStarted == true)
                return true;
            this.orchestrator.maxMoveTime++;
            if(this.orchestrator.maxMoveTime >= 100)
                this.orchestrator.maxMoveTime = 99;
            return true;
        }else if(id == this.downButton.uniqueID){
            if(this.orchestrator.gameStarted == true)
                return true;
            this.orchestrator.maxMoveTime--;
            if(this.orchestrator.maxMoveTime < 0)
                this.orchestrator.maxMoveTime = 0;
            return true;
        }
        return false;
    }
    

    displayPickableObject(obj){
        obj.enablePickable();
        this.materialWhite.apply();
        obj.display();
        obj.disablePickable();
    }

    display(){
        this.orchestrator.getScene().pushMatrix();
        
        //plane
        let board = this.orchestrator.boardCoords;
        this.orchestrator.getScene().translate(board[0],board[1],board[2]);
        this.orchestrator.getScene().translate(this.position[0],this.position[1],this.position[2]);
        this.orchestrator.getScene().rotate(-.4,1,0,0);
        this.materialWhite.apply();
        this.plane.display();

        this.orchestrator.getScene().pushMatrix();
        this.orchestrator.getScene().translate(3,0,0);
        this.orchestrator.getScene().rotate(Math.PI,0,1,0);
        this.plane.display();
        this.orchestrator.getScene().popMatrix();

        //replay button
        this.orchestrator.getScene().pushMatrix();
        this.orchestrator.getScene().scale(1,1,.1);
        this.orchestrator.getScene().translate(2.3,0.6,0.01);
        this.materialWhite.setTexture(this.replayTexture);
        this.displayPickableObject(this.replayButton);
        this.materialWhite.setTexture(null);
        this.orchestrator.getScene().popMatrix();

        //undo button
        this.orchestrator.getScene().pushMatrix();
        this.orchestrator.getScene().scale(1,1,.1);
        this.orchestrator.getScene().translate(2.3,0.35,0.01);
        this.materialWhite.setTexture(this.undoTexture);
        this.displayPickableObject(this.undoButton);
        this.materialWhite.setTexture(null);
        this.orchestrator.getScene().popMatrix();

        //player 1 score
        this.orchestrator.getScene().pushMatrix();
        this.orchestrator.getScene().scale(1,1,.1);
        this.orchestrator.getScene().translate(0.1,0.3,0.01);
        this.materialWhite.setTexture(this.numbers[this.orchestrator.player1Score]);
        this.materialWhite.apply();
        this.playerScore.display();
        this.orchestrator.getScene().translate(0,-0.2,0);
        this.materialWhite.setTexture(this.player1Label);
        this.materialWhite.apply();
        this.label.display();
        this.materialWhite.setTexture(null);
        this.orchestrator.getScene().popMatrix();

        //player 2 score
        this.orchestrator.getScene().pushMatrix();
        this.orchestrator.getScene().scale(1,1,.1);
        this.orchestrator.getScene().translate(0.8,0.3,0.01);
        this.materialWhite.setTexture(this.numbers[this.orchestrator.player2Score]);
        this.materialWhite.apply();
        this.playerScore.display();
        this.orchestrator.getScene().translate(0,-0.2,0);
        this.materialWhite.setTexture(this.player2Label);
        this.materialWhite.apply();
        this.label.display();
        this.materialWhite.setTexture(null);
        this.orchestrator.getScene().popMatrix();

        //max time
        let time = this.orchestrator.gameStarted ? this.orchestrator.currentMoveTime : this.orchestrator.maxMoveTime;
        if(time < 0) time = 0;

        this.orchestrator.getScene().pushMatrix();
        this.orchestrator.getScene().scale(1,1,.1);
        this.orchestrator.getScene().translate(1.3,0.3,0.01);
        this.materialWhite.setTexture(this.numbers[Math.floor(time/10)]);
        this.materialWhite.apply();
        this.playerScore.display();
        this.orchestrator.getScene().translate(0.39,0,0.0);
        this.materialWhite.setTexture(this.numbers[Math.floor(time%10)]);
        this.materialWhite.apply();
        this.playerScore.display();
        this.orchestrator.getScene().translate(-0.2,-0.2,0);
        this.materialWhite.setTexture(this.timeLabel);
        this.materialWhite.apply();
        this.label.display();
        this.materialWhite.setTexture(null);
        this.orchestrator.getScene().popMatrix();
        
        //down button
        this.orchestrator.getScene().pushMatrix();
        this.orchestrator.getScene().scale(1,1,.1);
        this.orchestrator.getScene().translate(1.45,0.15,0.011);
        this.materialWhite.setTexture(this.downLabel);
        this.materialWhite.apply();
        this.displayPickableObject(this.downButton);
        this.materialWhite.setTexture(null);
        this.orchestrator.getScene().popMatrix();

        //up button
        this.orchestrator.getScene().pushMatrix();
        this.orchestrator.getScene().scale(1,1,.1);
        this.orchestrator.getScene().translate(2,0.15,0.011);
        this.materialWhite.setTexture(this.upLabel);
        this.materialWhite.apply();
        this.displayPickableObject(this.upButton);
        this.materialWhite.setTexture(null);
        this.orchestrator.getScene().popMatrix();

        //player label
        this.orchestrator.getScene().pushMatrix();
        this.orchestrator.getScene().scale(1,1,.1);
        this.orchestrator.getScene().translate(2.35,0.15,0.011);
        this.materialWhite.setTexture(this.numbers[this.orchestrator.currentPlayer]);
        this.materialWhite.apply();
        this.playerTurn.display();
        this.orchestrator.getScene().translate(0.25,0,0);
        this.materialWhite.setTexture(this.numbers[this.orchestrator.currentTurn]);
        this.materialWhite.apply();
        this.playerTurn.display();
        this.materialWhite.setTexture(null);
        this.orchestrator.getScene().popMatrix();


        this.orchestrator.getScene().popMatrix();
    }
} 
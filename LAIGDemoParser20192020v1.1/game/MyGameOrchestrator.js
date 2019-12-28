class MyGameOrchestrator {

    constructor(filenames, scene) {
        if(filenames.length == 0){
            throw new TypeError('filemanes must bu greater than 0'); 
        }
        this.scene = scene;
        this.scene.gameOrchestrator = this;
        this.scene.filenames = filenames;

        this.gameBoard = new MyGameBoard(this);
        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator(this, this.gameSequence);
        this.theme = new MySceneGraph(filenames[0], this.scene);
        this.manager = new MyGameOrchestratorManager(this,[0.5,0,-1]);
        this.prolog = null; //new MyPrologInterface(...);
        this.gameStates = {
            'Menu': 0,
            'Load Scene': 1,
            'Next Turn': 2,
            'Destination Piece Selection': 3,
            'Destination Tile Selection': 4,
            'Movement Animation': 5,
            'Evaluate Game End': 6,
            'End Game': 7,

            'Undo Animation' : 8,
            'Replay Animation' : 9,
            'Change Camera Position' : 10
        }
        this.state = 2;

        this.currenPlayer = 1;
        this.currentTurn = 0;

        this.selectedPiece = null;
        this.selectedTile = null;

        this.animating = false;

        this.scene.camera = new CGFcamera(0.4, 0.1, 300, vec3.fromValues(15, 12, 8), vec3.fromValues(2, 0, 2));
        this.scene.interface.setActiveCamera(this.scene.camera);

        this.player1Piece = null;
        this.player2Piece = null;
        this.tile1 = null;
        this.tile2 = null;

    }

    onLoaded() {
        this.scene.camera = new CGFcamera(0.4, 0.1, 300, vec3.fromValues(15, 12, 8), vec3.fromValues(2.5 + this.boardCoords[0], 0 + this.boardCoords[1], 2.5 + this.boardCoords[2]));
        this.scene.interface.setActiveCamera(this.scene.camera);

        this.player1Piece = this.theme.piecesName1[0];
        this.player2Piece = this.theme.piecesName2[0];

        this.tile1 = this.theme.tilesName1[0];
        this.tile2 = this.theme.tilesName2[0];

        this.gameBoard.setPieceType();
        this.gameBoard.setTilesType();
    }

    changePiece(player,id){
        if(player == 1)
            this.player1Piece = id;
        if(player == 2)
            this.player2Piece = id;
    }

    updateBoardTheme(){
        this.gameBoard.setPieceType();
        this.gameBoard.setTilesType();
    }

    changeTheme(value){
        console.log(value);
        this.theme = new MySceneGraph(value, this.scene);
    }


    getScene() {
        return this.scene;
    }

    managePick(mode, results) {
        if (mode == false /* && some other game conditions */) {
            if (results != null && results.length > 0) { // any results?
                for (var i = 0; i < results.length; i++) {
                    var obj = results[i][0]; // get object from result
                    if (obj) { // exists?
                        var uniqueId = results[i][1] // get id
                        this.OnObjectSelected(obj, uniqueId);
                    }
                } // clear results
                results.splice(0, results.length);
            }
        }
    }

    OnObjectSelected(obj, id) {
        if (obj instanceof MyPiece) {
            if(this.state == this.gameStates['Destination Piece Selection']){     
                this.selectedPiece = obj;
            }
        } else if (obj instanceof MyTile) {
            if(this.state == this.gameStates['Destination Tile Selection']){  
                this.selectedTile = obj;
            }
        } else {
            // error ?

            if(!this.manager.parseSelected(id)){
                console.log("error");
                this.selectedPiece = null;
                this.selectedTile = null;

                this.state = this.gameStates['Destination Piece Selection'];
            }

        }
    }

    updateNextPlayer(){
        if(this.currentTurn == 2){
            this.currenPlayer = (this.currenPlayer)%2 + 1;
            this.currentTurn = 1;
            return true;
        }else{
            this.currentTurn++;
            return false;
        }
    }
    updatePreviousPlayer(){
        if(this.currentTurn == 1){
            this.currenPlayer = (this.currenPlayer)%2 + 1;
            this.currentTurn = 2;
        }else{  
            this.currentTurn--;
        }
    }

    setSelectable(){
        //impedir que o jogador escolhaa s peças do adversario
        if(this.currenPlayer == 1){
            this.gameBoard.setPlayerSelectable(1,true);
            this.gameBoard.setPlayerSelectable(2,false);
        }else if(this.currenPlayer == 2){
            this.gameBoard.setPlayerSelectable(1,false);
            this.gameBoard.setPlayerSelectable(2,true);
        }
    }

    resetSelection(){
        this.selectedPiece = null;
        this.selectedTile = null;
    }

    linearAproximation(origValue , targetValue , delta){
        if(origValue - targetValue > 0){
            if(origValue - delta < targetValue){
                origValue = targetValue;
            }else origValue -= delta;
        }else if(origValue - targetValue < 0){
            if(origValue + delta > targetValue){
                origValue = targetValue;
            }else origValue += delta;
        }
        return origValue;
    }
    arrayLinearAproximation(origArray,targetArray,delta){
        for(let i = 0; i < origArray.length;i++){
            origArray[i] = this.linearAproximation(origArray[i],targetArray[i],delta);
        }
    }

    changeCamera(){
        let currentCamera = this.scene.camera;
        let targetCamera = null;
        this.scene.interface.setActiveCamera(null);
        if(this.currenPlayer == 1){
            targetCamera = new CGFcamera(0.4, 0.1, 300, vec3.fromValues(15, 12, 8), vec3.fromValues(2.5 + this.boardCoords[0], 0 + this.boardCoords[1], 2.5 + this.boardCoords[2]));
        }else if(this.currenPlayer == 2){
            targetCamera = new CGFcamera(0.4, 0.1, 300, vec3.fromValues(-12.5, 12, 8), vec3.fromValues(2.5 + this.boardCoords[0], 0 + this.boardCoords[1], 2.5 + this.boardCoords[2]));
        }

        if(currentCamera.position[0] === targetCamera.position[0] && currentCamera.position[1] == targetCamera.position[1] && currentCamera.position[2] == targetCamera.position[2]){
            this.scene.interface.setActiveCamera(this.scene.camera);
            return false;
        }
        
        this.arrayLinearAproximation(currentCamera.position,targetCamera.position,0.3);
        this.arrayLinearAproximation(currentCamera.target,targetCamera.target,0.3);
        this.arrayLinearAproximation(currentCamera.direction,targetCamera.direction,0.2);
        this.arrayLinearAproximation(currentCamera._viewMatrix,targetCamera._viewMatrix,0.3);
        this.arrayLinearAproximation(currentCamera._projectionMatrix,targetCamera._projectionMatrix,0.2);
        this.arrayLinearAproximation(currentCamera._up,targetCamera._up,0.3);
    }

    orchestrate() {
        //manage picks
        this.managePick(false,this.scene.pickResults);
        //clear ids from objs
        this.scene.clearPickRegistration();

        switch (this.state) {
            case this.gameStates['Next Turn']:

                if(this.updateNextPlayer())
                    this.state = this.gameStates['Change Camera Position'];
                else 
                    this.state = this.gameStates['Destination Piece Selection'];
                this.setSelectable();
                this.resetSelection();

                
                break;
            case this.gameStates['Destination Piece Selection']:
                if(this.selectedPiece != null){
                    //deixar de selecionar peças
                    this.gameBoard.setPlayerSelectable(1,false);
                    this.gameBoard.setPlayerSelectable(2,false);
                    //tiles ftw
                    this.gameBoard.setTilesSelectable(true);
                    this.state = this.gameStates['Destination Tile Selection'];
                }
                break;
            case this.gameStates['Destination Tile Selection']:
                if(this.selectedTile != null){
                    this.gameBoard.setTilesSelectable(false);

                    let move = new MyGameMove(this.selectedPiece,this.selectedPiece.getTile(),this.selectedTile);
                    //let move2 = new MyGameMove(this.gameBoard.tiles[16].getPiece(),this.gameBoard.tiles[16],this.gameBoard.tiles[0]);
                    let comp = new MyGameMoves(this.gameBoard,[move]);

                    this.gameSequence.addMove(comp);

                    //this.animating = true;
                    this.state = this.gameStates['Movement Animation'];
                }
                break;
            case this.gameStates['Movement Animation']:
                
                if(this.animator.update(this.scene.time) == false){
                    this.animating = false;
                    this.state = this.gameStates['Evaluate Game End'];
                    this.gameBoard.movePiece(this.selectedPiece , this.selectedPiece.getTile() , this.selectedTile );
                    this.gameBoard.buildBoardFromTiles();
                }
                break;
            case this.gameStates['Evaluate Game End']:
                this.state = this.gameStates['Next Turn'];
                break;
            
            case this.gameStates['Undo Animation']:
                    if(this.animator.update(this.scene.time) == false){
                        this.animating = false;
                        this.resetSelection();
                        this.state = this.gameStates['Change Camera Position'];
                        this.updatePreviousPlayer();
                        this.setSelectable();
                        //this.gameBoard.buildBoardFromTiles();
                    }
                    break;
            case this.gameStates['Replay Animation']:
                    if(this.animator.update(this.scene.time) == false){
                        this.animating = false;
                        this.resetSelection();
                        this.state = this.gameStates['Destination Piece Selection'];
                    }
                    break;
            
            case this.gameStates['Change Camera Position']:
                if(this.changeCamera() == false){
                    this.state = this.gameStates['Destination Piece Selection'];
                }
                break;
                    
            default:
                break;
        }

    }




    update(time) {
        this.animator.update(time);
    }

    display() {

        this.theme.displayScene();
        if(this.animating == false){
            this.gameBoard.display();
            //console.log('a');
        }else
            this.animator.display();
        this.manager.display();

    }

}
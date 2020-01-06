class MyGameOrchestrator {

    constructor(filenames, scene) {
        if (filenames.length == 0) {
            throw new TypeError('filemanes must bu greater than 0');
        }
        this.scene = scene;
        this.scene.gameOrchestrator = this;
        this.scene.filenames = filenames;

        this.gameBoard = new MyGameBoard(this);
        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator(this, this.gameSequence);
        this.theme = new MySceneGraph(filenames[0], this.scene);
        this.manager = new MyGameOrchestratorManager(this, [1, 0, -1]);
        this.prolog = new MyPrologInterface(this);
        this.gameStates = {
            'Menu': 0,
            'Load Scene': 1,
            'Next Turn': 2,
            'Destination Piece Selection': 3,
            'Destination Tile Selection': 4,
            'Movement Animation': 5,
            'Evaluate Game End': 6,
            'End Game': 7,

            'Undo Animation': 8,
            'Replay Animation': 9,
            'Change Camera Position': 10,

            'Destination Piece Selected': 11,
            'Destination Tile Selected': 12,
        }
        this.state = 0;

        this.currentPlayer = 1;
        this.currentTurn = 0;

        this.selectedPiece = null;
        this.selectedTile = null;

        this.animating = false;

        this.scene.camera = new CGFcamera(0.4, 0.1, 300, vec3.fromValues(23, 12, 8), vec3.fromValues(2, 0, 2));
        this.scene.interface.setActiveCamera(this.scene.camera);

        this.player1Piece = null;
        this.player2Piece = null;
        this.tile1 = null;
        this.tile2 = null;

        this.player1Score = 0;
        this.player2Score = 0;

        this.player1Type = 'Human'
        this.player2Type = 'Human'

        this.ptypes = ['Human', 'AI lvl 1', 'AI lvl 2', 'AI lvl 3']
        this.defBoards = [0, 1, 2, 3];

        this.defBoard = 0;

        this.maxMoveTime = 0;
        this.currentMoveStartTime = 0;
        this.currentMoveTime = 0;

        this.cameraAnimationTime = null;

        this.gameStarted = false;

        this.cameraTransition = true;

        this.doubleClick = false;

        this.nextState = null;

    }

    onLoaded() {
        if (this.currentPlayer == 1) {
            this.scene.camera = new CGFcamera(45, 0.1, 300, vec3.fromValues(7.5 + this.boardCoords[0], 6 + this.boardCoords[1], 5 + this.boardCoords[2]), vec3.fromValues(2.5 + this.boardCoords[0], 0 + this.boardCoords[1], 2.5 + this.boardCoords[2]));
        } else if (this.currentPlayer == 2) {
            this.scene.camera = new CGFcamera(45, 0.1, 300, vec3.fromValues(-2.5 + this.boardCoords[0], 6 + this.boardCoords[1], 5 + this.boardCoords[2]), vec3.fromValues(2.5 + this.boardCoords[0], 0 + this.boardCoords[1], 2.5 + this.boardCoords[2]));
        }
        this.scene.interface.setActiveCamera(this.scene.camera);

        this.player1Piece = this.theme.piecesName1[0];
        this.player2Piece = this.theme.piecesName2[0];

        this.tile1 = this.theme.tilesName1[0];
        this.tile2 = this.theme.tilesName2[0];

        this.gameBoard.setPieceType();
        this.gameBoard.setTilesType();
    }

    changePiece(player, id) {
        if (player == 1)
            this.player1Piece = id;
        if (player == 2)
            this.player2Piece = id;
    }

    updateBoardTheme() {
        this.gameBoard.setPieceType();
        this.gameBoard.setTilesType();
    }

    changeBoard() {
        if (this.gameStarted == false)
            this.gameBoard.setToDefault(this.defBoard);
    }

    changeTheme(value) {
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


            if (this.state == this.gameStates['Destination Piece Selection']) {
                if( this.doubleClick == false|| (this.doubleClick == true && this.scene.time - obj.lastSelected < 0.3)){
                        this.selectedPiece = obj;
                }
                else if(this.doubleClick == true){
                    obj.lastSelected = this.scene.time;
                }
            }
            if (this.state == this.gameStates['Destination Tile Selection']) {
                if(obj == this.selectedPiece)
                    return;
                if( this.doubleClick == false|| (this.doubleClick == true && this.scene.time - obj.lastSelected < 0.3)){
                    this.animator.setMove(new MyGameMoves(this.gameBoard, [
                        new MyGameMove(this.selectedPiece, new MyTile(this, -1, null, this.selectedPiece.getTile().x, this.selectedPiece.getTile().y, 0.5), this.selectedPiece.getTile()),
                        new MyGameMove(obj, obj.getTile(), new MyTile(this, -1, null, obj.getTile().x, obj.getTile().y, 0.5))
                    ]), this.scene.time);
                    this.selectedPiece.selected = false;
                    this.selectedPiece = obj;
                    this.state = this.gameStates['Destination Piece Selected']
                }
                else if(this.doubleClick == true){
                    obj.lastSelected = this.scene.time;
                }
            }
        } else if (obj instanceof MyTile) {
            if (this.state == this.gameStates['Destination Tile Selection']) {
                if( this.doubleClick == false|| (this.doubleClick == true && this.scene.time - obj.lastSelected < 0.3)){
                    this.selectedTile = obj;
                    if (this.selectedPiece.selected == true)
                        this.selectedPiece.selected = false;
                }
                else if(this.doubleClick == true){
                    obj.lastSelected = this.scene.time;
                }
            }
        } else {
            // error ?

            if (!this.manager.parseSelected(id)) {
                console.log("error");
                this.selectedPiece = null;
                this.selectedTile = null;

                this.state = this.gameStates['Destination Piece Selection'];
            }

        }
    }

    updateNextPlayer() {
        if (this.currentTurn == 2) {
            this.currentPlayer = (this.currentPlayer) % 2 + 1;
            this.currentTurn = 1;
            return this.cameraTransition;
        } else {
            this.currentTurn++;
            return false;
        }
    }
    updatePreviousPlayer() {
        if (this.currentTurn == 1) {
            this.currentPlayer = (this.currentPlayer) % 2 + 1;
            this.currentTurn = 2;
            return this.cameraTransition;
        } else {
            this.currentTurn--;
            return false;
        }
    }

    setSelectable() {
        //impedir que o jogador escolhaa s peças do adversario
        if (this.currentPlayer == 1) {
            this.gameBoard.setPlayerSelectable(1, true);
            this.gameBoard.setPlayerSelectable(2, false);
        } else if (this.currentPlayer == 2) {
            this.gameBoard.setPlayerSelectable(1, false);
            this.gameBoard.setPlayerSelectable(2, true);
        }
    }

    resetSelection() {
        if (this.selectedPiece != null)
            this.selectedPiece.selected = false;
        this.selectedPiece = null;
        this.selectedTile = null;
    }

    linearAproximation(origValue, targetValue, delta) {
        return origValue + (targetValue - origValue) * delta;
    }
    arrayLinearAproximation(origArray, targetArray, delta) {
        let arr = [];
        for (let i = 0; i < origArray.length; i++) {
            arr.push(this.linearAproximation(origArray[i], targetArray[i], delta));
        }
        return arr;
    }

    changeCamera(target) {
        let time = this.scene.time;
        let animationTime = 2.0;
        if (this.cameraAnimationTime == null) {
            this.scene.interface.setActiveCamera(null);
            this.startCamera = [];
            this.startCamera[0] = [...this.scene.camera.position];
            this.startCamera[1] = [...this.scene.camera.target];
            this.startCamera[2] = [...this.scene.camera.direction];
            this.startCamera[3] = [...this.scene.camera._viewMatrix];
            this.startCamera[4] = [...this.scene.camera._projectionMatrix];
            this.startCamera[5] = [...this.scene.camera._up];
            this.startCamera[6] = this.scene.camera.far;
            this.startCamera[7] = this.scene.camera.fov;
            this.startCamera[8] = this.scene.camera.near;
            this.cameraAnimationTime = time;

            this.targetCamera = null;

            if (target != undefined && target != null) {
                this.targetCamera = target;
            } else if (this.currentPlayer == 1) {
                this.targetCamera = new CGFcamera(45, 0.1, 300, vec3.fromValues(7.5 + this.boardCoords[0], 6 + this.boardCoords[1], 5 + this.boardCoords[2]), vec3.fromValues(2.5 + this.boardCoords[0], 0 + this.boardCoords[1], 2.5 + this.boardCoords[2]));
            } else if (this.currentPlayer == 2) {
                this.targetCamera = new CGFcamera(45, 0.1, 300, vec3.fromValues(-2.5 + this.boardCoords[0], 6 + this.boardCoords[1], 5 + this.boardCoords[2]), vec3.fromValues(2.5 + this.boardCoords[0], 0 + this.boardCoords[1], 2.5 + this.boardCoords[2]));
            }
        }

        let currentCamera = this.scene.camera;
        let fraction = (time - this.cameraAnimationTime) / animationTime;
        if (fraction > 1 || fraction <0) {
            //this.scene.camera = this.targetCamera;
            this.scene.interface.setActiveCamera(this.scene.camera);
            this.cameraAnimationTime = null;
            return false;
        }


        currentCamera.position = this.arrayLinearAproximation(this.startCamera[0], this.targetCamera.position, fraction);
        currentCamera.target = this.arrayLinearAproximation(this.startCamera[1], this.targetCamera.target, fraction);
        currentCamera.direction = this.arrayLinearAproximation(this.startCamera[2], this.targetCamera.direction, fraction);
        currentCamera._viewMatrix = this.arrayLinearAproximation(this.startCamera[3], this.targetCamera._viewMatrix, fraction);
        currentCamera._projectionMatrix = this.arrayLinearAproximation(this.startCamera[4], this.targetCamera._projectionMatrix, fraction);
        currentCamera._up = this.arrayLinearAproximation(this.startCamera[5], this.targetCamera._up, fraction);
        currentCamera.far = this.linearAproximation(this.startCamera[6],this.targetCamera.far,fraction);
        currentCamera.fov = this.linearAproximation(this.startCamera[7],this.targetCamera.fov,fraction);
        currentCamera.near = this.linearAproximation(this.startCamera[8],this.targetCamera.near,fraction);


        return true;
    }

    getDirection(tile1, tile2) {
        let dx = tile2.x - tile1.x;
        let dy = tile2.y - tile1.y;

        if (dx != 0 && dy != 0) return '?';

        if (dx < 0) return 'w';
        if (dx > 0) return 's';
        if (dy < 0) return 'a';
        if (dy > 0) return 'd';
    }

    getJSONgameMove() {
        return {
            gameBoard: this.gameBoard.board,
            player: this.currentPlayer,
            number: this.selectedPiece.getTile().y,
            letter: this.selectedPiece.getTile().x,
            direction: this.getDirection(this.selectedPiece.getTile(), this.selectedTile),
            boardbfrPlay: this.gameSequence.getBfrBoard(),
            turn: this.currentTurn
        };
    }

    getPlayerMode() {
        let p = this.currentPlayer;
        let f = function (i) {
            return i[i.length - 1];
        }
        if (p == 1) {
            return f(this.player1Type)
        }
        if (p == 2) {
            return f(this.player2Type)
        }
    }

    setCurrentMoveStartTime() {
        this.currentMoveStartTime = this.scene.time;
    }


    makeGameMoveFromArray(arr) {
        let direction = arr[2];
        let dx = 0;
        let dy = 0;
        if (direction == 'a') dy = -1;
        else if (direction == 'd') dy = +1;
        else if (direction == 's') dx = 1;
        else if (direction == 'w') dx = -1;
        let x = Number(arr[1]) - 1;
        let y = Number(arr[0]) - 1;
        let tile = this.gameBoard.getTile(x, y);
        let destTile = this.gameBoard.getTile(x + dx, y + dy);
        let piece = tile.getPiece();
        return piece;
        //return new MyGameMoves(this.gameBoard, [new MyGameMove(piece, tile, destTile)]);
    }

    orchestrate() {
        //manage picks
        this.managePick(false, this.scene.pickResults);
        //clear ids from objs
        this.scene.clearPickRegistration();

        if (this.gameStarted && this.maxMoveTime != 0) {

            if(this.currentPlayer == 1 && this.player1Type!='Human'){
                this.currentMoveTime = 0;
            }else if(this.currentPlayer == 2 && this.player2Type!='Human'){
                this.currentMoveTime = 0;
            }
            else{
                if (this.state != this.gameStates['Movement Animation'] && this.state != this.gameStates['Destination Piece Selected'] && this.state != this.gameStates['Destination Tile Selected'])
                    this.currentMoveTime = this.maxMoveTime - this.scene.time + this.currentMoveStartTime;
                else
                    this.currentMoveStartTime = this.currentMoveStartTime + (this.currentMoveTime - (this.maxMoveTime - this.scene.time + this.currentMoveStartTime));

                if (this.currentMoveTime < 0) {
                    this.currentMoveTime = 0;
                    this.currentMoveStartTime = this.scene.time;
                    if(this.selectedPiece != null){
                        this.state = this.gameStates['Destination Tile Selected'];
                        this.nextState = this.gameStates['Next Turn'];
                        this.selectedPiece.selected = false;
                        this.animator.setMove(new MyGameMoves(this.gameBoard, [
                            new MyGameMove(this.selectedPiece, new MyTile(this, -1, null, this.selectedPiece.getTile().x, this.selectedPiece.getTile().y, 0.5) , new MyTile(this, -1, null, this.selectedPiece.getTile().x, this.selectedPiece.getTile().y, 0))
                        ]), this.scene.time);
                    }
                    else this.state = this.gameStates['Next Turn'];
                    this.gameSequence.addMove(new MyGameMoves(this.gameBoard, [], false));
                    this.gameBoard.buildBoardFromTiles();
                }
            }
        }

        //console.log(this.animating , this.state , this.selectedPiece == null ? null : this.selectedPiece.selected);

        switch (this.state) {
            case this.gameStates['Menu']:
                if (this.prolog.connected && this.gameStarted) {
                    this.state = this.gameStates['Next Turn'];
                    this.gameSequence.reset();
                }
                break;
            case this.gameStates['Next Turn']:

                if (this.updateNextPlayer())
                    this.state = this.gameStates['Change Camera Position'];
                else
                    this.state = this.gameStates['Destination Piece Selection'];
                this.setSelectable();
                this.resetSelection();

                this.currentMoveStartTime = this.scene.time;
                this.moveRequest = false;
                this.moveReceived = false;
                this.AIMove = null;

                break;
            case this.gameStates['Destination Piece Selection']:
                if ( (this.currentPlayer == 1 && this.player1Type != "Human") || (this.currentPlayer == 2 && this.player2Type != "Human")) {
                    if (!this.moveRequest) {
                        this.prolog.getMove(this.currentTurn, this.currentPlayer, this.getPlayerMode(),this.gameSequence.getBfrBoard());
                        this.moveRequest = true;
                        break;
                    }
                    if (this.moveReceived) {
                        let move = this.makeGameMoveFromArray(this.AIMove);
                        //this.moves = this.gameBoard.getMoves(this.selectedPiece, this.getDirection(this.selectedPiece.getTile(), this.selectedTile));
                        this.moves = this.gameBoard.getMoves(move, this.AIMove[2]);
                        this.gameSequence.addMove(this.moves);
                        this.state = this.gameStates['Movement Animation'];
                        this.AIMove = null;
                        this.moveReceived = false;
                        this.moveRequest = false;
                        break;
                    }
                }

                if (this.selectedPiece != null) {
 
                    this.gameBoard.setTilesSelectable(true);
                    this.state = this.gameStates['Destination Piece Selected'];
                    let tile = this.selectedPiece.getTile();
                    this.animator.setMove(new MyGameMoves(this.gameBoard, [new MyGameMove(this.selectedPiece, tile, new MyTile(this, -1, null, tile.x, tile.y, 0.5))]), this.scene.time);
                }
                break;
            case this.gameStates['Destination Piece Selected']:
                if (this.animator.update(this.scene.time) == false) {
                    this.animating = false;
                    this.selectedPiece.selected = true;
                    this.state = this.gameStates['Destination Tile Selection'];
                }
                break;
            case this.gameStates['Destination Tile Selection']:
                if (this.selectedTile != null) {
                    this.gameBoard.setTilesSelectable(false);

                    this.gameBoard.setPlayerSelectable(1, false);
                    this.gameBoard.setPlayerSelectable(2, false);
                    
                    this.state = this.gameStates['Destination Tile Selected'];
                    this.selectedPiece.selected = false;
                    let tile = this.selectedPiece.getTile();
                    this.animator.setMove(new MyGameMoves(this.gameBoard, [new MyGameMove(this.selectedPiece, new MyTile(this, -1, null, tile.x, tile.y, 0.5), tile)]), this.scene.time);
                }
                break;
            case this.gameStates['Destination Tile Selected']:
                //console.error(this.prolog.checkMove());

                if (this.animator.update(this.scene.time) == false) {
                    this.animating = false;
                    if(this.nextState != null){
                        this.currentMoveStartTime = this.scene.time;
                        this.state = this.nextState;
                        this.nextState = null;
                        break;
                    }
                    this.state = this.gameStates['Movement Animation'];
                    
                    let validMove = this.prolog.checkMove();
                    if (validMove == false) {
                        this.animating = false;
                        this.setSelectable();
                        this.resetSelection();
                        this.state = this.gameStates['Destination Piece Selection'];
                    } else {
                        this.moves = this.gameBoard.getMoves(this.selectedPiece, this.getDirection(this.selectedPiece.getTile(), this.selectedTile));
                        this.gameSequence.addMove(this.moves);
                    }

                }
                break;
            case this.gameStates['Movement Animation']:

                if (this.animator.update(this.scene.time) == false) {
                    this.animating = false;
                    this.state = this.gameStates['Evaluate Game End'];
                    //this.gameBoard.movePiece(this.selectedPiece , this.selectedPiece.getTile() , this.selectedTile );
                    this.gameBoard.movePieces(this.moves);
                    this.gameBoard.buildBoardFromTiles();
                }
                break;
            case this.gameStates['Evaluate Game End']:
                let gameOver = this.prolog.checkGameOver(this.gameBoard.board);
                //console.log(gameOver);
                if (gameOver.continue == false) {
                    if (gameOver.player1Win) {
                        this.player1Score += 1;
                        this.player1Score %= 10;
                    } else if (gameOver.player2Win) {
                        this.player2Score += 1;
                        this.player2Score %= 10;
                    }
                    this.gameStarted = false;
                    this.currentPlayer = 1;
                    this.currentTurn = 0;
                    this.changeBoard(this.defBoard);
                    this.state = this.gameStates['Menu'];
                }
                else this.state = this.gameStates['Next Turn'];
                break;



            case this.gameStates['Undo Animation']:
                if (this.animator.update(this.scene.time) == false) {
                    this.animating = false;
                    this.resetSelection();
                    if (this.updatePreviousPlayer())
                        this.state = this.gameStates['Change Camera Position'];
                    else this.state = this.gameStates['Destination Piece Selection'];
                    this.setSelectable();
                    //this.gameBoard.buildBoardFromTiles();
                    //this.currentMoveTime = this.scene.time;
                }
                break;
            case this.gameStates['Replay Animation']:
                if (this.animator.update(this.scene.time) == false) {
                    this.animating = false;
                    this.resetSelection();
                    if(this.gameStarted){
                        if(this.selectedPiece == null)
                            this.state = this.gameStates['Destination Piece Selection'];
                        else this.state = this.gameStates['Destination Tile Selection'];
                    }else this.state = this.gameStates['Menu'];
                }
                break;

            case this.gameStates['Change Camera Position']:
                this.currentMoveStartTime = this.scene.time;
                if (this.changeCamera() == false) {
                    this.state = this.gameStates['Destination Piece Selection'];
                }
                break;

            default:
                break;
        }

    }

    startGame() {
        if (this.prolog.connected == false) {
            this.prolog._handshake();
            this.state = 0;
        }
        this.gameStarted = true;
        this.currentMoveStartTime = this.scene.time;
    }
    restartGame() {
        if (this.gameStarted == true) {
            this.currentPlayer = 1;
            this.currentTurn = 0;
            this.state = this.gameStates['Menu'];
            if(this.selectedPiece != null)
                this.selectedPiece.selected = false;
            this.gameStarted = false;
            this.animating = false;
            this.changeBoard(this.defBoard);
        }
    }


    update(time) {
        //this.animator.update(time);
    }

    display() {

        this.theme.displayScene();
        if (this.animating == false) {
            this.gameBoard.display();
            //console.log('a');
        } else
            this.animator.display();
        this.manager.display();

    }

}
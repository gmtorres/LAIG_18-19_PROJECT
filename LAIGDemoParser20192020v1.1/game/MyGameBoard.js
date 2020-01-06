class MyGameBoard {

    constructor(orchestrator, board) {
        this.orchestrator = orchestrator;
        if (board == undefined)
            this.createNewBoard();
        else this.board = board;
        this.piecesOffset = [];
        this.createTiles();
        this.createPieces();

        this.tempTile = null;
        
    }

    createNewBoard(i = 0) {
        this.tempTile = null;
        if (i == 0) {
            this.board = [
                [0, 0, 0, 0, 0],
                [0, 2, 2, 2, 0],
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 0, 0, 0]
            ];
        } else {
            this.board = [
                [0, 0, 0, 0, 0],
                [0, 2, 2, 2, 0],
                [0, 0, 0, 0, 0],
                [0, 1, 1, 1, 0],
                [0, 0, 0, 0, 0]
            ];
        }
    }

    setToDefault(i) {
        this.tempTile = null;
        let board = [];
        board[0] = [
            [0, 0, 0, 0, 0],
            [0, 2, 2, 2, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0]
        ];
        board[1] = [
            [0, 2, 0, 2, 0],
            [0, 0, 2, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0],
            [0, 1, 0, 1, 0]
        ];
        board[2] = [
            [2, 0, 2, 0, 2],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [1, 0, 1, 0, 1]
        ];
        board[3] = [
            [0, 0, 2, 0, 0],
            [0, 2, 0, 2, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0],
            [0, 0, 1, 0, 0]
        ];
        this.board = board[i];
        this.redefinePieces();
    }


    buildBoardFromTiles() {
        this.board = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ];

        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].piece != null) {
                let x = this.tiles[i].x;
                let y = this.tiles[i].y;
                let id = this.tiles[i].piece.getId();
                if (id >= 100 && id < 150) {
                    this.board[x][y] = 1;
                }
                if (id >= 150 && id < 200) {
                    this.board[x][y] = 2;
                }
            }
        }
    }

    createTiles() {
        //new MyPlane(this.orchestrator.getScene(), 1, 32, 32)
       
        this.tiles = [];
        
        let val = 0;
        for (var a = 0; a < 5; a++) {
            for (var b = 0; b < 5; b++) {
                if (val % 2 == 0) {
                    this.tiles.push(new MyTile(this.orchestrator, (a * 5 + b) + 1, null, a, b));
                } else {
                    this.tiles.push(new MyTile(this.orchestrator, (a * 5 + b) + 1, null, a, b));
                }
                val += 1;
            }
        }
    }

    setTilesType(){
        let tile1;
        let tile2;
        tile1 = this.orchestrator.theme.tilesRef1[this.orchestrator.tile1];
        tile2 = this.orchestrator.theme.tilesRef2[this.orchestrator.tile2];

        
        for(let i = 0; i < this.tiles.length;i++){
            if(i % 2 == 0)
                this.tiles[i].setType(tile1);
            else 
                this.tiles[i].setType(tile2);
        }

    }

    createPieces() {
        // new MyTorus(this.orchestrator.getScene(),1,0.2,0.1,20,20)


        this.pieces = [];
        let player1 = 0;
        let player2 = 0;
        for (var a = 0; a < 5; a++) {
            for (var b = 0; b < 5; b++) {
                let value = this.board[a][b];
                if (value == 1) {
                    this.pieces.push(new MyPiece(this.orchestrator, 100 + (player1++), null, this.tiles[a * 5 + b]));
                    this.piecesOffset.push(Math.random()*10);
                } else if (value == 2) {
                    this.pieces.push(new MyPiece(this.orchestrator, 150 + (player2++), null, this.tiles[a * 5 + b]));
                    this.piecesOffset.push(Math.random()*10);
                }
            }
        }
    }

    setPieceType(){
        let piece1;
        let piece2;

        piece1 = this.orchestrator.theme.piecesRef1[this.orchestrator.player1Piece];
        piece2 = this.orchestrator.theme.piecesRef2[this.orchestrator.player2Piece];
        
        this.pieces.forEach(piece => {
            let id = piece.uniqueID;
            if(id >= 100 && id < 150){
                piece.setType(piece1);
            }else if(id >= 150 && id < 200){
                piece.setType(piece2);
            }
        });

    }

    setPlayerSelectable(player, mode) {
        for (let i = 0; i < this.tiles.length; i++) {
            let piece = this.tiles[i].getPiece();
            if (piece != null) {
                let id = piece.getId();
                if (player == 1) {
                    if (id >= 100 && id < 150)
                        piece.selectable = mode;
                } else if (player == 2) {
                    if (id >= 150 && id < 200)
                        piece.selectable = mode;
                }
            }
        }
    }

    resetPieces() {
        this.pieces.forEach(element => {
            element.setTile(null);
        });
    }

    redefinePieces() {
        let pieces1 = [];
        let pieces2 = [];
        this.resetPieces();
        this.pieces.forEach(piece => {
            let id = piece.getId();
            if (id >= 100 && id < 150) {
                pieces1.push(piece);
            }
            if (id >= 150 && id < 200) {
                pieces2.push(piece);
            }
        });
        let player1 = 0;
        let player2 = 0;
        for (let i = 0; i < this.board.length; i++) {
            for (let j = 0; j < this.board[i].length; j++) {
                let char = this.board[i][j];
                let tile = this.getTile(i, j);
                if (char == 1) {
                    pieces1[player1].setTile(tile);
                    player1 += 1;
                }
                if (char == 2) {
                    pieces2[player2].setTile(tile);
                    player2 += 1;
                }
                
            }
            
        }
    }

    setTilesSelectable(mode) {
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].selectable = mode;
        }
    }

    setPiecesAnimated(value) {
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i].getPiece().animated = value;
        }
    }

    getTile(x, y) {
        let i = x * 5 + y;
        if(i < 0 || i >= this.tiles.length) return null;
        return this.tiles[i];
    }

    getPieceByTile(x, y) {
        let i = x * 5 + y;
        if(i < 0 || i >= this.tiles.length) return null;
        return this.tiles[i].getPiece();
    }

    movePiece(piece, startTile, destTile) {
        startTile.setPiece(null);
        piece.setTile(destTile);
    }

    movePiece2(startTile, destTile) {
        let piece = startTile.getPiece();
        startTile.setPiece(null);
        piece.setTile(destTile);
    }

    movePieces(gameMoves){
        let moves = gameMoves.moves;
        for(let i = moves.length-1; i >=0;i--){
            this.movePiece(moves[i].piece,moves[i].origTile,moves[i].destTile);
        }
    }

    getMoves(piece,direction){
        let dx = 0;
        let dy = 0;
        if(direction == 'a') dy = -1;
        else if(direction == 'd') dy = +1;
        else if(direction == 's') dx = 1;
        else if(direction == 'w') dx = -1;
        else return new MyGameMoves(this,[],false);;
        
        let pieceT = piece;
        let moves = [];
        let destTile;
        while(pieceT != null){
            let tile = pieceT.getTile();
            let destX = tile.x + dx;
            let destY = tile.y + dy;
            if(destX >=0 && destX <=4 && destY >=0 && destY <=4){
                destTile = this.getTile(destX , destY);
                moves.push(new MyGameMove(pieceT, tile, destTile));
            }else{
                this.tempTile = new MyTile(this.orchestrator,-1,null,destX,destY)
                moves.push(new MyGameMove(pieceT, tile, this.tempTile,true));
                break;
            }
            pieceT = destTile.getPiece();
        }
        return new MyGameMoves(this,moves,false);

    }


    display() {

    this.orchestrator.getScene().pushMatrix();
    let delta = this.orchestrator.boardCoords;
    this.orchestrator.getScene().translate(delta[0], delta[1], delta[2]);
    let a = 0;
    for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i].display();
        let piece = this.tiles[i].getPiece();
        
        if (piece != null) {
            this.orchestrator.getScene().pushMatrix();
            this.orchestrator.getScene().translate(0.5,0,0.5);
            piece.display();
            this.orchestrator.getScene().popMatrix();
        }
    }
    if(this.tempTile != null){
        this.tempTile.display();
        let piece = this.tempTile.getPiece();
        
        if (piece != null) {
            this.orchestrator.getScene().pushMatrix();
            this.orchestrator.getScene().translate(0.5,0,0.5);
            piece.display();
            this.orchestrator.getScene().popMatrix();
        }
    }
    this.orchestrator.getScene().popMatrix();
}



}
const PROLOG_SERVER_PORT = "8081";
const REQUEST_ADDRESS = "http://localhost:" + PROLOG_SERVER_PORT + "/";

class MyPrologInterface{
   
  _sendRequest(pred, args) {
    if (!args.isArray() || typeof (pred) != 'string') {
      return;
    }
    let request = new XMLHttpRequest();
    let url = REQUEST_ADDRESS + pred + "(" + args.join(',') + ")";

    request.open("GET", url, false);
    request.send(); 

    if (request.readyState == 4 && request.status == 200) {
      return request.responseText;
    }

    return null;
  }

  checkGameOver(board) {
    let player1Win = this._sendRequest("check_gameOver", [board, 1]);
    let player2Win = this._sendRequest("check_gameOver", [board, 2]);

    return {
      player1Win: player1Win,
      player2Win: player2Win,
      continue: !player1Win && !player2Win
    };
  }

  checkMove() {
    
  }


}
const PROLOG_SERVER_PORT = "8081";
const REQUEST_ADDRESS = "http://localhost:" + PROLOG_SERVER_PORT + "/";

class MyPrologInterface{
   
  constructor() {
    
  }


  /**
   * Tries to connect to PROLOG server
   */
  async _handshake() {
    while (true) {
      let response = this._sendRequest("handshake", []);
      
      if (response == "handshake") {
        console.log("Connection to PROLOG server in port " + PROLOG_SERVER_PORT + " established.");
        break;
      }

      console.warn("Retrying handshake to " + REQUEST_ADDRESS);
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  /**
   * Sends a request to the PROLOG server to execute the predicate pred(args)
   * @param {string} pred Predicate to execute
   * @param {Array} args Array of arguments to execute
   */
  _sendRequest(pred, args) {
    if (!Array.isArray(args) || typeof (pred) != 'string') {
      return;
    }

    let request = new XMLHttpRequest();
    let argss = (args.length) ? "(" + args.join(',') + ")" : "";
    let url = REQUEST_ADDRESS + pred + argss;

    request.open("GET", url, false);

    try {
      request.send(); 
    } catch (error) {
      return false;
    }

    if (request.status == 200) {
      return request.responseText;
    }

    if (request.status == 404) {
      return false;
    }

    return null;
  }

  /**
   * Checks if the Game has ended
   * @param {Array of Arrays} board Nudge Board in Prolog sintax
   */
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
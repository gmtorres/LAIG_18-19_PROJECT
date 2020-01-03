const PROLOG_SERVER_PORT = "8081";
const REQUEST_ADDRESS = "http://localhost:" + PROLOG_SERVER_PORT + "/";

class MyPrologInterface{
   
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.connected = false;
  }


  /**
   * Tries to connect to PROLOG server
   */
  async _handshake() {
    this.connected = false;
    while (true) {
      let response = this._sendRequest("handshake", []);
      
      if (response == "handshake") {
        console.log("Connection to PROLOG server in port " + PROLOG_SERVER_PORT + " established.");
        this.connected = true;
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
    // args.forEach(e => e = JSON.stringify(e));
    let argss = (args.length) ? "(" + args.join(',') + ")" : "";
    let url = REQUEST_ADDRESS + pred + argss;

    request.open("GET", url, false);
    console.warn(url);

    try {
      request.send(); 
    } catch (error) {
      return false;
    }

    if (request.status == 200) {
      return request.responseText;
    }

    if (request.status == 404) {
      this.connected == false;
      return false;
    }

    return null;
  }

  /**
   * Checks if the Game has ended
   * @param {Array of Arrays} board Nudge Board in Prolog sintax
   */
  checkGameOver(board) {
    let player1Win = this._sendRequest("check_gameOver", [JSON.stringify(board), 1]) == "1";
    let player2Win = this._sendRequest("check_gameOver", [JSON.stringify(board), 2]) == "1";

    return {
      player1Win: player1Win,
      player2Win: player2Win,
      continue: !player1Win && !player2Win
    };
  }

  checkMove() {
    let json = this.orchestrator.getJSONgameMove();
    let args = [
      JSON.stringify(json.gameBoard),
      json.player,
      json.number +1,
      json.letter +1 ,
      "'" + json.direction + "'",
      JSON.stringify(json.boardbfrPlay),
      json.turn];
    

    return this._sendRequest("check_move", args) == "1"; 
  }

  getMove(turn,player,mode) {
    let args = [
      JSON.stringify(this.orchestrator.gameBoard.board),
      player,
      turn,
      mode
    ]
    console.log(args);

    var orchestrator = this.orchestrator;
    let pred = "get_AIMove";
    let request = new XMLHttpRequest();
    // args.forEach(e => e = JSON.stringify(e));
    let argss = (args.length) ? "(" + args.join(',') + ")" : "";
    let url = REQUEST_ADDRESS + pred + argss;

    request.open("GET", url, true);
    request.send();

    request.onreadystatechange = function (evt) {
      if (this.readyState == 4 && this.status == 200) {
        orchestrator.moveReceived = true;
        orchestrator.AIMove = Array.from(this.responseText).filter(ele => ele!="," && ele != '[' && ele != ']');
      }
    }
  }


}
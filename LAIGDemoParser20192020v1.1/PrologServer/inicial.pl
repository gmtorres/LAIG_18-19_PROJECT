:- include('display.pl').
:- include('boards.pl').
:- include('getInput.pl').
:- include('gameUtils.pl').
:- include('evaluate.pl').
:- include('miniMax.pl').
:- include('menu.pl').

:- use_module(library(random)).

:- dynamic lastBoard/1.

lastBoard([]).

/*
    clean
    Cleans and preprares de Prolog to handle a new play in case an error was made
*/

clean:-
    retractall(player(_A,_B)).

/*
    play
    Predicate that will be the first to be called and allows to play the game
*/

play:-
    clean,
    menu.

/*
    validPosition(+N,+L)
    N - Number of Board collumn
    L - Letter of Board Row
*/
validPosition(N,L):-
    numero(N),
    letter(L).

/*
    validMove(+Board,+Player,+Number,+Letter,+Direction,-PlayerNudged,-OpponentNudged)
*/
validMove(Board,Player,Number,Letter,Direction,PlayerNudged,OpponentNudged):-
    inc(Direction,Incx,Incy),
    getLinkedNumber(Board,Number,Letter,Incx,Incy,Player,PlayerNudged),
    PlayerNudged > 0,
    Nt is Number + PlayerNudged * Incx,
    Lt is Letter + PlayerNudged * Incy,
    validPosition(Nt,Lt),
    nextPlayer(Player,Opponent),
    getLinkedNumber(Board,Nt,Lt,Incx,Incy,Opponent,OpponentNudged),
    PlayerNudged>OpponentNudged.


/*
    checkBoard(+Board,+Player,+Turn,+Number,+Letter,+Direction,+PlayerNudged,+OpponentNudged)
    Checks if the complete turn is not redundant, if it's the second part of a player's turn it checks if the board is not the same as the one before the first part of the player's turn.
    Board - Current board
    Player - Current Player
    Turn - Current Turn
    Number - Board Number
    Letter - Board Letter
    Direction - Movement direction
    PlayerNudge - Player pieces that will be moved
    OpponentNudge - Opponent pieces that will be moved
*/
checkBoard(_Board,_Player,1,_Number,_Letter,_Direction,_PlayerNudged,_OpponentNudged).

checkBoard(Board,Player,2,Number,Letter,Direction,PlayerNudged,OpponentNudged):-
    move(Board,Player,Number,Letter,Direction,PlayerNudged,OpponentNudged,NewBoard),!,
    \+lastBoard(NewBoard).



/*
    validMoveAux(+Board,+Player,+Turn,+Number,+Letter,+Direction,+PlayerNudged,+OpponentNudged)
    Checks if a move is valid given a board, a player, a position and a direction.
    Board - Current board
    Player - Current Player
    Turn - Current Turn
    Number - Board Number
    Letter - Board Letter
    Direction - Movement direction
    PlayerNudge - Player pieces that will be moved
    OpponentNudge - Opponent pieces that will be moved
*/

validMoveAux(Board,Player,Turn,Number,Letter,Direction,PlayerNudged,OpponentNudged):-
    numero(Number),
    letter(Letter),
    validMove(Board,Player,Number,Letter,Direction,PlayerNudged,OpponentNudged),
    checkBoard(Board,Player,Turn,Number,Letter,Direction,PlayerNudged,OpponentNudged).



/*
    getMoveAux(+Board,+Player,+Turn,-Number,-Letter,-Direction,-PlayerNudged,-OpponentNudged)
    Get a valid Movement(Number,Letter Direction,PlayerNudge,OpponentNudge)
    Board - Current board
    Player - Current Player
    Turn - Current Turn
    Number - Board Number
    Letter - Board Letter
    Direction - Movement direction
    PlayerNudge - Player pieces that will be moved
    OpponentNudge - Opponent pieces that will be moved
*/

getMoveAux(Board,Player,Turn,Number,Letter,Direction,PlayerNudged,OpponentNudged):-
    getMoveParam(Board,Player,Number,Letter,Direction),
    validMoveAux(Board,Player,Turn,Number,Letter,Direction,PlayerNudged,OpponentNudged).


getMoveAux(Board,Player,Turn,Number,Letter,Direction,PlayerNudged,OpponentNudged):-
    write('Invalid move, do another one.\n'),
    getMoveAux(Board,Player,Turn,Number,Letter,Direction,PlayerNudged,OpponentNudged).

/*
    getMove(+Board,+Player,+Turn,-Number,-Letter,-Direction,-PlayerNudged,-OpponentNudged).
    Get move from Player. If player mode is 0 it means is human and will ask for input of the movement, 
    otherwise if will be a computer playing. In this case is mode is 1 the result will be a random movement from the valid ones, 
    if the mode is 2 then it will be the movement that will give the best movement for the given board in that moment,
    if the mode is 3 then it will be performed a minimax with depth 3 that will result in the best movement that will take into account 3 turns.
    Board - Current board
    Player - Current Player
    Turn - Current Turn
    Number - Board Number
    Letter - Board Letter
    Direction - Movement direction
    PlayerNudge - Player pieces that will be moved
    OpponentNudge - Opponent pieces that will be moved
*/

getMove(Board,Player,Turn,Number,Letter,Direction,PlayerNudged,OpponentNudged):-
    player(Player,Mode), %HUMAN
    Mode == 0,
    getMoveAux(Board,Player,Turn,Number,Letter,Direction,PlayerNudged,OpponentNudged).

getMove(Board,Player,Turn,Number,Letter,Direction,PlayerNudged,OpponentNudged):- %AI
    player(Player,Mode),
    choose_move(Board,Player,Turn,[Number,Letter,Direction,PlayerNudged,OpponentNudged],Mode).

/*
    choose_move(+Board,+Player,+Turn,-Move,+Mode)
    Choose move for the computer given a mode.
    If player mode is 0 it means is human and will ask for input of the movement, 
    otherwise if will be a computer playing. In this case is mode is 1 the result will be a random movement from the valid ones, 
    if the mode is 2 then it will be the movement that will give the best movement for the given board in that moment,
    if the mode is 3 then it will be performed a minimax with depth 3 that will result in the best movement that will take into account 3 turns.
    Board - Current board
    Player - Current Player
    Turn - Current Turn
    Move - Movement that will be played
    Mode - Mode of the current player
*/

choose_move(Board,Player,Turn,Move,1):-
    valid_moves(Board,Player,Turn,ListOfMoves),
    length(ListOfMoves,Length),
    random(1,Length,R),
    nth_membro(R,ListOfMoves,Move).

choose_move(Board,Player,Turn,Move,2):-
    evaluate_and_choose(Board,Player,Turn,1,Move).


choose_move(Board,Player,Turn,Move,3):-
    evaluate_and_choose(Board,Player,Turn,3,Move).


/*
    evaluate_and_choose(+Board,+Player,+Turn,+Depth,-BestMove)
    Apply minimax with the Depth passed by argument and will return the best move according to minimax and the evaluate function
    Board - Current board
    Player - Current Player
    Turn - Current Turn
    Depth - Depth of the minimax
    BestMode - Movement that will be played

*/
evaluate_and_choose(Board,Player,Turn,Depth,BestMove):-
    miniMax(Board,Player,Turn,Depth,BestMove).


/*
    saveMove(+Turn,+Board)
    Save the current movement to avoid redundant plays, so that the second turn can be the reverse of the first.
    So if the turn is 1, it will save the board, if the turn is 2 it will retract the board.
    Turn - current Turn
    Board - Board to be saved
*/

saveMove(2,_Board):-
    retract(lastBoard(_B)).

saveMove(1,Board):-
    asserta(lastBoard(Board)).

/*
    gameOver(+Board,+Player)
    Checks whether a players wins or not, it will win if the opponents number of pieces is less then 3
    Board - Current Board
    Player - Player to check victory
*/

gameOver(Board,Player):-
    nextPlayer(Player,Next),
    count2(Board,Next,R),!,
    R<3.


/*
    play_loop(+Board,+Player,+Turn)
    This will be the main loop of the game, it will be responsible for checking if a game is over, to ask for a move and make that move on the board 
    and repeat the loop, changing the turn and the player if needed.
    Board - Current Board
    Player - Current Player
    Turn - Current Turn

*/

play_loop(Board,Player,_) :-
    gameOver(Board,Player),!,
    display_board(Board,Player),nl,
    annouce(Player).

play_loop(Board,Player , Turn):-
    Turn>2,
    nextPlayer(Player,Next),
    play_loop(Board,Next,1).


play_loop(Board,Player , Turn):-
    display_board(Board,Player,Turn),!,nl,
    getMove(Board,Player,Turn,Number,Letter,Direction,PlayerNudged,OpponentNudged),
    move(Board,Player,[Number,Letter,Direction,PlayerNudged,OpponentNudged],NewBoard),
    saveMove(Turn,Board),
    NextTurn is Turn + 1,
    play_loop(NewBoard,Player,NextTurn).

play_loop(Board,Player , Turn):-
    write('Erro'),nl,
    play_loop(Board,Player , Turn).


/*
    nudge(+Board,+Player,+Number,+Letter,+Incx,+Incy,+Cr,+OpponentNudged,-NewBoard)
    This will return a new board after have moved the opponent pieces that would be nudged by the current play
    The pieces are replaced by the OpponentNudged value ahead in the direction of movement, avoid superfulous calculations and movement of the pieces
    Board - Current Board after the player pieces have been moved
    Player - Current Player
    Number - Board Number
    Letter - Board Letter
    Incx - Increment on the cols for the given movement
    Incy - Increment on the rows for the given movement
    Cr - Caracter returned after the replace of the players pieces, if it is a 0 then there is no need to apply this because no opponent piece will be nudged
    OpponentNudged - number of opponnent pieces that will be nudged
    NewBoard - New board that will result of the movement, final turn board
*/

nudge(_Board , _Player , _Number , _Letter , _Incx, _Incy,0,_OpponentNudged,_Board).

nudge(Board,Player,Number,Letter,Incx,Incy,Cr,OpponentNudged,NewBoard):-
    nextPlayer(Player,NextPlayer),!,
    Cr == NextPlayer,
    Nt is Number + Incx,
    Lt is Letter + Incy,
    Ntt is Nt + (OpponentNudged-1) * Incx,
    Ltt is Lt + (OpponentNudged-1) * Incy, 
    replace2(Ltt,Ntt,_Crr,NextPlayer,Board,NewBoard).

/*
    move(+Board,+Player,[+Number,+Letter,+Direction,+PlayerNudged,+OpponentNudged],-NewBoard):-
    Parse the movement passed as argument so that a move can be made and call tha actual move function
    Board - Current Board 
    Player - Current Player
    Number - Board Number
    Letter - Board Letter
    Direction - Direction of the movement
    PlayerNudged - number of player pieces that will be nudged
    OpponentNudged - number of opponnent pieces that will be nudged
    NewBoard - New board that will result of the movement, final turn board
*/

move(Board,Player,[Number,Letter,Direction,PlayerNudged,OpponentNudged],NewBoard):-
    move(Board,Player,Number,Letter,Direction,PlayerNudged,OpponentNudged,NewBoard).

/*
    move(+Board,+Player,+Number,+Letter,+Direction,+PlayerNudged,+OpponentNudged,-NewBoard):-
    Move the player pieces on the board, puting a blanck space on the origin position,
    replacing the piece ahead of the linked player pieces in the direction of the movement, like a leap,
    and nudging the opponent pieces if needed.
    Return the resulting board. 
    Board - Current Board 
    Player - Current Player
    Number - Board Number
    Letter - Board Letter
    Direction - Direction of the movement
    PlayerNudged - number of player pieces that will be nudged
    OpponentNudged - number of opponnent pieces that will be nudged
    NewBoard - New board that will result of the movement, final turn board
*/
move(Board,Player,Number,Letter,Direction,PlayerNudged,OpponentNudged,NewBoard):-
    inc(Direction,Incx,Incy),
    replace2(Letter,Number,_Crt,0,Board,Bt),
    Nt is Number + PlayerNudged * Incx,
    Lt is Letter + PlayerNudged * Incy,
    replace2(Lt,Nt,Cr,Player,Bt,Btt),
    nudge(Btt,Player,Nt,Lt,Incx,Incy,Cr,OpponentNudged,NewBoard).








validDirection('w').
validDirection('s').
validDirection('a').
validDirection('d').
/*
    getNumber(-Number)
    Get a valid number on the board, a valid col
    Number - Number on the board
*/

getNumber(Number):-
    write('Number: '),
    get_char(Ct),
    read_line(_),
    char_code(Ct,Ctt),
    Number is Ctt - 48,
    Number>0,
    Number<6,
    integer(Number),
    nl.
getNumber(Number):-
    write('Invalid number!\n'),
    getNumber(Number).

/*
    validLetter(+Char,-Letter)
    Checks if a char is a valid letter on the board and passes it to a number from 1 to 5
    Char - Caracter be checked
    Letter - Row on the board 
*/

validLetter(Char,Letter):-
    Char>=65,
    Char<70,
    Letter is 6 - (Char - 65 +1).
validLetter(Char,Letter):-
    Char>=97,
    Char<102,
    Letter is 6 - (Char - 97 +1).

/*
    getLetter(-Letter)
    Get a valid letter on the board, a valid row
    Letter - Letter on the board
*/


getLetter(Letter):-
    write('Letter: '),
    get_char(Char),
    read_line(_),
    nl,
    char_code(Char,Aux),
    validLetter(Aux,Letter).

getLetter(Letter):-
    write('Invalid letter!\n'),
    getLetter(Letter).

/*
    validPositionPlayer(+Board,+Player,+Number,+Letter)
    Checks if a player has a peice on that position on the board
    Board - Current board
    Player - Player piece to be checked 
    Number - Col on the board
    Letter - Row on the board 
*/

validPositionPlayer(Board,Player,Number,Letter):-
    !,nth_membro2(Letter,Number,Board,Player).

/*
    getPositionParam(-Number,-Letter)
    Get a valid number and letter on the board
    Number - Col on the board
    Letter - Row on the board 
*/

getPositionParam(Number,Letter):-
    getNumber(Number),
    getLetter(Letter),!.

/*
    getPosition(+Board,+Player,-Number,-Letter)
    Get a valid position for Player on the Board 
    Board - Current Board
    Player - player that is playing to get a valid move
    Number - Col on the board
    Letter - Row on the board
*/

getPosition(Board,Player,Number,Letter):-
    getPositionAux(Board,Player,Number,Letter).    


getPositionAux(Board,Player,Number,Letter):-
    getPositionParam(Number,Letter),
    validPositionPlayer(Board,Player,Number,Letter).

getPositionAux(Board,Player,Number,Letter):-
    write('Invalid position for player '),
    write(Player),
    nl,
    getPositionAux(Board,Player,Number,Letter).

/*
    getDirection(-Direction)
    Get a valid direction of the movement
    Direction - Direction of the movement
*/

getDirection(Direction):-
    write('Direction: '),
    get_char(Direction),
    read_line(_),
    nl,
    validDirection(Direction).

getDirection(Direction):-
    write('Invalid direction (w,a,s,d) !\n'),
    getDirection(Direction).

/*
    getMoveParam(+Board,+Player,-Number,-Letter,-Direction)
    Get move parameters, col, row and direction, valid ones, for a possible player move
    Board - Current Board
    Player - player that is playing to get a valid move
    Number - Col on the board
    Letter - Row on the board
    Direction - Direction of the movement
*/

getMoveParam(Board,Player,Number,Letter,Direction):-
    getPosition(Board,Player,Number,Letter),
    getDirection(Direction),!.
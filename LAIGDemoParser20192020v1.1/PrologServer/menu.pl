
/*
    display_nudge
    Display the game title on the console.

*/

display_nudge:-
    write('          _   _ _    _ _____   _____ ______ '),nl,
    write('         | \\ | | |  | |  __ \\ / ____|  ____|'),nl,
    write('         |  \\| | |  | | |  | | |  __| |__   '),nl,
    write('         | . ` | |  | | |  | | | |_ |  __|  '),nl,
    write('         | |\\  | |__| | |__| | |__| | |____ '),nl,
    write('         |_| \\_|\\____/|_____/ \\_____|______|'),nl.

/*
    getMode(-Mode)
    Get a valid mode for the player
    0- Human
    1- Computer Level 1
    2- Computer Level 2
    3- Computer Level 3
    Mode - Game mode for a player
*/

getMode(Mode):-
    get_char(Opt),
    read_line(_),
    nl,
    char_code(Opt,Aux),
    Mode is Aux - 48,
    Mode > -1,
    Mode<4,
    integer(Mode),nl.

getMode(Mode):-
    write('Invalid Option.'),nl,
    getMode(Mode).

/*
    getPlayer(-Mode)
    Get a mode for a player with a display on the console specifiying tha available modes
    Mode - Game mode for a player
*/

getPlayer(Mode):-
    write('                 0- Human'),nl,
    write('                 1- Computer Level 1'),nl,
    write('                 2- Computer Level 2'),nl,
    write('                 3- Computer Level 3'),nl,
    getMode(Mode).

/*
    getPBoard(-Board)
    Get a playable and valid board 
    Board - Option representig tha board that will be played 
*/

getPBoard(Board):-
    get_char(Opt),
    read_line(_),
    nl,
    char_code(Opt,Aux),
    Board is Aux - 48,
    Board > 0,
    Board<5,
    integer(Board),nl.

getPBoard(Board):-
    write('Invalid Option.'),nl,
    getPBoard(Board).

/*
    getBoard(-Board)
    Get the board that will be played with a display on the console with the available options
    Board - Option representig tha board that will be played 
*/

getBoard(Board):-
    write('                 1- Board 1'),nl,
    write('                 2- Board 2'),nl,
    write('                 3- Board 3'),nl,
    write('                 4- Board 4'),nl,
    getPBoard(Board).

/*
    menu
    Main function of the menu that will be resposible for choosing each player mode and a board and will start the game
*/

menu:-
    display_nudge,nl,nl,
    write('                     Let\'s play'),nl,nl,
    write('         Choose player 1:'),nl,
    getPlayer(Mode1),nl,    
    write('         Choose player 2:'),nl,
    getPlayer(Mode2),
    asserta(player(1,Mode1)),
    asserta(player(2,Mode2)),
    getBoard(B),
    board(B,Board),
    playerChar(1,C1),
    playerChar(2,C2),
    write('Player 1 : '),write(C1),nl,
    write('Player 2 : '),write(C2),nl,nl,nl,
    play_loop(Board,1,1).

                                    
                                    
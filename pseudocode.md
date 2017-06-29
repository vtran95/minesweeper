# Minesweeper Pseudocode

1) Initialize states (randomize bombs and place numbers accordingly)
2) Add event listener to the table (make boxes clickable)
3) Render (display game board)
4) Start a timer keeping track of duration of game
5) When user clicks:
    - check win:
        - if last *__not__* bomb cell -> win
    - if *__not__* bomb *__and__* no bombs around:
        - clear box and other empty boxes in contact with no numbers and bombs, also reveal numbers in contact with empty boxes
    - if *__not__* bomb *__and__* bombs around:
        - display number of bombs around box
    - if *__not__* bomb and *__no__* bombs around:
        - reveal empty box and surrounding empty boxes
    - if bomb:
        - reveal bombs, game over
    - if right-click:
        - display flag
    - if reset:
        - intialize and render

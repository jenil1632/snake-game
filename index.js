let snake;
let headDirection;
let foodCell;
let highscore = 0;
let score;

$(document).ready(function() {
    $("#highscore").html(highscore);
    setBoard();

    play();

    $("#play").click(function() {
        play();
      });

    $(document).on("keydown", (e)=> {
        if (e.keyCode == '37' && headDirection != 1) { // left
            headDirection = -1;
        }
        else if (e.keyCode == '38' && headDirection != -2) { // up
            headDirection = 2;
        }
        else if (e.keyCode == '39' && headDirection != -1) { // right
            headDirection = 1;
        }
        else if (e.keyCode == '40' && headDirection != 2) { // down
            headDirection = -2;
        }
    });



});

function generateNewFood() {
    while(true) {
        let x = Math.floor(Math.random() * 20)+1;
        let y = Math.floor(Math.random() * 20)+1;
        let unique = !isSnakeOverlapped(x, y);
        if (unique) {
            foodCell[0] = x;
            foodCell[1] = y;
            $(`#cell-${foodCell[0]}-${foodCell[1]}`).removeClass('cell').addClass('food');
            break;
        }
    }
}

function isInBounds(x, y) {
    return x > 0 && x <= 20 && y > 0 && y <= 20;
}

function getNextHeadCell() {
    if (headDirection == 1) {
        return [snake[0][0], snake[0][1]+1];
    }
    else if (headDirection == 2) {
        return [snake[0][0]-1, snake[0][1]];
    }
    else if (headDirection == -1) {
        return [snake[0][0], snake[0][1]-1];
    }
    else {
        return [snake[0][0]+1, snake[0][1]];
    }
}

function isSnakeOverlapped(x, y) {
    for (let cell of snake) {
        if (cell[0]===x && cell[1]===y) {
            return true;
        }
    }
    return false;
}

function setBoard() {
    init();
    let htmlFragment = '';
    for (let i=1; i<=20; i++) {
        htmlFragment += '<div class="row">'
        for (let j=1; j<=20; j++) {
            htmlFragment += `<div class="cell" id="cell-${i}-${j}"></div>`;
        }
        htmlFragment += '</div>';
    }
    $("#board").html(htmlFragment);

    $.each( snake, function( i, cell ) {     
        $(`#cell-${cell[0]}-${cell[1]}`).removeClass('cell').addClass('snake');
    });

    $(`#cell-${foodCell[0]}-${foodCell[1]}`).removeClass('cell').addClass('food');
    $("#score").html(score);
}

function init() {
    snake = [[15, 10], [15, 9], [15, 8]];
    headDirection = 1;
    foodCell = [15, 18];
    score = 0;
}

function play() {
    init();
    $("#play").prop("disabled", true);
    let game = setInterval(function() {
        let snakeHead = snake[0];
        let snakeTail = snake[snake.length-1];
        let newHead = getNextHeadCell();

        // out of bounds check
        if (!isInBounds(newHead[0], newHead[1]) || isSnakeOverlapped(newHead[0], newHead[1])) {
            clearTimeout(game);
            if (score > highscore) {
                highscore = score;
                $("#highscore").html(highscore);
                $("#play").prop("disabled", false);
            }
            alert("Game over!");
            setBoard();
        }


        snake.unshift(newHead);
        if (foodCell[0]===snake[0][0] && foodCell[1]===snake[0][1]) {
            $(`#cell-${foodCell[0]}-${foodCell[1]}`).removeClass('food').addClass('snake');
            score++;
            $("#score").html(score);
            generateNewFood();
        }
        else {
            snake.pop();
        $(`#cell-${snake[0][0]}-${snake[0][1]}`).removeClass('cell').addClass('snake');
        $(`#cell-${snakeTail[0]}-${snakeTail[1]}`).removeClass('snake').addClass('cell');
        }

    }, 200);
}


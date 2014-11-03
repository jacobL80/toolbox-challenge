"use strict";

var tiles = [];
var idx;
for (idx = 1; idx <= 32; ++idx) {
    tiles.push({
        tileNum: idx,
        src: 'img/tile' + idx + '.jpg',
        flipped: false,
        match: false
    });
}

var timer;
var elapsedSeconds = 0;
var remainCount = 8;
var turnCount = 0;
var correctCount = 0;

$(document).ready(function() {
    runGame();
}); // jQuery ready function


function runGame() {
    var startTime = _.now();
    timer = window.setInterval(function() {
        elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
        $('#elapsed-seconds').text("Time: " + elapsedSeconds);
        $('#remain-count').text("Matches Remaining: " + remainCount);
        $('#correct-count').text("Matches Found: " + correctCount);
        $('#turn-count').text("Turns Taken: " + turnCount);
    }, 100);

    console.log(tiles);
    var shuffledTiles = _.shuffle(tiles);
    console.log(shuffledTiles);

    var selectedTiles = shuffledTiles.slice(0, 8);
    console.log(selectedTiles);

    var tilePairs = [];
    _.forEach(selectedTiles, function(tile) {
        tilePairs.push(_.clone(tile));
        tilePairs.push(_.clone(tile));
    });
    tilePairs = _.shuffle(tilePairs);
    console.log(tilePairs);

    var tileBack = 'img/tile-back.png'
    var gameBoard = $('#game-board');
    $('#game-board').empty();
    var row = $(document.createElement('div'));
    var img;
    _.forEach(tilePairs, function(tile, elemIndex) {
        if (elemIndex > 0 && !(elemIndex % 4)) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }

        img = $(document.createElement('img'));
        img.attr({
            src: tileBack,
            alt: 'image of tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);


    var clickCount = 0;
    var lastTile;
    var lastImage;
    var stop = null;
    $('#game-board img').click(function() {
        if (stop != null) {
            if(!lastImage.flipped) {
                window.setTimeout(function() {
                    clearTimeout(timeOut);
                    timeOut = null;
                }, 1000);
            }
            return;
        }

        var img = $(this);
        var tile = img.data('tile');
        if (tile.flipped) {
            return;
        }
        clickCount++;

        if (clickCount % 2 == 0) {
            turnCount++;
            clickCount = 0;
            flipTile(tile, img);
            console.log(this.alt);
            if(tile.tileNum == lastTile.tileNum) {
                correctCount++;
                remainCount--;
            } else {
                stop = window.setTimeout(function() {
                    flipTile(tile, img);
                    flipTile(lastTile, lastImage);
                    stop = null;
                }, 1000);
            }
        } else {
            console.log(this.alt);
            lastImage = $(this);
            lastTile = lastImage.data('tile');
            flipTile(lastTile, lastImage);
        }
        if(correctCount == 8) {
            var win = Math.floor(elapsedSeconds);
            clearInterval(timer);
            clearInterval(stop);
            if (window.confirm("Congratulations! You won in " + win + " seconds! Would you like to play again?")) {
               runGame();
            }
            //$('#game-board').text("Congratulations! You won in " + win + " seconds!");
        }
    }); // on click of gameboard images

    $('#playAgain').click(function() {
        clearInterval(timer);
        clearInterval(stop);
        elapsedSeconds = 0;
        startTime = _.now();
        correctCount = 0;
        turnCount = 0;
        remainCount = 8;
        runGame();
    });

    $('#howTo').click(function() {
        alert("Click on boxes to reveal their image! Try to match all pairs, but if you pick two non-matching boxes, their contents will be re-hidden! Can you remember where everything is?");
    });
}

function flipTile(tile, img) {
    img.fadeOut(100, function() {
        if (tile.flipped) {
            img.attr('src', 'img/tile-back.png');
        } else {
            img.attr('src', tile.src);
        }
        tile.flipped = !tile.flipped;
        img.fadeIn(100);
    });   
}
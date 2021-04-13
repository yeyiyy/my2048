function showNumberWithAnimation(x, y, randNumber){

    let numberCell = $('#number-cell-'+ x+ '-' + y);
    
    numberCell.css('background-color',getNumberBackgroundColor(randNumber));
    numberCell.css('color',getNumberColor(randNumber));
    numberCell.text(randNumber);

    numberCell.animate({
        "width" : cellSideLength,
        "height" : cellSideLength,
        "top" : getPosTop(x),
        "left" : getPosLeft(y)
    },100);
}


function showMoveAnimation(fromx, fromy, tox, toy){
    $('#number-cell-' + fromx + '-' + fromy).animate({
        'top' : getPosTop(tox),
        'left' : getPosLeft(toy)
    },100);
}

function updataScoreAnimation(score){
    $('#score').text(score);
}
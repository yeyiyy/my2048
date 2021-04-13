//游戏数据与游戏得分
var board = new Array();                    //利用二维数组存储每一个小格子的值
var score = 0;
var hasConflicted = new Array();

//捕捉触控坐标
var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;

$(document).ready(function () {
    if(documentWidth < 500){
        prepareForMobile();
    }
    else{
        gridContainerWidth = 500;
        cellSideLength = 100;
        cellSpace = 20;
    }
    newgame();
});

function prepareForMobile(){
    $('#grid-container').css('width', gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height', gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius', 0.02 * gridContainerWidth);

    $('.grid-cell').css('width', cellSideLength);
    $('.grid-cell').css('height', cellSideLength);
    $('.grid-cell').css('border-radius', 0.02 * cellSideLength);
}

function newgame(){
    //初始化棋盘格
    init();
    
    //初始化完成后在随机两个格子生成数字开始游戏
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for(let i = 0 ; i < 4 ; i++){
        for(let j = 0 ; j < 4 ; j++){

            let gridCell = $('#grid-cell-' + i + '-' + j);          //利用jq选择器获取每一个小格子
            gridCell.css("top", getPosTop(i));                   //getPosTop()函数获取小格子距离顶部距离
            gridCell.css("left", getPosLeft(j));                 //getPosLeft()函数获取小格子距离左边距离
        }
    }

    for(let i = 0 ; i < 4 ; i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for(let j = 0 ; j < 4 ; j++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    score = 0;
    updataBoardView();

}

function updataBoardView(){                                  //根据board值更新显示值number-cell
    
    $(".number-cell").remove();                               //如果当前有number-cell值则删掉，再添加新的值
    for(let i = 0 ; i < 4 ; i++){
        for(let j = 0 ; j < 4 ; j++){
            $("#grid-container").append("<div class = 'number-cell' id = 'number-cell-"+i+"-"+j+"'></div>");        //利用number-cell覆盖grid-cell从而显示值
            let theNumberCell = $('#number-cell-' + i + '-' + j);

            if(board[i][j] === 0){
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top', getPosTop(i) + cellSideLength/2);
                theNumberCell.css('left', getPosLeft(j) + cellSideLength/2);
            }
            else{
                theNumberCell.css('width', cellSideLength);
                theNumberCell.css('height', cellSideLength);
                theNumberCell.css('top', getPosTop(i));
                theNumberCell.css('left', getPosLeft(j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            
            hasConflicted[i][j] = false;
        }
    }
    $('.number-cell').css('line-height', cellSideLength + 'px');
    $('.number-cell').css('font-size', 0.6 * cellSideLength + 'px');
}

function generateOneNumber(){
    
    if(nospace( board ))            //判断还能否生成数字
        return false;
    
    //随机生成一个位置
    /*
    方法1
    let randx = parseInt(Math.floor(Math.random()*4));
    let randy = parseInt(Math.floor(Math.random()*4));

    while(true){
        if(board[randx][randy] === 0)
            break;
        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));
    }
    */
    //方法2
    let temp = [];
    let randx, randy;
    for(let i = 0 ; i < 4 ; i++){
        for(let j = 0 ; j < 4 ; j++){
            if(board[i][j] === 0){
                temp.push(i+','+j);
            }
        }
    }
    let randN = parseInt(Math.floor(Math.random() * temp.length));
    randx = parseInt(temp[randN].split(',')[0]);
    randy = parseInt(temp[randN].split(',')[1]);

    //随机生成一个数字（2/4）
    let randNumber = Math.random() < 0.9 ? 2:4;

    //在生成的位置显示生成的数字
    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx, randy, randNumber);

    return true;
}


$(document).keydown(function(e){                    //玩家事件响应

    switch(e.keyCode){
        case 37:                                    //玩家按下左键————left
            e.preventDefault();                             //阻止滚动条滚动
            if(moveLeft()){
                setTimeout('generateOneNumber()',110);
                setTimeout('isGameOver()',200);
            }
            break;
        
        case 38:                                    //玩家按下上键————up
            e.preventDefault(); 
            if(moveUp()){
                setTimeout('generateOneNumber()',110);
                setTimeout('isGameOver()',200);
            }
            break;
            
        case 39:                                    //玩家按下右键————right
            e.preventDefault(); 
            if(moveRight()){
                setTimeout('generateOneNumber()',110);
                setTimeout('isGameOver()',200);
            }
            break;
        
        case 40:                                    //玩家按下下键————down
            e.preventDefault(); 
            if(moveDown()){
                setTimeout('generateOneNumber()',110);
                setTimeout('isGameOver()',200);
            }
            break;
        default:
            break;
    }
})

//触控滑动
document.addEventListener('touchstart', function(e){
    startx = e.touches[0].pageX;
    starty = e.touches[0].pageY;
});

document.addEventListener('touchend', function(e){
    endx = e.changedTouches[0].pageX;
    endy = e.changedTouches[0].pageY;

    let deltax = endx - startx;
    let deltay = endy - starty;

    let container_strY = $('#grid-container').offset().top; //判断开始触控的地方是否在棋盘格内，若是则才能移动
    let container_endY = container_strY + gridContainerWidth;
    if(container_strY > starty || container_endY < starty){
        return;
    }                                

    if(Math.abs(deltax) - Math.abs(deltay) >= 0){
        if(Math.abs(deltax) < 0.15 * documentWidth){
            return;
        }
        if(deltax > 0){
            //moveRight
            if(moveRight()){
                setTimeout('generateOneNumber()',110);
                setTimeout('isGameOver()',200);
            }
        }
        else{
            //moveLeft
            if(moveLeft()){
                setTimeout('generateOneNumber()',110);
                setTimeout('isGameOver()',200);
            }
        }
    }
    else{
        if(Math.abs(deltay) < 0.15 * documentWidth){
            return;
        }
        if(deltay > 0){
            //moveDown
            if(moveDown()){
                setTimeout('generateOneNumber()',110);
                setTimeout('isGameOver()',200);
            }
        }
        else{
            //moveUp
            if(moveUp()){
                setTimeout('generateOneNumber()',110);
                setTimeout('isGameOver()',200);
            }
        }
    }
});

function moveLeft(){

    if(!canMoveLeft(board))                         //先整体判断能否向左移动
        return false;

    //判断可以向左移动后开始移动
    for(let i = 0 ; i < 4 ; i++){
        for(let j = 1 ; j < 4 ; j++){
            if(board[i][j] !== 0){                  //如果当前位置有显示数字，则其可能能够向左移动
                for(let k = 0 ; k < j ; k++){       //判断向左移动的两种情况：左边有空位/有相同数字
                    if(board[i][k] === 0 && noBlockHorizonal(i, k, j, board)){
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                    }
                    else if(board[i][k] === board[i][j] && noBlockHorizonal(i, k, j, board) && !hasConflicted[i][k]){
                        showMoveAnimation(i, j, i ,k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //合并时得分
                        score += board[i][k];
                        updataScoreAnimation(score);

                        hasConflicted[i][k] = true;
                    }
                }
            }
        }
    }
    setTimeout("updataBoardView()", 100);
    return true;
}

function moveUp(){

    if(!canMoveUp(board))
        return false;
    
    for(let i = 1 ; i < 4 ; i++){
        for(let j = 0 ; j < 4 ; j++){
            if(board[i][j] !== 0){
                for(let k = 0 ; k < i ; k++){
                    if(board[k][j] === 0 && noBlockVertical(k, i, j, board)){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                    }
                    if(board[k][j] === board[i][j] && noBlockVertical(k, i, j, board) && !hasConflicted[k][j]){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        
                        score += board[k][j];
                        updataScoreAnimation(score);

                        hasConflicted[k][j] = true;
                    }
                }
            }
        }
    }
    setTimeout('updataBoardView()',100);
    return true;
}

function moveRight(){

    if(!canMoveRight(board))
        return false;
    
    for(let i = 0 ; i < 4 ; i++){
        for(let j = 2 ; j >= 0 ; j--){
            if(board[i][j] !== 0){
                for(let k = 3 ; k > j ; k--){ 
                    if(board[i][k] === 0 && noBlockHorizonal(i, j, k, board)){
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                    }
                    else if(board[i][k] === board[i][j] && noBlockHorizonal(i, j, k, board) && !hasConflicted[i][k]){
                        showMoveAnimation(i, j, i ,k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;

                        score += board[i][k];
                        updataScoreAnimation(score);

                        hasConflicted[i][k] = true;
                    }
                }
            }
        }
    }
    setTimeout("updataBoardView()", 100);
    return true;
    return true;
}

function moveDown(){

    if(!canMoveDown(board))
        return false;
    
    for(let i = 2 ; i >= 0 ; i--){
        for(let j = 0 ; j < 4 ; j++){
            if(board[i][j] !== 0){
                for(let k = 3 ; k > i ; k--){
                    if(board[k][j] === 0 && noBlockVertical(i, k, j, board)){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                    }
                    if(board[k][j] === board[i][j] && noBlockVertical(i, k, j, board) && !hasConflicted[k][j]){
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;

                        score += board[k][j];
                        updataScoreAnimation(score);

                        hasConflicted[k][j] = true;
                    }
                }
            }
        }
    }
    setTimeout('updataBoardView()',100);    
    return true;
}

function isGameOver(){
    if(nospace(board) && nomove(board)){
        gameover();
    }
}

function gameover(){
    alert('GameOver!');
}
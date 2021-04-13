//底层逻辑函数

//多媒体参数
documentWidth = window.screen.availWidth;
gridContainerWidth = 0.92 * documentWidth;
cellSideLength = 0.18 * documentWidth;
cellSpace = 0.04 * documentWidth;

//获取移动到的位置
function getPosTop(i){
    return cellSpace + i * (cellSideLength + cellSpace);
}

function getPosLeft(j){
    return cellSpace + j * (cellSideLength + cellSpace);
}

function getNumberBackgroundColor( number ){
    switch( number ){
        case 2:return "#eee4da"; break;
        case 4:return "#ede0c8"; break;
        case 8:return "#f2b179"; break;
        case 16:return "#f59563"; break;
        case 32:return "#f67c5f"; break;
        case 64:return "#f65e3b"; break;
        case 128:return "#edcf72"; break;
        case 256:return "#edcc61"; break;
        case 512:return "#9c0"; break;
        case 1024:return "#33b5e5"; break;
        case 2048:return "#09c"; break;
        case 4096:return "#a6c"; break;
        case 8192:return "#93c"; break;
    }
}

//随机显示数字生成
function getNumberColor( number ){
    if( number <= 4)
        return "776a65";
    
    return "white";
}

//判断是否没有移动空间
function nospace(board){
    for(let i = 0 ; i < 4 ; i++){
        for(let j = 0 ; j < 4 ; j++){
            if(board[i][j] === 0 )
                return false;
        }
    }
    return true;
}

//判断能否移动
function canMoveLeft(board){
    for(let i = 0 ; i < 4 ; i++){
        for(let j = 1 ; j < 4 ; j++){
            if(board[i][j] !== 0){
                if(board[i][j-1] === 0 || board[i][j-1] === board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveUp(board){
    for(let i = 1 ; i < 4 ; i++){
        for(let j = 0 ; j < 4 ; j++){
            if(board[i][j] !== 0){
                if(board[i-1][j] === 0 || board[i-1][j] === board[i][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight(board){
    for(let i = 0 ; i < 4 ; i++){
        for(let j = 2 ; j >= 0 ; j--){
            if(board[i][j] !== 0){
                if(board[i][j+1] === 0 || board[i][j] === board[i][j+1]){
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown(board){
    for(let i = 2 ; i >= 0 ; i--){
        for(let j = 0 ; j < 4 ; j++){
            if(board[i][j] !== 0){
                if(board[i+1][j] === 0 || board[i][j] === board[i+1][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function nomove(board){
    if(canMoveLeft(board) || canMoveUp(board) || canMoveRight(board) || canMoveDown(board)){
        return false;
    }
    return true;
}

//判断移动时有无障碍物
function noBlockHorizonal(row, colstr, colend, board){
    for(j = colstr + 1 ; j < colend ; j++){
        if(board[row][j] !== 0){
            return false;
        }
    }
    return true;
}

function noBlockVertical(rowstr, rowend, col, board){
    for(i = rowstr+1 ; i < rowend ; i++){
        if(board[i][col] !== 0){
            return false;
        }
    }
    return true;
}
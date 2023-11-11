let domboard = document.querySelectorAll('#entry');
let resetbutton = document.querySelector('.reset');
let line = document.querySelector('#line');
let dline = document.querySelector('#dline');
let linecontainer = document.querySelector('#linecontainer');
let dlinecontainer = document.querySelector('#dlinecontainer');
let announcer = document.querySelector('#announcer');
let finalist = document.querySelector('#finalist');
let result = document.querySelector('#result');
let aiswitch = document.querySelector('#ai-switch');
let tesboards = document.querySelector('.test-boards');
let testentries = document.querySelectorAll('.test-entry');

announcer.addEventListener('click', resetgame);
resetbutton.addEventListener('click', resetgame);
aiswitch.addEventListener('click', aicontroler);

domboard.forEach((entry, i) => {
    entry.addEventListener('click', function(){play(i);});
});

const gameboard = (function(){
    let symbols = ['\u{00d7}', '\u{25cb}'];
    let valid = true;
    let board = ['', '', '',
                 '', '', '',
                 '', '', ''];
    let lastsymbol = '';
    let lastentry = '';

    const mark = (i, s, entrytype) => {
        if(board[i] == ''){
            board[i] = entrytype;
            domboard[i].classList.add(entrytype + 'entry');
            lastsymbol = s;
            lastentry = entrytype;
        }
        updatedisplay(domboard);
    };

    const updatedisplay = (dboard) => {
        for(let i = 0; i < 9; i++){
            if(board[i] == 'x')
            dboard[i].textContent = symbols[0];
            if(board[i] == 'o')
            dboard[i].textContent = symbols[1];
        }

        if( board[0] != '' &&
            board[0] == board[1] &&
            board[0] == board[2]){
            linecontainer.classList.add('toprow');
            line.classList.add('growline');
            announce();
        }
        else if( board[3] != '' &&
            board[3] == board[4] &&
            board[3] == board[5]){
            linecontainer.classList.add('midrow');
            line.classList.add('growline');
            announce();
        }
        else if( board[6] != '' &&
            board[6] == board[7] &&
            board[6] == board[8]){
            linecontainer.classList.add('bottomrow');
            line.classList.add('growline');
            announce();
        }
        else if( board[0] != '' &&
            board[0] == board[3] &&
            board[0] == board[6]){
            linecontainer.classList.add('leftcol');
            line.classList.add('growline');
            announce();
        }
        else if( board[1] != '' &&
            board[1] == board[4] &&
            board[1] == board[7]){
            linecontainer.classList.add('midcol');
            line.classList.add('growline');
            announce();
        }
        else if( board[2] != '' &&
            board[2] == board[5] &&
            board[2] == board[8]){
            linecontainer.classList.add('rightcol');
            line.classList.add('growline');
            announce();
        }
        else if( board[0] != '' &&
            board[0] == board[4] &&
            board[0] == board[8]){
            dlinecontainer.classList.add('diagonal1');
            dline.classList.add('growline');
            announce();
        }
        else if( board[2] != '' &&
            board[2] == board[4] &&
            board[2] == board[6]){
            dlinecontainer.classList.add('diagonal2');
            dline.classList.add('growline');
            announce();
        }
        else if( board[0] != '' &&
            board[1] != '' &&
            board[2] != '' &&
            board[3] != '' &&
            board[4] != '' &&
            board[5] != '' &&
            board[6] != '' &&
            board[7] != '' &&
            board[8] != '' ){
            announcer.classList.add('announce');
            finalist.textContent = 'draw';
            valid = false;
        }
    }

    const announce = () => {
        valid = false;
        announcer.classList.add('announce');
        finalist.textContent = lastsymbol;
        finalist.classList.add(lastentry + 'entry');
        result.textContent = 'winner';
    }

    const isvalidmove = (i) => {
        return board[i] === '' && valid && (0 <= i && i < 9);
    }

    const reset = () => {
        valid = true;
        board = ['', '', '',
                 '', '', '',
                 '', '', ''];
        domboard.forEach((entry)=> {
            entry.textContent = '';
            entry.removeAttribute('class');
            line.removeAttribute('class');
            linecontainer.removeAttribute('class');
            dline.removeAttribute('class');
            dlinecontainer.removeAttribute('class');
            announcer.removeAttribute('class');
            finalist.removeAttribute('class');
            result.textContent = '';
        });
    }

    const getboard = () => { return board; }

    return {getboard, mark, isvalidmove, reset};
})();

function makeplayer(symbol, type){
    const entrytype = type;
    const playmove = (i) => {
        gameboard.mark(i, symbol, entrytype);
    }
    return {symbol, entrytype, playmove};
}

let players = [makeplayer('\u{00d7}', 'x'), makeplayer('\u{25cb}', 'o')];
let domplayers = document.querySelectorAll('.player');

let gameison = false;
let aiplayer = false;

let currentplayer = 0;

function play(i){
    gameison = true;
    if(gameboard.isvalidmove(i)){
        players[currentplayer].playmove(i);
        if(aiplayer){
            let m = aimove(gameboard.getboard());
            if(gameboard.isvalidmove(m))
                players[1].playmove(m);
            return;
        }
        currentplayer = (currentplayer += 1) % 2;
        document.querySelector('.currentplayer').classList.remove('currentplayer');
        domplayers[currentplayer].classList.add('currentplayer');
    }
}

function resetgame(){
    currentplayer = 0;
    gameison = false;
    document.querySelector('.currentplayer').classList.remove('currentplayer');
    domplayers[currentplayer].classList.add('currentplayer');
    gameboard.reset();
}

function aicontroler(){
    if(gameison) return;
    let c = aiswitch.classList[0];
    aiswitch.classList.remove(c);
    if( c == 'off'){
        aiswitch.classList.add('on');
        aiplayer = true;
    }
    else if(c == 'on'){
        aiswitch.classList.add('off');
        aiplayer = false;
    }
}

let depth = 0;
function aimove(board){
    let empty = [];
    for(let i = 0; i < 9; i++){
        if(board[i] == ''){
            empty.push(i);
        }
    }
    if(empty.length == 8){
        if( board[0] == 'x' || board[2] == 'x' ||
            board[6] == 'x' || board[8] == 'x'){
            return 4;
        }
        if(board[1] == 'x') return 7;
        if(board[3] == 'x') return 5;
        if(board[5] == 'x') return 3;
        if(board[7] == 'x') return 1;
        if(board[4] == 'x'){
            let cs = [0, 2, 6, 8];
            let c = Math.floor(4.0 * Math.random());
            return cs[c];
        }
    }
    for(let i = 0; i < 9; i++){
        if(board[i] == ''){
            let nboard = board.slice();
            nboard[i] = 'o'
            let owin = iswinner('o', nboard);
            if(owin){
                if(depth == 0){
                    return i;
                }
                return 11;
            }
        }
    }
    let l = 0;
    for(let i = 0; i < 9; i++){
        if(board[i] == ''){
            let nboard = board.slice();
            nboard[i] = 'x'
            let xwin = iswinner('x', nboard);
            if(xwin){
                if(depth == 0){
                    return i;
                }
                l += 1;
            }
        }
    }
    if(l > 1){
        return 13;
    }
    else if(l == 1 && empty.length <= 2 || l == 0 && empty.length <= 2){
        if(depth == 0){
            return empty[0];
        }
        return 12;
    }

    /*
    11 guaranteed win
    12 drawable
    13 guaranteed loss
    */

    let ws = board.slice();
    let ls = board.slice();
    let ds = board.slice();
    for(let i = 0; i < 9; i++){
        if(board[i] == ''){
            let nboard = board.slice();
            ws[i] = 0;
            ls[i] = 0;
            ds[i] = 0;
            nboard[i] = 'o'
            for(let j = 0; j < 9; j++){
                if(nboard[j] == ''){
                    let nnboard = nboard.slice();
                    nnboard[j] = 'x';
                    depth += 1;
                    let m = aimove(nnboard);
                    depth -= 1;

                    switch( m ){
                        case 11:{
                            ws[i] += 1;
                        } break;
                        case 12:{
                            ds[i] += 1;
                        } break;
                        case 13:{
                            ls[i] += 1;
                        } break;
                    }
                }
            }
        }
    }
    if(depth > 0){
        for(let i = 0; i < empty.length; i++){
            if(ws[empty[i]] > 0 && ls[empty[i]] == 0){
                return 11;
            }
        }
        let nl = 0;
        for(let i = 0; i < 9; i++) {
            if(typeof(ws[i]) === 'number')
            if(ls[i] == 0){
                nl += 1;
            }
        }
        if(nl == 0){
            return 13;
        }
        for(let i = 0; i < 9; i++) {
            if(typeof(ws[i]) === 'number')
            if(ds[i] > 0 && ls[i] == 0){
                return 12;
            }
        }
        // return 12;
    }

    if(depth == 0){
        for(let i = 0; i < 9; i++) {
            if(typeof(ws[i]) === 'number')
            if(ws[i] > 0 && ls[i] == 0 && ds[i] == 0){
                return i;
            }
        }
        for(let i = 0; i < 9; i++) {
            if(typeof(ws[i]) === 'number')
            if(ws[i] > 0 && ls[i] == 0){
                return i;
            }
        }
        for(let i = 0; i < 9; i++) {
            if(typeof(ws[i]) === 'number')
            if(ds[i] > 0 && ls[i] == 0){
                return i;
            }
        }
    }
    return empty[0];
}

function iswinner(t, board){
    if( board[0] == t && board[0] == board[1] && board[0] == board[2] ||
        board[3] == t && board[3] == board[4] && board[3] == board[5] ||
        board[6] == t && board[6] == board[7] && board[6] == board[8] ||
        board[0] == t && board[0] == board[3] && board[0] == board[6] ||
        board[1] == t && board[1] == board[4] && board[1] == board[7] ||
        board[2] == t && board[2] == board[5] && board[2] == board[8] ||
        board[0] == t && board[0] == board[4] && board[0] == board[8] ||
        board[2] == t && board[2] == board[4] && board[2] == board[6]){
        return true;
    }
    return false;
}
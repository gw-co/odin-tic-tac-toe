let domboard = document.querySelectorAll('#entry');
let resetbutton = document.querySelector('.reset');
let line = document.querySelector('#line');
let dline = document.querySelector('#dline');
let linecontainer = document.querySelector('#linecontainer');
let dlinecontainer = document.querySelector('#dlinecontainer');
let announcer = document.querySelector('#announcer');
let finalist = document.querySelector('#finalist');
let result = document.querySelector('#result');

announcer.addEventListener('click', resetgame);
resetbutton.addEventListener('click', resetgame);

domboard.forEach((entry, i) => {
    entry.addEventListener('click', function(){play(i);});
});

const gameboard = (function(){
    // let symbols = ['\u{00d7}', '\u{25cb}'];
    // let entrytypes = ['xentry', 'oentry'];
    let valid = true;
    let board = ['', '', '',
                 '', '', '',
                 '', '', ''];
    let lastsymbol = '';
    let lastentry = '';

    const mark = (i, s, entrytype) => {
        if(board[i] == ''){
            board[i] = s;
            domboard[i].classList.add(entrytype);
            lastsymbol = s;
            lastentry = entrytype;
        }
        console.log(this);
        updatedisplay(domboard);
    };

    const updatedisplay = (dboard) => {
        for(let i = 0; i < 9; i++){
            dboard[i].textContent = board[i];
            if( board[0] != '' &&
                board[0] == board[1] &&
                board[0] == board[2]){
                linecontainer.classList.add('toprow');
                line.classList.add('growline');
                announce();
            }
            if( board[3] != '' &&
                board[3] == board[4] &&
                board[3] == board[5]){
                linecontainer.classList.add('midrow');
                line.classList.add('growline');
                announce();
            }
            if( board[6] != '' &&
                board[6] == board[7] &&
                board[6] == board[8]){
                linecontainer.classList.add('bottomrow');
                line.classList.add('growline');
                announce();
            }
            if( board[0] != '' &&
                board[0] == board[3] &&
                board[0] == board[6]){
                linecontainer.classList.add('leftcol');
                line.classList.add('growline');
                announce();
            }
            if( board[1] != '' &&
                board[1] == board[4] &&
                board[1] == board[7]){
                linecontainer.classList.add('midcol');
                line.classList.add('growline');
                announce();
            }
            if( board[2] != '' &&
                board[2] == board[5] &&
                board[2] == board[8]){
                linecontainer.classList.add('rightcol');
                line.classList.add('growline');
                announce();
            }
            if( board[0] != '' &&
                board[0] == board[4] &&
                board[0] == board[8]){
                dlinecontainer.classList.add('diagonal1');
                dline.classList.add('growline');
                announce();
            }
            if( board[2] != '' &&
                board[2] == board[4] &&
                board[2] == board[6]){
                dlinecontainer.classList.add('diagonal2');
                dline.classList.add('growline');
                announce();
            }
            if( board[0] != '' &&
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
                }
        }
    }

    const announce = () => {
        valid = false;
        announcer.classList.add('announce');
        finalist.textContent = lastsymbol;
        finalist.classList.add(lastentry);
        result.textContent = 'winner';
    }

    const isvalidmove = (i) => {
        return board[i] === '' && valid;
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

    return {mark, isvalidmove, reset};
})();

function makeplayer(symbol, type){
    const entrytype = type + 'entry';
    const playmove = (i) => {
        console.log(symbol, entrytype);
        gameboard.mark(i, symbol, entrytype);
    }

    return {symbol, entrytype, playmove};
}

let players = [makeplayer('\u{00d7}', 'x'), makeplayer('\u{25cb}', 'o')];
let domplayers = document.querySelectorAll('.player');

let currentplayer = 0;

function play(i){
    if(gameboard.isvalidmove(i)){
        players[currentplayer].playmove(i);
        currentplayer = (currentplayer += 1) % 2;
        document.querySelector('.currentplayer').classList.remove('currentplayer');
        domplayers[currentplayer].classList.add('currentplayer');
    }
}

function resetgame(){
    currentplayer = 0;
    document.querySelector('.currentplayer').classList.remove('currentplayer');
    domplayers[currentplayer].classList.add('currentplayer');
    gameboard.reset();
}

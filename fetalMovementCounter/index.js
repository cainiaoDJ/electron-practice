const btn = document.getElementById("btn_add");
let COUNT_DOWN = 3600000;
let startTime
const COUNT_GAP = 300000;
let cnt = 0;
let totalCnt = 0;
let lastUpdateTime = 0;
let timerId


const { ipcRenderer } = require("electron")
document.getElementById("btn_debug").onclick = () => {
    ipcRenderer.send('render-msg', 'open-devtools')
    ipcRenderer.send('open-devtools')
}

ipcRenderer.on('init_timer', (event, message) => {
    startTime = Date.parse(new Date())
    timeDown()
})
ipcRenderer.on('main-msg', (event, arg) => {
    console.log(arg)
})



btn.onclick = () => {
    let nowTime = Date.parse(new Date());
    let remain = COUNT_DOWN - (nowTime - startTime);
    if (remain <= 0) {
        clearTimeout(timerId)
        return;
    }
    if (lastUpdateTime === 0 || nowTime - lastUpdateTime >= COUNT_GAP) {
        cnt++;
        let tb = document.querySelector('#tb_countdown tbody');
        tb.innerHTML = '';
        let tr = "<tr>";
        tr += "<td style='text-align:center'>" + dateFormat(remain) + "</td>" + "<td style='text-align:center'>" + cnt + "次</td></tr>";
        tb.innerHTML += tr;
    }
    lastUpdateTime = nowTime;
    totalCnt++;
    let h = '<tr><td>' + dateFormat(remain) + '</td><td>' + cnt + '次' + '(' + totalCnt + ')' + '</td></tr>';
    let th = document.querySelector('#tb_history tbody');
    th.innerHTML = h + th.innerHTML;
}

function timeDown() {
    let tb = document.querySelector("#tb_countdown tbody");
    tb.innerHTML = '';
    let tr = "<tr>";
    let nowTime = Date.parse(new Date());
    let remain = COUNT_DOWN - (nowTime - startTime);
    if (remain > 0) {
        remain--;
        tr += "<td style='text-align:center'>" + dateFormat(remain) + "</td>" + "<td style='text-align:center'>" + cnt + "次</td></tr>";
        timerId = setTimeout(timeDown, 1000);
    } else {
        clearTimeout(timerId)
        tr += "<td style='text-align:center'>倒计时结束</td>" + "<td style='text-align:center'>" + cnt + "</td></tr>"
    }
    tb.innerHTML += tr;
    document.querySelector('#progress_remain').setAttribute("style", "width:" + parseFloat((remain / COUNT_DOWN) * 100) + "%");
}

function dateFormat(time) {
    time = parseInt(time / 1000);
    let min = parseInt(time / 60);
    let sec = time % 60;
    if (min < 10) {
        min = '0' + min;
    }
    if (sec < 10) {
        sec = '0' + sec;
    }
    return min + ':' + sec;
}
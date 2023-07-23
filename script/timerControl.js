var timerControl = {};
var storage = window.localStorage;

function update() {
    if(storage["timerControlPause"]=="true"){
        storage["timerControlPause"]="false";
        storage["targetTimerTimeCount"]=parseInt(storage["targetTimerTimeCount"])+new Date().getTime()-parseInt(storage["nowTimerTimeCount"]);
        storage["startTimerTimeCount"] =parseInt(storage["startTimerTimeCount"])+new Date().getTime()-parseInt(storage["nowTimerTimeCount"]);
    }
    storage["nowTimerTimeCount"]=new Date().getTime();
    var deltaTimerTime=parseInt(storage["targetTimerTimeCount"])-parseInt(storage["nowTimerTimeCount"]);
    if(deltaTimerTime<=0){
        restartTimer()
        initClock();
        setTimeout(alertTimer,30);
        return;
    }
    else{
        deltaTimerTime=(deltaTimerTime-deltaTimerTime%1000)/1000;
        var s=deltaTimerTime%60;
        deltaTimerTime=(deltaTimerTime-s)/60;
        var m=deltaTimerTime%60;
        var h=(deltaTimerTime-m)/60;
        if(h<10){
            document.querySelector('#count_hour').innerText="0"+h.toString();
        }
        else document.querySelector('#count_hour').innerText=h.toString();
        if(m<10){
            document.querySelector('#count_minute').innerText="0"+m.toString();
        }
        else document.querySelector('#count_minute').innerText=m.toString();
        if(s<10){
            document.querySelector('#count_second').innerText="0"+s.toString();
        }
        else document.querySelector('#count_second').innerText=s.toString();
    }
    initClock();
}
function startTimer() {
    storage["timerControlOn"] = "true";
    $('#timer_bar').css('display', "none");
    timerControl.buttonStart.onclick = pauseTimer;
    $('#button_start').css('background', "url(../src/pause.png) no-repeat center center")
    $('#button_start').css('background-size', "50px 50px")
    if (storage["timerControlPause"] == "false") {
        storage["targetTimerTimeCount"]=new Date().getTime();
        storage["targetTimerTimeCount"] =parseInt(storage["targetTimerTimeCount"])+parseInt(document.querySelector('#count_second').innerText) * 1000 +parseInt(document.querySelector('#count_minute').innerText) * 60000 + parseInt(document.querySelector('#count_hour').innerText) * 3600000
        storage["nowTimerTimeCount"] = new Date().getTime();
        storage["startTimerTimeCount"] = new Date().getTime();
    }
    // start timer
    // 计时器启动后“启动按钮”的文字由“开始计时”变为“暂停”
    document.getElementById('start').innerText = "暂停";
    clockTick = setInterval(update, 20);
}
function pauseTimer() {
    storage["timerControlPause"] ="true";
    timerControl.buttonStart.onclick = startTimer;
    $('#button_start').css('background', "url(../src/start.png) no-repeat center center")
    $('#button_start').css('background-size', "50px 50px")
    clearInterval(clockTick);
    //  pause timer
    // 计时器暂停后“启动按钮”的文字由“暂停”变为“继续”
    document.getElementById('start').innerText = "继续";
}
function restartTimer() {
    storage["timerControlOn"] = "false";
    storage["timerControlPause"]="false";
    $('#timer_bar').css('display', "flex");
    timerControl.buttonStart.onclick = startTimer;
    $('#button_start').css('background', "url(../src/start.png) no-repeat center center")
    $('#button_start').css('background-size', "50px 50px")
    clearInterval(clockTick);
    global.timerTime.clear();
    // 计时器取消后“启动按钮”的文字由变为“开始计时”
    document.querySelector('#hour').value = "00";
    document.querySelector('#minute').value = "00";
    document.querySelector('#second').value = "00";
    document.querySelector('#count_hour').innerText = "00";
    document.querySelector('#count_minute').innerText = "00";
    document.querySelector('#count_second').innerText = "00";//初始化
    document.getElementById('start').innerText = "开始计时";
}

function alertTimer(){
    alert("时间到！")
}//防止alert函数优先响应

// 表盘进度更新
function update_progress()
{
    // 获取进度条元素
    const progress = document.getElementById('.progress');
    // 获取总时间
    let time = parseInt(storage["targetTimerTimeCount"]) - parseInt(storage["startTimerTimeCount"]);
    // 获取圆一整圈的长度
    const maxLen = Math.ceil(progress.getTotalLength());
    progress.style.strokeDasharray = maxLen.toString();

    // 匀速从 0~100% 的进度效果
    // 进度条的初始值,效果为进度条为 0
    let num = maxLen;
    // 每次减小的单位值
    let unit = maxLen*20/time;
    // 倒计时进度动画定时器
    let animation_timer;
    animation_timer = window.requestAnimationFrame(function fn() {
        if(num > 0)
        {
            num -= unit;
            progress.style.strokeDashoffset = num;
            // 继续循环则递归调用 fn 函数
            animation_timer = window.requestAnimationFrame(fn)
        }
        else
        {
            // 循环停止
            progress.style.strokeDashoffset = "0";
            // 清除定时器
            window.cancelAnimationFrame(animation_timer);
        }
    });
}

window.onload = function () {
    timerControl.barRightside = $('#bar_rightside').get(0);
    timerControl.barLeftside = $('#bar_leftside').get(0);
    timerControl.barCenter = $('#bar_center').get(0);
    timerControl.buttonStart = $('#button_start').get(0);
    timerControl.buttonRestart = $('#button_restart').get(0);
    timerControl.buttonStart.onclick = startTimer;
    timerControl.buttonRestart.onclick = restartTimer;
    const hourInTimer = document.querySelector('#hour');
    hourInTimer.addEventListener('change', (event) => {
        document.querySelector('#count_hour').textContent = `${event.target.value}`;
    });
    const minuteInTimer = document.querySelector('#minute');
    minuteInTimer.addEventListener('change', (event) => {
        document.querySelector('#count_minute').textContent = `${event.target.value}`;
    });
    const secondInTimer = document.querySelector('#second');
    secondInTimer.addEventListener('change', (event) => {
        document.querySelector('#count_second').textContent = `${event.target.value}`;
    });
    if (storage["timerControlOn"] === undefined) storage["timerControlOn"] = "false";
    if (storage["timerControlOn"] == "true") {
        $('#timer_bar').css('display', "none");
        timerControl.buttonStart.onclick = pauseTimer;
        $('#button_start').css('background', "url(../src/pause.png) no-repeat center center")
        $('#button_start').css('background-size', "50px 50px")
        document.getElementById('start').innerText = "暂停";
        clockTick = setInterval(update, 20);
    }
    if (storage["timerControlPause"] === undefined) storage["timerControlPause"] = "false";
    if (storage["timerControlPause"] == "true") {
        timerControl.buttonStart.onclick = startTimer;
        $('#button_start').css('background', "url(../src/start.png) no-repeat center center")
        $('#button_start').css('background-size', "50px 50px")
        clearInterval(clockTick);
        document.getElementById('start').innerText = "继续";
        startTimer();
        setTimeout(pauseTimer,30);
    }
    if (document.documentElement.clientWidth > 1400 ) {
        $('#timer_bar').css('justify-content',"space-around")
    } else {
        $('#timer_bar').css('justify-content',"center")
    }
    window.addEventListener('resize', () =>{
        //document.documentElement.clientWidth  浏览器的宽度
        if (document.documentElement.clientWidth > 1400 ) {
            $('#timer_bar').css('justify-content',"space-around")
        } else {
            $('#timer_bar').css('justify-content',"center")
        }
    })
}
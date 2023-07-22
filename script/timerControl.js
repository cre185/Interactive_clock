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
    initClock();
}
function initClock()
{
    drawBigClock();
}
function drawBigClock(){
    const clock= document.getElementById("stopwatch_pointer");
    cx = clock.scrollWidth * 0.5;
    cy = clock.scrollWidth * 0.5;
    const scale= document.getElementById("scale");
    const hands= document.getElementById("hands");
    scale.innerHTML = "";
    hands.innerHTML = "";
    let namespace = "http://www.w3.org/2000/svg";
    // 单位长度
    let unit = cx / 300;
    // 表盘半径
    let radius = cx * 0.6;
    // 绘制大表盘
    for(let i = 0; i < 240; i++){
        let rect = document.createElementNS(namespace, "rect");
        // 刻度尺寸参数
        let width;
        let height;
        if(i % 20 === 0){
            width = 3 * unit;
            height = 15 * unit;
            rect.setAttribute("fill", "black");
        }
        else{
            width = 3 * unit;
            height = 8 * unit;
            rect.setAttribute("fill", "gray");
        }
        // 刻度半径
        let r = radius - height / 2;
        // 刻度中心坐标
        let x = (cx + r * Math.sin(Math.PI * i / 120) - width / 2).toString();
        let y = (cy - r * Math.cos(Math.PI * i / 120) - height / 2).toString();
        // 设置刻度属性
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        x = (cx + r * Math.sin(Math.PI * i / 120)).toString();
        y = (cy - r * Math.cos(Math.PI * i / 120)).toString();
        rect.setAttribute("transform", "rotate(" + (i * 1.5).toString() +", " + x + ", " + y + ")");
        scale.appendChild(rect);
    }
    // 绘制表针
    {
        function setAttributes(width, height, color, angle){
            this.setAttribute("width", width.toString());
            this.setAttribute("height", height.toString());
            this.setAttribute("x", (cx - width / 2).toString());
            this.setAttribute("y", (cy - height).toString());
            this.setAttribute("transform", "rotate(" + angle.toString() +", " + cx + ", " + cy + ")");
            this.setAttribute("fill", color);
        }

        Object.defineProperty(SVGElement.prototype, "set", {
            value: setAttributes,
            writable: true,
            enumerable: false,
            configurable: true,
        });
        // 长指针
        let hand_long = document.createElementNS(namespace, "rect");
        hand_long.setAttribute("id", "hand_long");
        hand_long.set(3*unit, radius, "orange", calculateAngle());
        hands.appendChild(hand_long);
    }
}
function calculateAngle(){
    if(storage["timerControlOn"]=="false"){
        return 0;
    }
    var x=(parseInt(storage["nowTimerTimeCount"])-parseInt(storage["startTimerTimeCount"]))/(parseInt(storage["targetTimerTimeCount"])-parseInt(storage["startTimerTimeCount"]));
    return 360*x;
}
function alertTimer(){
    alert("时间到！")
}//防止alert函数优先响应
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
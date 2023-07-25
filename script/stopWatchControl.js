// 秒表类
class stopwatch extends time {
    constructor() {
        super();
    }

    toString() {
        if (this.hour >= 1) {
            return (this.hour < 10 ? '0' + this.hour : this.hour) + ':' +
                (this.min < 10 ? '0' + this.min : this.min) + ':' +
                (this.sec < 10 ? '0' + this.sec : this.sec);
        } else {
            return (this.min < 10 ? '0' + this.min : this.min) + ':' +
                (this.sec < 10 ? '0' + this.sec : this.sec) + '.' +
                (this.mSec < 100 ? '0' + this.mSec / 10 : this.mSec / 10);
        }
    }

    tick() {
        this.mSec += 10;
        if (this.mSec === 1000) {
            this.mSec = 0;
            this.sec++;
        }
        if (this.sec === 60) {
            this.sec = 0;
            this.min++;
        }
        if (this.min === 60) {
            this.min = 0;
            this.hour++;
            this.hour %= 24;
        }
    }

    setTimer(timer) {
        this.timer = timer;
    }

    clearTimer() {
        clearInterval(this.timer);
    }

    clear() {
        this.hour = 0;
        this.min = 0;
        this.sec = 0;
        this.mSec = 0;
        this.clearTimer();
    }
}

// 秒表控制变量
let stopWatchControl={};
// 显示方式变量
let module;

function appendRecord(){
    // 右边栏添加显示组件
    let record_block = document.createElement("div");
    record_block.className = 'stopwatch_block';
    let record_rank = document.createElement("span");
    record_rank.id = stopWatchControl.recordCount;
    let record = document.createElement("span");
    record.id = 'stopwatch'+stopWatchControl.recordCount;

    record_block.append(record_rank);
    record_block.append(record);
    document.getElementById('bar_rightside').append(record_block);

    // 组件更新
    record_rank.innerText = '分段'+stopWatchControl.recordCount;
}
function startStopwatch(){
    stopWatchControl.on=true;
    stopWatchControl.buttonStart.onclick=pauseStopwatch;
    document.getElementById('button_start').style.background = "url(../src/pause_white.png) no-repeat center center";
    document.getElementById('button_start').style.backgroundSize = "50px 50px";
    // todo: start stopwatch
    // 秒表启动后，“启动按钮”的文字由“启动”变为“停止”
    document.getElementById('start').innerText = "停止";
    // 秒表启动后，数字显示开始变化
    let timer = setInterval(function (){
        global.stopWatchTime.tick();
        update_text();
        stopWatchControl.current.tick();
        document.getElementById('stopwatch'+stopWatchControl.recordCount).innerText = stopWatchControl.current.toString();
        initClock();
    },10);
    global.stopWatchTime.setTimer(timer);
    // 秒表启动后，自动有第一个分段
    if(stopWatchControl.recordCount === 0)
    {
        stopWatchControl.recordCount++;
        stopWatchControl.current.hour = global.stopWatchTime.hour;
        stopWatchControl.current.min = global.stopWatchTime.min;
        stopWatchControl.current.sec = global.stopWatchTime.sec;
        stopWatchControl.current.mSec = global.stopWatchTime.mSec;
        appendRecord();
    }
}
function pauseStopwatch(){
    stopWatchControl.on=false;
    stopWatchControl.buttonStart.onclick=startStopwatch;
    document.getElementById('button_start').style.background = "url(../src/start_white.png) no-repeat center center";
    document.getElementById('button_start').style.backgroundSize = "50px 50px";
    // todo: pause stopwatch
    // 秒表暂停后“启动按钮”的文字由“停止”变为“启动”
    document.getElementById('start').innerText = "启动";
    // 秒表暂停后，数字显示暂停
    global.stopWatchTime.clearTimer();
}
function restartStopwatch(){
    stopWatchControl.on=false;
    stopWatchControl.buttonStart.onclick=startStopwatch;
    document.getElementById('button_start').style.background = "url(../src/start_white.png) no-repeat center center";
    document.getElementById('button_start').style.backgroundSize = "50px 50px";
    $('#bar_rightside').get(0).innerHTML="";
    stopWatchControl.recordCount=0;
    // 秒表复位后“启动按钮”的文字变为“启动”
    document.getElementById('start').innerText = "启动";
    // 秒表复位
    global.stopWatchTime.clear();
    stopWatchControl.current.clear();
    update_text();
    initClock();
    stopWatchControl.recordCount = 0;
}
function recordStopwatch(){
    // 只有在秒表运行的时候才能分段
    if(stopWatchControl.on)
    {
        // 开启新分段的计时
        stopWatchControl.recordCount++;
        stopWatchControl.current = new stopwatch();
        appendRecord();
    }
}

// 显示部分由数码切换至指针
function number_to_pointer()
{
    module = "pointer";
    document.getElementById('wrapper').style.visibility = "hidden";
    document.getElementById('display').style.visibility = "hidden";
    document.getElementById('stopwatch').style.visibility = "hidden";
    document.getElementById('round_style').style.visibility = "hidden";
    if(localStorage['pointer_style'] === "2")
    {
        document.getElementById('stopwatch_pointer').style.visibility = "hidden";
        hide();
        document.getElementById('clock_style2').style.visibility = "visible";
    }
    else
    {
        document.getElementById('stopwatch_pointer').style.visibility = "visible";
        show();
        document.getElementById('clock_style2').style.visibility = "hidden";
    }
}

// 显示部分由指针切换至数码
function pointer_to_number()
{
    module = "number";
    document.getElementById('stopwatch_pointer').style.visibility = "hidden";
    document.getElementById('clock_style2').style.visibility = "hidden";
    hide();
    if(localStorage.hasOwnProperty('number_style'))
    {
        if(localStorage.getItem('number_style') === "1")
        {
            document.getElementById('wrapper').style.visibility = "visible";
            document.getElementById('display').style.visibility = "visible";
            document.getElementById('stopwatch').style.visibility = "visible";
            document.getElementById('round_style').style.visibility = "hidden";
        }
        else if(localStorage.getItem('number_style') === "2")
        {
            document.getElementById('wrapper').style.visibility = "hidden";
            document.getElementById('display').style.visibility = "hidden";
            document.getElementById('stopwatch').style.visibility = "hidden";
            document.getElementById('round_style').style.visibility = "visible";
        }
    }
}

// 初始化表+更新表
function initClock()
{
    drawSmallClock();
    drawBigClock();
}

// 画大表
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
            rect.setAttribute("fill", "white");
        }
        else if(i % 5 === 0)
        {
            width = 3 * unit;
            height = 15 * unit;
            rect.setAttribute("fill", "gray");
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

        // 分段长指针
        let hand_record_long = document.createElementNS(namespace, "rect");
        hand_record_long.setAttribute("id", "hand_record_long");
        hand_record_long.set(3*unit, radius, "skyblue", stopWatchControl.current.calSecAngle());
        hands.appendChild(hand_record_long);
        // 分段短指针
        let hand_record_short = document.createElementNS(namespace, "rect");
        hand_record_short.setAttribute("id", "hand_record_short");
        hand_record_short.set(3*unit, radius*0.2, "skyblue", stopWatchControl.current.calSecAngle()+180);
        hands.appendChild(hand_record_short);
        // 长指针
        let hand_long = document.createElementNS(namespace, "rect");
        hand_long.setAttribute("id", "hand_long");
        hand_long.set(3*unit, radius, "orange", global.stopWatchTime.calSecAngle());
        hands.appendChild(hand_long);
        // 短指针
        let hand_short = document.createElementNS(namespace, "rect");
        hand_short.setAttribute("id", "hand_short");
        hand_short.set(3*unit, radius*0.2, "orange", global.stopWatchTime.calSecAngle()+180);
        hands.appendChild(hand_short);
    }
}

// 画小表
function drawSmallClock()
{
    const clock= document.getElementById("stopwatch_pointer");
    cx = clock.scrollWidth * 0.5;
    cy = clock.scrollWidth * 0.4;
    const scale= document.getElementById("scale_min");
    const hands= document.getElementById("hands_min");
    scale.innerHTML = "";
    hands.innerHTML = "";
    let namespace = "http://www.w3.org/2000/svg";
    // 单位长度
    let unit = cx / 300;
    // 表盘半径
    let radius = cx * 0.15;
    // 绘制大表盘
    for(let i = 0; i < 60; i++){
        let rect = document.createElementNS(namespace, "rect");
        // 刻度尺寸参数
        let width;
        let height;
        if(i % 2 === 0){
            width = 2 * unit;
            height = 10 * unit;
            if(i % 10 === 0)
            {
                rect.setAttribute("fill", "white");
            }
            else
            {
                rect.setAttribute("fill", "gray");
            }
        }
        else{
            width = 2 * unit;
            height = 5 * unit;
            rect.setAttribute("fill", "gray");
        }
        // 刻度半径
        let r = radius - height / 2;
        // 刻度中心坐标
        let x = (cx + r * Math.sin(Math.PI * i / 30) - width / 2).toString();
        let y = (cy - r * Math.cos(Math.PI * i / 30) - height / 2).toString();
        // 设置刻度属性
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        x = (cx + r * Math.sin(Math.PI * i / 30)).toString();
        y = (cy - r * Math.cos(Math.PI * i / 30)).toString();
        rect.setAttribute("transform", "rotate(" + (i * 6).toString() +", " + x + ", " + y + ")");
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

        // 指针
        let hand_long = document.createElementNS(namespace, "rect");
        hand_long.setAttribute("id", "hand_long");
        hand_long.set(2*unit, radius, "orange", 2*global.stopWatchTime.calMinAngle());
        hands.appendChild(hand_long);
    }
}

window.onload=function(){
    stopWatchControl.barRightside=$('#bar_rightside').get(0);
    stopWatchControl.barLeftside=$('#bar_leftside').get(0);
    stopWatchControl.barCenter=$('#bar_center').get(0);
    stopWatchControl.buttonStart=$('#button_start').get(0);
    stopWatchControl.buttonRestart=$('#button_restart').get(0);
    stopWatchControl.buttonRecord=$('#button_record').get(0);
    stopWatchControl.buttonRestart.onclick=restartStopwatch;
    stopWatchControl.buttonRecord.onclick=recordStopwatch;
    // 恢复页面信息
    init_page();
    // 保存页面信息
    update_page();
}

function init_page()
{
    // 按钮初始化
    if(localStorage.hasOwnProperty("start_button_state"))
    {
        let button_text = document.getElementById('start');
        let button = document.getElementById('button_start');
        stopWatchControl.on = localStorage.getItem("start_button_state") === "true";
        if(stopWatchControl.on)
        {
            stopWatchControl.buttonStart.onclick=pauseStopwatch;
            button_text.innerText = "停止";
            button.style.background = "url(../src/pause_white.png) no-repeat center center";
            button.style.backgroundSize = "50px 50px";
        }
        else
        {
            stopWatchControl.buttonStart.onclick=startStopwatch;
            button_text.innerText = "启动";
            button.style.background = "url(../src/start_white.png) no-repeat center center";
            button.style.backgroundSize = "50px 50px";
        }
    }
    else
    {
        stopWatchControl.on = false;
        stopWatchControl.buttonStart.onclick=startStopwatch;
        document.getElementById('start').innerText = "启动";
        document.getElementById('button_start').style.background = "url(../src/start_white.png) no-repeat center center";
        document.getElementById('button_start').style.backgroundSize = "50px 50px";
    }
    // 秒表初始化
    global.stopWatchTime = new stopwatch();
    if(parseInt(localStorage.getItem("hour")) >= 0)
    {
        global.stopWatchTime.hour = parseInt(localStorage.getItem("hour"));
        global.stopWatchTime.min = parseInt(localStorage.getItem("min"));
        global.stopWatchTime.sec = parseInt(localStorage.getItem("sec"));
        global.stopWatchTime.mSec = parseInt(localStorage.getItem("mSec"));
        if(stopWatchControl.on)
        {
            let time = new Date().getTime() - parseInt(localStorage.getItem("timestamp"));
            time += global.stopWatchTime.hour*3600000 + global.stopWatchTime.min*60000 + global.stopWatchTime.sec*1000 + global.stopWatchTime.mSec;
            let hour = Math.floor(time/3600000);
            time %= 3600000;
            let min = Math.floor(time/60000);
            time %= 60000;
            let sec = Math.floor(time/1000);
            time %= 1000;
            let mSec = time - time%10;
            global.stopWatchTime.hour = hour;
            global.stopWatchTime.min = min;
            global.stopWatchTime.sec = sec;
            global.stopWatchTime.mSec = mSec;
        }
    }
    stopWatchControl.current = global.stopWatchTime;

    // 显示组件初始化
    update_text();
    if(localStorage.getItem("number_or_pointer") === "number")
    {
        if(localStorage.getItem("number_style") === "1")
        {
            document.getElementById('wrapper').style.visibility = "visible";
            document.getElementById('display').style.visibility = "visible";
            document.getElementById('stopwatch').style.visibility = "visible";
            document.getElementById('round_style').style.visibility = "hidden";
        }
        else if(localStorage.getItem("number_style") === "2")
        {
            document.getElementById('round_style').style.visibility = "visible";
            document.getElementById('wrapper').style.visibility = "hidden";
            document.getElementById('display').style.visibility = "hidden";
            document.getElementById('stopwatch').style.visibility = "hidden";
        }
        document.getElementById('stopwatch_pointer').style.visibility = "hidden";
        hide();
        document.getElementById('clock_style2').style.visibility = "hidden";
    }
    else if(localStorage.getItem("number_or_pointer") === "pointer")
    {
        if(localStorage.getItem("pointer_style") === "1")
        {
            document.getElementById('stopwatch_pointer').style.visibility = "visible";
            show();
            document.getElementById('clock_style2').style.visibility = "hidden";
        }
        else if(localStorage.getItem("pointer_style") === "2")
        {
            document.getElementById('stopwatch_pointer').style.visibility = "hidden";
            hide();
            document.getElementById('clock_style2').style.visibility = "visible";
        }
        document.getElementById('wrapper').style.visibility = "hidden";
        document.getElementById('display').style.visibility = "hidden";
        document.getElementById('stopwatch').style.visibility = "hidden";
        document.getElementById('round_style').style.visibility = "hidden";
    }
    else
    {
        module = "number";
        document.getElementById('wrapper').style.visibility = "visible";
        document.getElementById('display').style.visibility = "visible";
        document.getElementById('stopwatch').style.visibility = "visible";
        document.getElementById('round_style').style.visibility = "hidden";
        document.getElementById('stopwatch_pointer').style.visibility = "hidden";
        hide();
        document.getElementById('clock_style2').style.visibility = "hidden";
        localStorage["number_or_pointer"] = "number";
    }

    if(stopWatchControl.on)
    {
        let timer = setInterval(function (){
            global.stopWatchTime.tick();
            update_text();
            stopWatchControl.current.tick();
            document.getElementById('stopwatch'+stopWatchControl.recordCount).innerText = stopWatchControl.current.toString();
            initClock();
        },10);
        global.stopWatchTime.setTimer(timer);
    }
    // 分段
    if(parseInt(localStorage.getItem("current_hour")) >= 0)
    {
        stopWatchControl.current.hour = parseInt(localStorage.getItem("current_hour"));
        stopWatchControl.current.min = parseInt(localStorage.getItem("current_min"));
        stopWatchControl.current.sec = parseInt(localStorage.getItem("current_sec"));
        stopWatchControl.current.mSec = parseInt(localStorage.getItem("current_mSec"));
        if(stopWatchControl.on)
        {
            let time = new Date().getTime() - parseInt(localStorage.getItem("timestamp"));
            time += stopWatchControl.current.hour*3600000 + stopWatchControl.current.min*60000 + stopWatchControl.current.sec*1000 + stopWatchControl.current.mSec;
            let hour = Math.floor(time/3600000);
            time %= 3600000;
            let min = Math.floor(time/60000);
            time %= 60000;
            let sec = Math.floor(time/1000);
            time %= 1000;
            let mSec = time - time%10;
            stopWatchControl.current.hour = hour;
            stopWatchControl.current.min = min;
            stopWatchControl.current.sec = sec;
            stopWatchControl.current.mSec = mSec;
        }
    }
    stopWatchControl.recordCount = 0;
    if(parseInt(localStorage.getItem("record_count")) >= 0)
    {
        stopWatchControl.recordCount = parseInt(localStorage.getItem("record_count"));
        for(let i = 1; i < stopWatchControl.recordCount; i++)
        {
            if(localStorage.hasOwnProperty("record_"+i))
            {
                initAppendRecord(localStorage.getItem("record_"+i), i);
            }
            console.log(localStorage.getItem("record_"+i));
        }
        if(stopWatchControl.recordCount > 0)
        {
            initAppendRecord(stopWatchControl.current.toString(), stopWatchControl.recordCount);
        }
    }
    // 画表盘
    initClock();
}

function update_page()
{
    // 每10毫秒记录一下页面信息
    setInterval(function (){
        // 启动/暂停按钮的状态
        localStorage.setItem("start_button_state", stopWatchControl.on);
        // 数码显示还是指针显示
        if(document.getElementById('stopwatch').style.visibility === 'visible' || document.getElementById('round_style').style.visibility === 'visible')
        {
            localStorage.setItem("number_or_pointer", "number");
        }
        else
        {
            localStorage.setItem("number_or_pointer", "pointer");
        }

        if(document.getElementById('stopwatch').style.visibility === 'visible')
        {
            localStorage.setItem("number_style", "1");
        }
        else if(document.getElementById('round_style').style.visibility === 'visible')
        {
            localStorage.setItem("number_style", "2");
        }

        if(document.getElementById('stopwatch_pointer').style.visibility === 'visible')
        {
            localStorage.setItem("pointer_style", "1");
        }
        else if(document.getElementById('clock_style2').style.visibility === 'visible')
        {
            localStorage.setItem("pointer_style", "2");
        }
        // 时间
        localStorage.setItem("hour", global.stopWatchTime.hour.toString());
        localStorage.setItem("min", global.stopWatchTime.min.toString());
        localStorage.setItem("sec", global.stopWatchTime.sec.toString());
        localStorage.setItem("mSec", global.stopWatchTime.mSec.toString());
        // 分段
        localStorage.setItem("record_count", stopWatchControl.recordCount.toString());
        localStorage.setItem("current_hour", stopWatchControl.current.hour.toString());
        localStorage.setItem("current_min", stopWatchControl.current.min.toString());
        localStorage.setItem("current_sec", stopWatchControl.current.sec.toString());
        localStorage.setItem("current_mSec", stopWatchControl.current.mSec.toString());
        for(let i = 1; i < stopWatchControl.recordCount; i++)
        {
            let time = document.getElementById('stopwatch'+i);
            localStorage.setItem("record_"+i, time.innerText);
        }
        // 当前时间戳
        localStorage.setItem("timestamp", new Date().getTime().toString());
    }, 10);
}

function initAppendRecord(str, index){
    // 右边栏添加显示组件
    let record_block = document.createElement("div");
    record_block.className = 'stopwatch_block';
    let record_rank = document.createElement("span");
    record_rank.id = index;
    let record = document.createElement("span");
    record.id = 'stopwatch'+index;

    record_block.append(record_rank);
    record_block.append(record);
    document.getElementById('bar_rightside').append(record_block);

    // 组件更新
    record_rank.innerText = '分段'+index;
    record.innerText = str;
}

function changeStyle()
{
    if(document.getElementById('stopwatch').style.visibility === "visible")
    {
        document.getElementById('wrapper').style.visibility = "hidden";
        document.getElementById('display').style.visibility = "hidden";
        document.getElementById('stopwatch').style.visibility = "hidden";
        document.getElementById('round_style').style.visibility = "visible";
        localStorage["number_style"] = "2";
    }
    else if(document.getElementById('round_style').style.visibility === "visible")
    {
        document.getElementById('wrapper').style.visibility = "visible";
        document.getElementById('display').style.visibility = "visible";
        document.getElementById('stopwatch').style.visibility = "visible";
        document.getElementById('round_style').style.visibility = "hidden";
        localStorage["number_style"] = "1";
    }
    else if(document.getElementById('stopwatch_pointer').style.visibility === "visible")
    {
        document.getElementById('stopwatch_pointer').style.visibility = "hidden";
        hide();
        document.getElementById('clock_style2').style.visibility = "visible";
        localStorage["pointer_style"] = "2";
    }
    else if(document.getElementById('clock_style2').style.visibility === "visible")
    {
        document.getElementById('stopwatch_pointer').style.visibility = "visible";
        show();
        document.getElementById('clock_style2').style.visibility = "hidden";
        localStorage["pointer_style"] = "1";
    }
}

function update_text()
{
    document.getElementById('stopwatch').innerText = global.stopWatchTime.toString();
    document.getElementById('time1').innerHTML = global.stopWatchTime.toString();
    document.getElementById('time2').innerHTML = global.stopWatchTime.toString();
    document.getElementById('time3').innerHTML = global.stopWatchTime.toString();
    document.getElementById('time4').innerHTML = global.stopWatchTime.toString();
    update_clock_style2();
}

function hide()
{
    document.getElementById('big_5').style.visibility = "hidden";
    document.getElementById('big_10').style.visibility = "hidden";
    document.getElementById('big_15').style.visibility = "hidden";
    document.getElementById('big_20').style.visibility = "hidden";
    document.getElementById('big_25').style.visibility = "hidden";
    document.getElementById('big_30').style.visibility = "hidden";
    document.getElementById('big_35').style.visibility = "hidden";
    document.getElementById('big_40').style.visibility = "hidden";
    document.getElementById('big_45').style.visibility = "hidden";
    document.getElementById('big_50').style.visibility = "hidden";
    document.getElementById('big_55').style.visibility = "hidden";
    document.getElementById('big_60').style.visibility = "hidden";
    document.getElementById('small_5').style.visibility = "hidden";
    document.getElementById('small_10').style.visibility = "hidden";
    document.getElementById('small_15').style.visibility = "hidden";
    document.getElementById('small_20').style.visibility = "hidden";
    document.getElementById('small_25').style.visibility = "hidden";
    document.getElementById('small_30').style.visibility = "hidden";
}

function show()
{
    document.getElementById('big_5').style.visibility = "visible";
    document.getElementById('big_10').style.visibility = "visible";
    document.getElementById('big_15').style.visibility = "visible";
    document.getElementById('big_20').style.visibility = "visible";
    document.getElementById('big_25').style.visibility = "visible";
    document.getElementById('big_30').style.visibility = "visible";
    document.getElementById('big_35').style.visibility = "visible";
    document.getElementById('big_40').style.visibility = "visible";
    document.getElementById('big_45').style.visibility = "visible";
    document.getElementById('big_50').style.visibility = "visible";
    document.getElementById('big_55').style.visibility = "visible";
    document.getElementById('big_60').style.visibility = "visible";
    document.getElementById('small_5').style.visibility = "visible";
    document.getElementById('small_10').style.visibility = "visible";
    document.getElementById('small_15').style.visibility = "visible";
    document.getElementById('small_20').style.visibility = "visible";
    document.getElementById('small_25').style.visibility = "visible";
    document.getElementById('small_30').style.visibility = "visible";
}

function update_clock_style2()
{
    let mm = document.getElementById('mm_style2');
    let ss = document.getElementById('ss_style2');
    let sec_dot = document.querySelector('.sec_dot');
    let min_dot = document.querySelector('.min_dot');
    let rec_dot = document.querySelector('.rec_dot');

    let mn = document.getElementById('mn_style2');
    let sc = document.getElementById('sc_style2');
    let re = document.getElementById('re_style2');

    mm.style.strokeDashoffset = 314 - 314*2*global.stopWatchTime.calMinAngle()/360;
    ss.style.strokeDashoffset = 628 - 628*global.stopWatchTime.calSecAngle()/360;

    sec_dot.style.transform = `rotateZ(${global.stopWatchTime.calSecAngle()}deg)`;
    min_dot.style.transform = `rotateZ(${2*global.stopWatchTime.calMinAngle()}deg)`;
    rec_dot.style.transform = `rotateZ(${stopWatchControl.current.calSecAngle()}deg)`;

    mn.style.transform = `rotateZ(${2*global.stopWatchTime.calMinAngle()}deg)`;
    sc.style.transform = `rotateZ(${global.stopWatchTime.calSecAngle()}deg)`;
    re.style.transform = `rotateZ(${stopWatchControl.current.calSecAngle()}deg)`;
}
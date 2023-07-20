// 秒表类
class stopwatch extends time
{
    constructor() {
        super();
    }

    toString() {
        if(this.hour >= 1) {
            return (this.hour < 10 ? '0' + this.hour : this.hour) + ':' +
                (this.min < 10 ? '0' + this.min : this.min) + ':' +
                (this.sec < 10 ? '0' + this.sec : this.sec);
        }
        else
        {
            return (this.min < 10 ? '0' + this.min : this.min) + ':' +
                (this.sec < 10 ? '0' + this.sec : this.sec) + '.' +
                (this.mSec < 100 ? '0' + this.mSec/10 : this.mSec/10);
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

    setTimer(timer)
    {
        this.timer = timer;
    }

    clearTimer()
    {
        clearInterval(this.timer);
    }

    clear()
    {
        this.hour = 0;
        this.min = 0;
        this.sec = 0;
        this.mSec = 0;
        this.clearTimer();
    }

    set_recordTimer(timer)
    {
        this.recordtimer = timer;
    }
}

// 秒表初始化
global.stopWatchTime = new stopwatch();
// 秒表控制变量
var stopWatchControl={};
stopWatchControl.on = false;
// 分段
stopWatchControl.recordCount = 0;

function appendRecord(t){
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
    global.stopWatchTime.recordtimer = setInterval(function (){
        t.tick();
        record.innerText = t.toString();
    }, 10);
}
function startStopwatch(){
    stopWatchControl.on=true;
    stopWatchControl.buttonStart.onclick=pauseStopwatch;
    $('#button_start').css('background',"url(../src/pause.png) no-repeat center center")
    $('#button_start').css('background-size',"50px 50px")
    // todo: start stopwatch
    // 秒表启动后，“启动按钮”的文字由“启动”变为“停止”
    document.getElementById('start').innerText = "停止";
    // 秒表启动后，数字显示开始变化
    let timer = setInterval(function (){
        global.stopWatchTime.tick();
        document.getElementById('stopwatch').innerText = global.stopWatchTime.toString();
    },10);
    global.stopWatchTime.setTimer(timer);
    // 秒表启动后，自动有第一个分段
    if(stopWatchControl.recordCount === 0)
    {
        stopWatchControl.recordCount++;
        stopWatchControl.current = new stopwatch();
        appendRecord(stopWatchControl.current);
    }
    else
    {
        global.stopWatchTime.recordtimer = setInterval(function (){
            stopWatchControl.current.tick();
            document.getElementById('stopwatch'+stopWatchControl.recordCount).innerText = stopWatchControl.current.toString();
        }, 10);
    }
}
function pauseStopwatch(){
    stopWatchControl.on=false;
    stopWatchControl.buttonStart.onclick=startStopwatch;
    $('#button_start').css('background',"url(../src/start.png) no-repeat center center")
    $('#button_start').css('background-size',"50px 50px")
    // todo: pause stopwatch
    // 秒表暂停后“启动按钮”的文字由“停止”变为“启动”
    document.getElementById('start').innerText = "启动";
    // 秒表暂停后，数字显示暂停
    global.stopWatchTime.clearTimer();
    // 分段也暂停显示
    clearInterval(global.stopWatchTime.recordtimer);
}
function restartStopwatch(){
    stopWatchControl.on=false;
    stopWatchControl.buttonStart.onclick=startStopwatch;
    $('#button_start').css('background',"url(../src/start.png) no-repeat center center")
    $('#button_start').css('background-size',"50px 50px")
    $('#bar_rightside').get(0).innerHTML="";
    stopWatchControl.recordCount=0;
    // 秒表复位后“启动按钮”的文字变为“启动”
    document.getElementById('start').innerText = "启动";
    // 秒表复位
    global.stopWatchTime.clear();
    document.getElementById('stopwatch').innerText = global.stopWatchTime.toString();
}
function recordStopwatch(){
    // 只有在秒表运行的时候才能分段
    if(stopWatchControl.on)
    {
        // 先停止前一分段的计时
        clearInterval(global.stopWatchTime.recordtimer);
        // 再开启新分段的计时
        stopWatchControl.recordCount++;
        stopWatchControl.current = new stopwatch()
        appendRecord(stopWatchControl.current);
    }
}

// 显示部分由数码切换至指针
function number_to_pointer()
{
    document.getElementById('stopwatch').style.visibility = "hidden";
    document.getElementById('stopwatch_pointer').style.visibility = "visible";
}

// 显示部分由指针切换至数码
function pointer_to_number()
{
    document.getElementById('stopwatch_pointer').style.visibility = "hidden";
    document.getElementById('stopwatch').style.visibility = "visible";
}

function drawClock(){
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
    // 绘制表盘
    for(let i = 0; i < 240; i++){
        let rect = document.createElementNS(namespace, "rect");
        // 刻度尺寸参数
        let width;
        let height;
        // 刻度半径
        let r = radius - height / 2;
        rect.setAttribute("fill", "black");
        if(i % 20 === 0){
            width = 3 * unit;
            height = 15 * unit;
        }
        else{
            width = 3 * unit;
            height = 8 * unit;
        }
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

        // 时针
        var hrHand = document.createElementNS(namespace, "rect");
        hrHand.setAttribute("id", "hourHand");
        width = 15 * v;
        height = radius * 0.5;
        hrHand.set(width, height, "gray", global.globalTime.calHourAngle());
        hands.appendChild(hrHand);

        // 分针
        var minHand = document.createElementNS(namespace, "rect");
        minHand.setAttribute("id", "minuteHand");
        width = 8 * v;
        height = radius * 0.6;
        minHand.set(width, height, "black", global.globalTime.calMinAngle());
        hands.appendChild(minHand);

        // 秒针
        var secHand = document.createElementNS(namespace, "rect");
        secHand.setAttribute("id", "secondHand");
        width = 2 * v;
        height = radius * 0.9;
        secHand.set(width, height, "red", global.globalTime.calSecAngle());
        hands.appendChild(secHand);
    }
}

window.onload=function(){
    stopWatchControl.barRightside=$('#bar_rightside').get(0);
    stopWatchControl.barLeftside=$('#bar_leftside').get(0);
    stopWatchControl.barCenter=$('#bar_center').get(0);
    stopWatchControl.buttonStart=$('#button_start').get(0);
    stopWatchControl.buttonRestart=$('#button_restart').get(0);
    stopWatchControl.buttonRecord=$('#button_record').get(0);
    stopWatchControl.buttonStart.onclick=startStopwatch;
    stopWatchControl.buttonRestart.onclick=restartStopwatch;
    stopWatchControl.buttonRecord.onclick=recordStopwatch;
}
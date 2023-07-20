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
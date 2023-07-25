var alarmClockControl={};
var beep;

// 生成顺位编号
function* generateId(){
    for(let i=0;;i++){
        yield i;
    }
}

alarmClockControl.idGenerator = generateId();


// 闹钟结构体和默认构造函数
class alarmClock{
    constructor(){
        this.time=new time();
        this.id=alarmClockControl.idGenerator.next().value;
    }
}

// 所有的闹钟的数组，初始为空
alarmClockControl.allAlarmclock=[]

// 把id转换为下角标
function id2index(id){
    let recIndex;
    alarmClockControl.allAlarmclock.find((item,index)=>{
        if(item.id===id){
            recIndex=index;
            return true;
        }
    })
    return recIndex;
}

//增加一个闹钟
function appendAlarmclock(loading){
    // 在html中新建一个闹钟元素
    $('#bar_rightside').append(`
    <div class="block alarmclock_block">
        <p class="alarmclock_target">00:00:00</p>
        <button class="close alarmclock_close"></button>
    </div>
    `);
    // 新建一个闹钟对象，并添加进闹钟控制对象中
    var tmpClock=new alarmClock();
    alarmClockControl.allAlarmclock.push(tmpClock);
    $('.alarmclock_block').last().bind('click',function(){
        openAlarmclock(tmpClock.id);
        return false;
    });
    $('.alarmclock_close').last().bind('click',function(){
        removeAlarmclock(tmpClock.id);
        return false;
    });
    // 首次添加，需要加入存储序列
    if(!loading){
        if(localStorage.getItem("formerAlarm")){
            localStorage.setItem("formerAlarm", localStorage.getItem("formerAlarm") + "00:00:00");
        }
        else{
            localStorage.setItem("formerAlarm", "00:00:00");
        }
    }
}

// 更新存储序列
function updateQueue(){
    var alarmQueue = "";
    for(i = 0;i < alarmClockControl.allAlarmclock.length; i++){
        alarmQueue = alarmQueue + alarmClockControl.allAlarmclock[i].time.toString();
    }
    localStorage.setItem("formerAlarm", alarmQueue);
}

function openAlarmclock(id){
    // 关闭之前打开的
    // closeAlarmclock();

    //设置为选中样式
    /*let alarmClockImg=document.createElement("img");
    alarmClockImg.className="alarmclock_selected";
    alarmClockImg.src="../src/alarmclock_selected.png"
    alarmClockImg.alt="alarmclock_selected";
    $('.alarmclock_block').get(id2index(id)).appendChild(alarmClockImg);*/
    alarmClockControl.currentAlarmclock=id;
    $('#bar_rightside .alarmclock_block').css("backgroundColor","#e0e0e0");
    $('#bar_rightside .alarmclock_block').get(id2index(id)).style.backgroundColor="white";
    
    // 重置左边设置界面
    alarmClockControl.barLeftside.innerHTML="";
    $('#bar_leftside').append(`
    <div class="bar_time">
        <div class="bar_time_item">
            <img id="hour_up" src="../src/time_up.png" alt="time_up">
            <p id="hour_setting">00</p>:
            <img id="hour_down" src="../src/time_down.png" alt="time_down">
        </div>
        <div class="bar_time_item">
            <img id="minute_up" src="../src/time_up.png" alt="time_up">
            <p id="minute_setting">00</p>:
            <img id="minute_down" src="../src/time_down.png" alt="time_down">
        </div>
        <div class="bar_time_item">
            <img id="second_up" src="../src/time_up.png" alt="time_up">
            <p id="second_setting">00</p>
            <img id="second_down" src="../src/time_down.png" alt="time_down">
        </div>
    </div>
    <div class="bar_buttons">
        <button class="bar_button" id="bar_submit">确定</button>
        <button class="bar_button" id="bar_cancel">取消</button>
    </div>
    `);

    //设置按钮功能
    var tmpClock = new alarmClock();
    tmpClock.time = alarmClockControl.allAlarmclock[id2index(alarmClockControl.currentAlarmclock)].time;
    $('#hour_setting').get(0).innerHTML = tmpClock.time.hour.toString().padStart(2, '0');
    $('#minute_setting').get(0).innerHTML = tmpClock.time.min.toString().padStart(2, '0');
    $('#second_setting').get(0).innerHTML = tmpClock.time.sec.toString().padStart(2, '0');
    $('#hour_up').get(0).onclick=function(){
        tmpClock.time.hour = (tmpClock.time.hour + 1) % 24;
        $('#hour_setting').get(0).innerHTML = tmpClock.time.hour.toString().padStart(2, '0');
    }
    $('#hour_down').get(0).onclick=function(){
        tmpClock.time.hour = (tmpClock.time.hour + 23) % 24;
        $('#hour_setting').get(0).innerHTML = tmpClock.time.hour.toString().padStart(2, '0');
    }
    $('#minute_up').get(0).onclick=function(){
        tmpClock.time.min = (tmpClock.time.min + 1) % 60;
        $('#minute_setting').get(0).innerHTML = tmpClock.time.min.toString().padStart(2, '0');
    }
    $('#minute_down').get(0).onclick=function(){
        tmpClock.time.min = (tmpClock.time.min + 59) % 60;
        $('#minute_setting').get(0).innerHTML = tmpClock.time.min.toString().padStart(2, '0');
    }
    $('#second_up').get(0).onclick=function(){
        tmpClock.time.sec = (tmpClock.time.sec + 1) % 60;
        $('#second_setting').get(0).innerHTML = tmpClock.time.sec.toString().padStart(2, '0');
    }
    $('#second_down').get(0).onclick=function(){
        tmpClock.time.sec = (tmpClock.time.sec + 59) % 60;
        $('#second_setting').get(0).innerHTML = tmpClock.time.sec.toString().padStart(2, '0');
    }
    $('#bar_submit').last().bind('click', function(){
        alarmClockControl.allAlarmclock[id2index(alarmClockControl.currentAlarmclock)].time = tmpClock.time;
        $('.alarmclock_target').get(id2index(alarmClockControl.currentAlarmclock)).innerHTML = tmpClock.time.toString();
        alarmClockControl.barLeftside.innerHTML="";
        updateQueue();
    })
    $('#bar_cancel').last().bind('click', function(){
        alarmClockControl.barLeftside.innerHTML="";
    })
}

/*
function closeAlarmclock(){
    if(alarmClockControl.currentAlarmclock!=undefined){
        var tempSelect= document.querySelectorAll('.alarmclock_selected');
        if(tempSelect){//若找到
            remove(tempSelect);
        }
    }
}

function remove (e) {
    if (e) {
        for(var i=0;i<e.length;i++){
            e[i].remove();
        }
        return e;
    }
    return undefined;
 }
*/

var removeAlarmclock=function(id){
    var index=id2index(id);
    $('.alarmclock_block').get(index).remove();
    alarmClockControl.allAlarmclock.splice(index,1);
    if(alarmClockControl.currentAlarmclock===id){
        alarmClockControl.currentAlarmclock=undefined;
        alarmClockControl.barLeftside.innerHTML="";
    }
    updateQueue();
}

var newAlarmclock=function(){
    appendAlarmclock();
    openAlarmclock(alarmClockControl.allAlarmclock[alarmClockControl.allAlarmclock.length-1].id);
}

var cx;
var cy;
var hands = ["hourHand", "minuteHand", "secondHand"];
var clockTickWorking;

function update(times = 1){
    if(times > 0){
        for(var i = 0; i < times; i++){
            global.globalTime.tick(); 
        }
    }
    else{
        for(var i = 0; i < times * -1; i++){
            global.globalTime.tick_reverse(); 
        }
    }
    var angles = [global.globalTime.calHourAngle(), global.globalTime.calMinAngle(), global.globalTime.calSecAngle()];
    const clock= document.getElementById("clock_svg");
    cx = clock.scrollWidth * 0.5;
    cy = clock.scrollWidth * 0.5;
    for(let i = 0; i < 3; i++)
    {
        let hand = document.getElementById(hands[i]);
        hand.setAttribute("transform", "rotate(" + angles[i].toString() +", " + cx + ", " + cy + ")");
    }

    const timeText = document.getElementById("timeText");
    timeText.innerHTML = global.globalTime.toString();

    for(i = 0; i < alarmClockControl.allAlarmclock.length; i++) 
    {
        if(alarmClockControl.allAlarmclock[i].time.hour == global.globalTime.hour &&
            alarmClockControl.allAlarmclock[i].time.min == global.globalTime.min &&
            alarmClockControl.allAlarmclock[i].time.sec == global.globalTime.sec &&
            clockTickWorking &&
            global.globalTime.mSec == 0)
            {
                showMessage();
            }
    }
}

// 设置定时器
var clockTick = setInterval(update, 20);
clockTickWorking = true;

function drawClock(hasText){
    const clock= document.getElementById("clock_svg");
    cx = clock.scrollWidth * 0.5;
    cy = clock.scrollWidth * 0.5;
    const scale= document.getElementById("scale");
    const hands= document.getElementById("hands"); 
    scale.innerHTML = "";
    hands.innerHTML = "";
    var namespace = "http://www.w3.org/2000/svg";
    var v = cx / 300;
    var radius = cx * 0.6;
    // 绘制表盘
    for(i = 0; i < 60; i++){
        var rect = document.createElementNS(namespace, "rect");
        var width;
        var height
        var r;
        rect.setAttribute("fill", "black")
        if(i % 15 == 0){
            width = 12 * v;
            height = 40 * v;
        }
        else if(i % 5 === 0){
            width = 12 * v;
            height = 30 * v;
        }
        else{
            width = 4 * v;
            height = 12 * v;
        }
        r = radius - height / 2;
        let x = (cx + r * Math.sin(Math.PI * i / 30) - width / 2).toString();
        let y = (cy - r * Math.cos(Math.PI * i / 30) - height / 2).toString();
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
    if(hasText){
        const timeText = document.getElementById("timeText");   
        timeText.setAttribute("style", "text-anchor: middle");
        timeText.setAttribute("x", cx);
        timeText.setAttribute("y", cy + radius + 60 * v);
        timeText.setAttribute("font-size", (30 * v).toString());
        timeText.setAttribute("fill", "blue");
        timeText.innerHTML = global.globalTime.toString();
    }
}   

// 拖动表针

var mouseMoving = false;
var lastAngle = [0, 0, 0];
var gap = [7200 / 4.32e7, 7200 / 3.6e6, 7200 / 6e4];
var lastListner;

function arctan(x, y){
    return x < 0 ? Math.atan(y / x) / Math.PI * 180 + 180: Math.atan(y / x) / Math.PI * 180;
}

function hourMoveListenrs(event){
    event.preventDefault();
    event.stopPropagation();
    if(mouseMoving){
        x = event.offsetX;
        y = event.offsetY;
        lastAngle[0] = global.globalTime.calHourAngle() - 90;
        let angle = arctan(x - cx, y - cy);
        if(angle * lastAngle[0] < 0 && (angle > 180 || lastAngle[0] > 180))
        {
            angle < 0 ? angle += 360 : lastAngle[0] += 360;
        }
        if(Math.abs(angle - lastAngle[0]) >= gap[0]){
            update((angle - lastAngle[0]) / gap[0]);
            lastAngle[0] = angle;
        }
    }
}

function minuteMoveListenrs(event){
    event.preventDefault();
    event.stopPropagation();
    if(mouseMoving){
        x = event.offsetX;
        y = event.offsetY;
        lastAngle[1] = global.globalTime.calMinAngle() - 90;
        let angle = arctan(x - cx, y - cy);
        if(angle * lastAngle[1] < 0 && (angle > 180 || lastAngle[1] > 180))
        {
            angle < 0 ? angle += 360 : lastAngle[1] += 360;
        }
        if(Math.abs(angle - lastAngle[1]) >= gap[1]){
            update((angle - lastAngle[1]) / gap[1]);
            lastAngle[1] = angle;
        }
    }
}

function secondMoveListenrs(event){
    event.preventDefault();
    event.stopPropagation();
    if(mouseMoving){
        x = event.offsetX;
        y = event.offsetY;
        lastAngle[2] = global.globalTime.calSecAngle() - 90;
        let angle = arctan(x - cx, y - cy);
        if(angle * lastAngle[2] < 0 && (angle > 180 || lastAngle[2] > 180))
        {
            angle < 0 ? angle += 360 : lastAngle[2] += 360;
        }
        if(Math.abs(angle - lastAngle[2]) >= gap[2]){
            update((angle - lastAngle[2]) / gap[2]);
            lastAngle[2] = angle;
        }
    }
}


function setTime(){
    global.globalTime.hour = parseInt(document.getElementById("hour").value);
    global.globalTime.min = parseInt(document.getElementById("minute").value);
    global.globalTime.sec = parseInt(document.getElementById("second").value);
    console.log(global.globalTime);
}

function init(){
    beep = document.getElementById("beep");
    alarmClockControl.barRightside=$('#bar_rightside').get(0);
    alarmClockControl.barLeftside=$('#bar_leftside').get(0);
    alarmClockControl.barCenter=$('#bar_center').get(0);
    alarmClockControl.buttonNewAlarm=$('#button_new_alarmclock').get(0);
    alarmClockControl.buttonNewAlarm.onclick=newAlarmclock;
    drawClock(true);
    const clock= document.getElementById("clock_svg");
    cx = clock.scrollWidth * 0.5;
    cy = clock.scrollWidth * 0.5;
    lastAngle[0] = global.globalTime.calHourAngle() - 90;
    lastAngle[1] = global.globalTime.calMinAngle() - 90;
    lastAngle[2] = global.globalTime.calSecAngle() - 90;

    // 安装监听器
    var hand = document.getElementById(hands[0]);
    hand.addEventListener("mousedown", function(e){
        e.preventDefault();
        e.stopPropagation();
        mouseMoving = true;
        clearInterval(clockTick);
        clockTickWorking = false;
        // 仅在按下时处理鼠标移动事件，已达到拖动的效果
        clock.addEventListener("mousemove", hourMoveListenrs);
        lastListner = 0;
    })

    hand = document.getElementById(hands[1]);
    hand.addEventListener("mousedown", function(e){
        e.preventDefault();
        e.stopPropagation();
        mouseMoving = true;
        clearInterval(clockTick);
        clockTickWorking = false;
        // 仅在按下时处理鼠标移动事件，已达到拖动的效果
        clock.addEventListener("mousemove", minuteMoveListenrs);
        lastListner = 1;
    })

    hand = document.getElementById(hands[2]);
    hand.addEventListener("mousedown", function(e){
        e.preventDefault();
        e.stopPropagation();
        mouseMoving = true;
        clearInterval(clockTick);
        clockTickWorking = false;
        // 仅在按下时处理鼠标移动事件，已达到拖动的效果
        clock.addEventListener("mousemove", secondMoveListenrs);
        lastListner = 2;
    })

    clock.addEventListener("mouseup", function(e){
        mouseMoving = false;
        if(!clockTickWorking){
            clockTick = setInterval(update, 20);
            clockTickWorking = true;
        }
        if(lastListner == 0){
            clock.removeEventListener("mousemove", hourMoveListenrs);
        }
        else if(lastListner == 1){
            clock.removeEventListener("mousemove", minuteMoveListenrs);
        }
        else{
            clock.removeEventListener("mousemove", secondMoveListenrs);
        }
    })

    // 加载之前存储的闹钟信息
    var alarmStorage = localStorage.getItem("formerAlarm");
    if(alarmStorage){
        for(i = 0; i < alarmStorage.length; i = i + 8){
            var hh = parseInt(alarmStorage[i]) * 10 + parseInt(alarmStorage[i + 1]);
            var mm = parseInt(alarmStorage[i + 3]) * 10 + parseInt(alarmStorage[i + 4]);
            var ss = parseInt(alarmStorage[i + 6]) * 10 + parseInt(alarmStorage[i + 7]);
            var tmpTime = new time();
            tmpTime.hour = hh;
            tmpTime.min = mm;
            tmpTime.sec = ss;
            appendAlarmclock(loading = true);
            alarmClockControl.allAlarmclock[alarmClockControl.allAlarmclock.length - 1].time = tmpTime;
            $('.alarmclock_target').get(id2index(alarmClockControl.allAlarmclock[alarmClockControl.allAlarmclock.length - 1].id)).innerHTML = tmpTime.toString();
        }
    }
}

function showMessage() {
    var messageBox = document.getElementById("messageBox");
    messageBox.style.display = "block";
    beep.play();
}

function closeMessageBox() {
    var messageBox = document.getElementById("messageBox");
    messageBox.style.display = "none";
    beep.pause();
    beep.currentTime = 0;
}
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

function replaceCharAtIndex(str, index, newChar) {
    if (index < 0 || index >= str.length) {
        return str; // 防止下标越界
    }
    let charArray = str.split('');
    charArray[index] = newChar;
    return charArray.join('');
}

function findElementIndexInId(element) {
    const Id = element.id;
    const elementsWithClass = document.querySelectorAll(`#${Id}`);
    // console.log(Id);
    // 使用 Array.from 将 NodeList 转换为数组，并使用 indexOf 方法查找当前元素的索引
    const index = Array.from(elementsWithClass).indexOf(element);
    
    // 注意：indexOf 返回 -1 表示元素在数组中未找到，可能是由于元素不在该类的元素集合中
    return index;
  }

//增加一个闹钟
function appendAlarmclock(loading){
    // 在html中新建一个闹钟元素
    $('#bar_rightside').append(`
    <div class="block alarmclock_block" id="alarmclock_block" style="background-color: #2f363e;">
        <p class="alarmclock_target" id="alarmclock_target">00:00:00</p>
        <label class="switch">
            <input type="checkbox" id="togBtn">
            <div class="slider round"></div>
        </label>
    </div>
    `);
    // 新建一个闹钟对象，并添加进闹钟控制对象中
    var tmpClock=new alarmClock();
    alarmClockControl.allAlarmclock.push(tmpClock);

    
    // 首次添加，需要加入存储序列
    if(!loading){
        if(localStorage.getItem("formerAlarm")){
            localStorage.setItem("formerAlarm", localStorage.getItem("formerAlarm") + "00:00:001");
        }
        else{
            localStorage.setItem("formerAlarm", "00:00:001");
        }
    }
    document.getElementsByTagName('input')[document.getElementsByTagName('input').length - 1].checked = true;
    // 当开关被点击时，切换状态并保存到本地存储
    document.getElementsByTagName('input')[document.getElementsByTagName('input').length - 1].addEventListener('change', (event) => {
        if (event.target.id == "togBtn"){
            var storage = localStorage.getItem('formerAlarm');
            var idx = findElementIndexInId(event.target) * 9 + 8;
            var state = storage[idx];
            // console.log(idx);
            var newState;
            if (state == '0'){
                newState = '1';
            }
            else {
                newState = '0';
            }
            var newStorage = replaceCharAtIndex(storage, idx, newState);
            localStorage.setItem('formerAlarm', newStorage);
        }
    });

    document.getElementsByClassName("alarmclock_block")[document.getElementsByClassName("alarmclock_block").length - 1].addEventListener('click', (event) => {
        if (event.target.id == "alarmclock_block"){
            var idx = findElementIndexInId(event.target);
            openAlarmclock(alarmClockControl.allAlarmclock[idx].id);
        }
    });

    document.getElementsByClassName("alarmclock_target")[document.getElementsByClassName("alarmclock_block").length - 1].addEventListener('click', (event) => {
        if (event.target.id == "alarmclock_target"){
            var idx = findElementIndexInId(event.target);
            openAlarmclock(alarmClockControl.allAlarmclock[idx].id);
        }
    });
    document.getElementById("bar_rightside").scrollTop=document.getElementById("bar_rightside").scrollHeight;
}

// 更新存储序列
function updateQueue(){
    var alarmQueue = "";
    var alarmStorage = localStorage.getItem("formerAlarm");
    for(i = 0;i < alarmClockControl.allAlarmclock.length; i++){
        alarmQueue = alarmQueue + alarmClockControl.allAlarmclock[i].time.toString() + alarmStorage[i * 9 + 8];
    }
    localStorage.setItem("formerAlarm", alarmQueue);
}


function openAlarmclock(id){
    alarmClockControl.currentAlarmclock=id;
    $('#bar_rightside .alarmclock_block').css("backgroundColor","#2f363e");
    $('#bar_rightside .alarmclock_block').get(id2index(id)).style.backgroundColor="#3d464f";
    
    // 重置左边设置界面
    alarmClockControl.barLeftside.innerHTML=`<div class="container" id="button_new_alarmclock">
        <a href="#" style="--clr4:#1e9bff">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            添加闹钟
        </a>
    </div>`;
    alarmClockControl.buttonNewAlarm=$('#button_new_alarmclock').get(0);
    alarmClockControl.buttonNewAlarm.onclick=newAlarmclock;
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
        <button class="bar_button" id="bar_delete">删除</button>
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
        alarmClockControl.barLeftside.innerHTML=`<div class="container" id="button_new_alarmclock">
            <a href="#" style="--clr4:#1e9bff">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                添加闹钟
            </a>
        </div>`;
        updateQueue();
    })
    $('#bar_cancel').last().bind('click', function(){
        alarmClockControl.barLeftside.innerHTML=`<div class="container" id="button_new_alarmclock">
            <a href="#" style="--clr4:#1e9bff">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                添加闹钟
            </a>
        </div>`;
        alarmClockControl.buttonNewAlarm=$('#button_new_alarmclock').get(0);
        alarmClockControl.buttonNewAlarm.onclick=newAlarmclock;
    })
    $('#bar_delete').last().bind('click', function(){
        removeAlarmclock(alarmClockControl.currentAlarmclock);
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
        alarmClockControl.barLeftside.innerHTML=`<div class="container" id="button_new_alarmclock">
            <a href="#" style="--clr4:#1e9bff">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                添加闹钟
            </a>
        </div>`;
        alarmClockControl.buttonNewAlarm=$('#button_new_alarmclock').get(0);
        alarmClockControl.buttonNewAlarm.onclick=newAlarmclock;
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
var isAdjusting = false;

function update(times = 1){
    if(times > 0){
        for(var i = 0; i < times; i++){
            global.globalTime.tick(); 
        }
    }
    else if(times < 0){
        for(var i = 0; i < times * -1; i++){
            global.globalTime.tick_reverse(); 
        }
    }
    var angles = [global.globalTime.calHourAngle(), global.globalTime.calMinAngle(), global.globalTime.calSecAngle()];
    const clock= document.getElementById("clock_svg");
    cx = clock.scrollWidth * 0.5;
    cy = clock.scrollWidth * 0.4;
    for(let i = 0; i < 3; i++)
    {
        let hand = document.getElementById(hands[i]);
        hand.setAttribute("transform", "rotate(" + angles[i]+", " + cx + ", " + cy + ")");
    }
    
    let hour = document.getElementById("hour");
    hour.innerHTML = global.globalTime.getHour();
    let min = document.getElementById("minute");
    min.innerHTML = global.globalTime.getMin();
    let sec = document.getElementById("second");
    sec.innerHTML = global.globalTime.getSec();

    for(i = 0; i < alarmClockControl.allAlarmclock.length; i++) 
    {
        if(alarmClockControl.allAlarmclock[i].time.hour == global.globalTime.hour &&
            alarmClockControl.allAlarmclock[i].time.min == global.globalTime.min &&
            alarmClockControl.allAlarmclock[i].time.sec == global.globalTime.sec &&
            clockTickWorking &&
            document.getElementsByTagName("input")[i].checked == true &&
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
    cy = clock.scrollWidth * 0.4;
    const scale= document.getElementById("scale");
    const hands= document.getElementById("hands"); 
    const center= document.getElementById("center"); 
    const timeText = document.getElementById("timeText");
    const buttons = document.getElementById("buttons");
    scale.innerHTML = "";
    hands.innerHTML = "";
    center.innerHTML = "";
    timeText.innerHTML ="";
    buttons.innerHTML = "";
    var namespace = "http://www.w3.org/2000/svg";
    var v = cx / 300;
    // 绘制表盘
    var rect = document.createElementNS(namespace, "rect");
    var width = 300 * v;
    var height = 250 * v;
    rect.setAttribute("width", width);
    rect.setAttribute("height", height);
    rect.setAttribute("x", cx - width / 2);
    rect.setAttribute("y", cy);
    rect.setAttribute("rx", 10 * v);
    rect.setAttribute("fill", "#2F363E");
    rect.setAttribute("filter", "url(#inset-shadow)");
    scale.appendChild(rect);

    var circle = document.createElementNS(namespace, "circle");
    var radius = 150 * v;
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", "#2F363E");
    circle.setAttribute("filter", "url(#inset-shadow)");
    scale.appendChild(circle);

    radius = 130 * v;
    for(var i = 1; i <= 12; i++){
        var number = document.createElementNS(namespace, "text");
        var x = cx + radius * Math.sin(Math.PI * i / 6);
        var y = cy - radius * Math.cos(Math.PI * i / 6) + 10 * v;
        number.setAttribute("style", "text-anchor: middle");
        number.setAttribute("x", x);
        number.setAttribute("y", y);
        number.setAttribute("font-size", 20 * v);
        number.setAttribute("opacity", "0.25");
        number.setAttribute("font-weight", "600");
        number.setAttribute("fill", "white");
        number.innerHTML = i;
        scale.appendChild(number);
    }

    for(var i = 2; i >= 0; i--){
        radius = (60 + 20 * i) * v;
        circle = document.createElementNS(namespace, "circle");
        circle.setAttribute("cx", cx);
        circle.setAttribute("cy", cy);
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", "#2F363E");
        circle.setAttribute("stroke", "rgba(0, 0, 0, 0.25)");
        circle.setAttribute("stroke-width", 2 * v);
        scale.appendChild(circle);
    }

    // 绘制表针
    {
        const filters = ["url(#red-shadow1) url(#red-shadow2)", "url(#yellow-shadow1) url(#yellow-shadow2)", 
        "url(#green-shadow1) url(#green-shadow2)"]

        function setAttributes(width, height, color, angle, id){
            let hand = this.childNodes[0];
            hand.setAttribute("width", width.toString());
            hand.setAttribute("height", height.toString());
            hand.setAttribute("x", cx - width / 2);
            hand.setAttribute("y", cy - height);
            hand.setAttribute("opacity", 0.8);
            let button = this.childNodes[1];
            button.setAttribute("cx", cx);
            button.setAttribute("cy", cy - ( 60 + 20 * id) * v);
            button.setAttribute("r", 5 * v);
            button.setAttribute("filter", filters[id]);
            this.setAttribute("fill", color);
            this.setAttribute("transform", "rotate(" + angle.toString() +", " + cx + ", " + cy + ")");
        }

        Object.defineProperty(SVGElement.prototype, "set", {
            value: setAttributes,
            writable: true,
            enumerable: false,
            configurable: true,
          });

        // 时针
        var hrHand = document.createElementNS(namespace, "g");
        rect = document.createElementNS(namespace, "rect");
        circle = document.createElementNS(namespace, "circle");
        hrHand.setAttribute("id", "hourHand");
        width = 6 * v;
        height = 30 * v;
        hrHand.appendChild(rect);
        hrHand.appendChild(circle);
        hrHand.set(width, height, "#FF2972", global.globalTime.calHourAngle(), 0);
        hands.appendChild(hrHand);

        // 分针
        var minHand = document.createElementNS(namespace, "g");
        rect = document.createElementNS(namespace, "rect");
        circle = document.createElementNS(namespace, "circle");
        minHand.setAttribute("id", "minuteHand");
        width = 6 * v;
        height = 40 * v;
        minHand.appendChild(rect);
        minHand.appendChild(circle);
        minHand.set(width, height, "#FEE800", global.globalTime.calMinAngle(), 1);
        hands.appendChild(minHand);

        // 秒针
        var secHand = document.createElementNS(namespace, "g");
        rect = document.createElementNS(namespace, "rect");
        circle = document.createElementNS(namespace, "circle");
        secHand.setAttribute("id", "secondHand");
        width = 2 * v;
        height = 50 * v;
        secHand.appendChild(rect);
        secHand.appendChild(circle);
        secHand.set(width, height, "#04FC43", global.globalTime.calSecAngle(), 2);
        hands.appendChild(secHand);

    }

    circle = document.createElementNS(namespace, "circle");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", 6 * v);
    circle.setAttribute("fill", "#2F363E");
    circle.setAttribute("stroke", "white");
    circle.setAttribute("stroke-width", 2 * v);
    center.appendChild(circle);

    if(hasText){
        rect = document.createElementNS(namespace, "rect");
        width = 150 * v;
        height = 40 * v
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        rect.setAttribute("x", cx - width / 2);
        rect.setAttribute("y", cy + 170 * v);
        rect.setAttribute("rx", 25 * v);
        rect.setAttribute("fill", "#2F363E");
        rect.setAttribute("stroke", "rgba(0, 0, 0, 0.5)");
        rect.setAttribute("stroke-width", 2 * v);
        rect.setAttribute("filter", "url(#timebox-shadow)");
        timeText.appendChild(rect);

        var hour = document.createElementNS(namespace, "text");
        hour.setAttribute("style", "text-anchor: middle");
        hour.setAttribute("id", "hour")
        hour.setAttribute("x", cx - 30 * v);
        hour.setAttribute("y", cy + 196 * v);
        hour.setAttribute("font-size", 18 * v);
        hour.setAttribute("fill", "#FF2972");
        hour.innerHTML = global.globalTime.getHour();
        timeText.append(hour);

        var min = document.createElementNS(namespace, "text");
        min.setAttribute("style", "text-anchor: middle");
        min.setAttribute("id", "minute")
        min.setAttribute("x", cx + 7 * v);
        min.setAttribute("y", cy + 196 * v);
        min.setAttribute("font-size", 18 * v);
        min.setAttribute("fill", "#FEE800");
        min.innerHTML = global.globalTime.getMin();
        timeText.append(min);

        var sec = document.createElementNS(namespace, "text");
        sec.setAttribute("style", "text-anchor: middle");
        sec.setAttribute("id", "second")
        sec.setAttribute("x", cx + 38 * v);
        sec.setAttribute("y", cy + 196 * v);
        sec.setAttribute("font-size", 18 * v);
        sec.setAttribute("fill", "#04FC43");
        sec.innerHTML = global.globalTime.getSec();
        timeText.append(sec);

        if(!isAdjusting){
            // 调整按钮
            var adjust = document.createElementNS(namespace, "g");
            circle = document.createElementNS(namespace, "circle");
            circle.setAttribute("cx", cx - 30 * v);
            circle.setAttribute("cy", cy + 230 * v);
            circle.setAttribute("fill", "#FEE800");
            circle.setAttribute("r", 5 * v);
            circle.setAttribute("filter", "url(#yellow-shadow1)");
            text = document.createElementNS(namespace, "text");
            text.setAttribute("style", "text-anchor: middle");
            text.setAttribute("x", cx + 10 * v);
            text.setAttribute("y", cy + 235 * v);
            text.setAttribute("font-size", 12 * v);
            text.setAttribute("fill", "#FFF");
            text.setAttribute("weight", 600);
            text.innerHTML = "ADJUST";
            adjust.appendChild(circle);
            adjust.appendChild(text);
            buttons.appendChild(adjust);
            adjust.addEventListener("click", adjustTime);
        }
        else{
            // 重置按钮
            var reset = document.createElementNS(namespace, "g");
            var circle = document.createElementNS(namespace, "circle");
            circle.setAttribute("cx", cx - 70 * v);
            circle.setAttribute("cy", cy + 230 * v);
            circle.setAttribute("fill", "#FF2972");
            circle.setAttribute("r", 5 * v);
            circle.setAttribute("filter", "url(#red-shadow1)");
            text = document.createElementNS(namespace, "text");
            text.setAttribute("style", "text-anchor: middle");
            text.setAttribute("x", cx - 30 * v);
            text.setAttribute("y", cy + 235 * v);
            text.setAttribute("font-size", 12 * v);
            text.setAttribute("fill", "#FFF");
            text.setAttribute("weight", 600);
            text.innerHTML = "RESET";
            reset.appendChild(circle);
            reset.appendChild(text);
            buttons.appendChild(reset);
            reset.addEventListener("click", resetTime);

            // 确定按钮
            var confirm = document.createElementNS(namespace, "g");
            circle = document.createElementNS(namespace, "circle");
            circle.setAttribute("cx", cx + 20 * v);
            circle.setAttribute("cy", cy + 230 * v);
            circle.setAttribute("fill", "#04FC43");
            circle.setAttribute("r", 5 * v);
            circle.setAttribute("filter", "url(#green-shadow1)");
            text = document.createElementNS(namespace, "text");
            text.setAttribute("style", "text-anchor: middle");
            text.setAttribute("x", cx + 60 * v);
            text.setAttribute("y", cy + 235 * v);
            text.setAttribute("font-size", 12 * v);
            text.setAttribute("fill", "#FFF");
            text.setAttribute("weight", 600);
            text.innerHTML = "CONFIRM";
            confirm.appendChild(circle);
            confirm.appendChild(text);
            buttons.appendChild(confirm);
            confirm.addEventListener("click", setTime);

            // 调整按钮
            var adjusments = [addHour, minusHour, addMin, minusMin, addSec, minusSec];
            for(var i = 0 ; i < 3; i++){
                var up = document.createElementNS(namespace, "polygon");
                var down = document.createElementNS(namespace, "polygon");
                var points = (cx + (37 * i - 40) * v) + "," + (cy + 180 * v) + " " + (cx + (37 * i - 30) * v) + "," + (cy + 180 * v) + " "
                + (cx + (37 * i - 35) * v) + "," + (cy + 175 * v);
                up.setAttribute("points", points);
                up.setAttribute("fill", "#FFF");
                up.addEventListener("click", adjusments[2 * i]);
                buttons.appendChild(up);
                points = (cx + (37 * i - 40) * v) + "," + (cy + 200 * v) + " " + (cx + (37 * i - 30) * v) + "," + (cy + 200 * v) + " "
                + (cx + (37 * i - 35) * v) + "," + (cy + 205 * v);
                down.setAttribute("points", points);
                down.setAttribute("fill", "#FFF");
                down.addEventListener("click", adjusments[2 * i + 1]);
                buttons.appendChild(down);
            }
        }
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

function adjustTime(){
    clearInterval(clockTick);
    isAdjusting = true;
    init();
}

function addHour(){
    for(var i = 1; i < 180000; i++){
        global.globalTime.tick();
    }
    update(0);
}

function minusHour(){
    for(var i = 1; i < 180000; i++){
        global.globalTime.tick_reverse();
    }
    update(0);
}

function addMin() {
    for(var i = 1; i < 3000; i++){
        global.globalTime.tick();
    }
    update(0);
}

function minusMin(){
    for(var i = 1; i < 3000; i++){
        global.globalTime.tick_reverse();
    }
    update(0);
}

function addSec() {
    for(var i = 1; i < 50; i++){
        global.globalTime.tick();
    }
    update(0);
}

function minusSec(){
    for(var i = 1; i < 50; i++){
        global.globalTime.tick_reverse();
    }
    update(0);
}

function resetTime(){
    var mDate=new Date();
    global.globalTime.hour=mDate.getHours();
    global.globalTime.min=mDate.getMinutes();
    global.globalTime.sec=mDate.getSeconds();
    clockTick = setInterval(update, 20);
    isAdjusting = false;
    init();
}

function setTime(){
    clockTick = setInterval(update, 20);
    isAdjusting = false;
    init();
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
    cy = clock.scrollWidth * 0.4;
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
        if(!clockTickWorking && !isAdjusting){
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
    //先清除闹钟
    const alarmClockBlocks = document.querySelectorAll(".alarmclock_block");
  
    alarmClockBlocks.forEach(element => {
        element.remove();
    });

    // 加载之前存储的闹钟信息
    var alarmStorage = localStorage.getItem("formerAlarm");
    if(alarmStorage){
        for(i = 0; i < alarmStorage.length; i = i + 9){
            var hh = parseInt(alarmStorage[i]) * 10 + parseInt(alarmStorage[i + 1]);
            var mm = parseInt(alarmStorage[i + 3]) * 10 + parseInt(alarmStorage[i + 4]);
            var ss = parseInt(alarmStorage[i + 6]) * 10 + parseInt(alarmStorage[i + 7]);
            // 获取之前的开关状态
            var previousState = parseInt(alarmStorage[i + 8]);
            var tmpTime = new time();
            tmpTime.hour = hh;
            tmpTime.min = mm;
            tmpTime.sec = ss;
            appendAlarmclock(loading = true);
            // 如果之前的状态存在，设置开关的状态
            // console.log(previousState);
            if (!previousState) {
                document.getElementsByTagName('input')[document.getElementsByTagName('input').length - 1].checked = false;
            }
            else {
                document.getElementsByTagName('input')[document.getElementsByTagName('input').length - 1].checked = true;
            }
            alarmClockControl.allAlarmclock[alarmClockControl.allAlarmclock.length - 1].time = tmpTime;
            $('.alarmclock_target').get(-1).innerHTML = tmpTime.toString();
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
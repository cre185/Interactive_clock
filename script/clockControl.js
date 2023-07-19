var cx;
var cy;
var hands = ["hourHand", "minuteHand", "secondHand"];

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
}

// 设置定时器
var clockTick = setInterval(update, 20);

function drawClock(){
    const clock= document.getElementById("clock_svg");
    cx = clock.scrollWidth * 0.5;
    cy = clock.scrollWidth * 0.5;
    const scale= document.getElementById("scale");
    const hands= document.getElementById("hands");
    const timeText = document.getElementById("timeText");    
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

    {
        timeText.setAttribute("style", "text-anchor: middle");
        timeText.setAttribute("x", cx);
        timeText.setAttribute("y", cy + radius + 80 * v);
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
        if(angle * lastAngle[0] < 0)
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
        if(angle * lastAngle[1] < 0)
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
        if(angle * lastAngle[2] < 0)
        {
            angle < 0 ? angle += 360 : lastAngle[2] += 360;
        }
        if(Math.abs(angle - lastAngle[2]) >= gap[2]){
            update((angle - lastAngle[2]) / gap[2]);
            lastAngle[2] = angle;
        }
    }
}

function init(){
    drawClock();
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
            // 仅在按下时处理鼠标移动事件，已达到拖动的效果
            clock.addEventListener("mousemove", secondMoveListenrs);
            lastListner = 2;
        })

        clock.addEventListener("mouseup", function(e){
            mouseMoving = false;
            clockTick = setInterval(update, 20);
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
    }

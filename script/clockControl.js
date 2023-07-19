function update(){
    global.globalTime.tick(); 
    var hands = ["hourHand", "minuteHand", "secondHand"];
    var angles = [global.globalTime.calHourAngle(), global.globalTime.calMinAngle(), global.globalTime.calSecAngle()];
    const clock= document.getElementById("clock_svg");
    var cx = clock.scrollWidth * 0.5;
    var cy = clock.scrollWidth * 0.5;
    for(let i = 0; i < 3; i++)
    {
        let hand = document.getElementById(hands[i]);
        hand.setAttribute("transform", "rotate(" + angles[i].toString() +", " + cx + ", " + cy + ")");
    }

    const timeText = document.getElementById("timeText");
    timeText.innerHTML = global.globalTime.toString();
}

// 设置定时器
setInterval(update, 20);

function drawClock(){
    const clock= document.getElementById("clock_svg");
    const scale= document.getElementById("scale");
    const hands= document.getElementById("hands");
    const timeText = document.getElementById("timeText")
;    scale.innerHTML = "";
    hands.innerHTML = "";
    var namespace = "http://www.w3.org/2000/svg";
    var cx = clock.scrollWidth * 0.5;
    var cy = clock.scrollWidth * 0.5;
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
        width = 0.5 * v;
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
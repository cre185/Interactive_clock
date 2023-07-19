function drawClock(){
    var embedSVG = document.getElementById("clock_svg");
    var namespace = "http://www.w3.org/2000/svg";
    // 绘制表盘
    for(i = 0; i < 60; i++){
        var rect = document.createElementNS(namespace, "rect");
        var width;
        var height
        var r;
        rect.setAttribute("fill", "black")
        if(i % 15 == 0){
            continue;
        }
        else if(i % 5 === 0){
            width = 12;
            height = 30;
            r = 120;
        }
        else{
            width = 4;
            height = 12;
            r = 128
        }
        let x = (150 + r * Math.sin(Math.PI * i / 30) - width / 2).toString();
        let y = (150 - r * Math.cos(Math.PI * i / 30) - height / 2).toString();
        rect.setAttribute("width", width);
        rect.setAttribute("height", height);
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        x = (150 + r * Math.sin(Math.PI * i / 30)).toString();
        y = (150 - r * Math.cos(Math.PI * i / 30)).toString();
        rect.setAttribute("transform", "rotate(" + (i * 6).toString() +", " + x + ", " + y + ")");
        embedSVG.appendChild(rect);
    }
}   
var timerControl={};
timerControl.on=false;
function startTimer(){
    timerControl.on=true;
    timerControl.buttonStart.onclick=pauseTimer;
    $('#button_start').css('background',"url(../src/pause.png) no-repeat center center")
    $('#button_start').css('background-size',"50px 50px")
    // todo: start timer
    // 计时器启动后“启动按钮”的文字由“开始计时”变为“暂停”
    document.getElementById('start').innerText = "暂停";
}
function pauseTimer(){
    timerControl.on=false;
    timerControl.buttonStart.onclick=startTimer;
    $('#button_start').css('background',"url(../src/start.png) no-repeat center center")
    $('#button_start').css('background-size',"50px 50px")
    // todo: pause timer
    // 计时器暂停后“启动按钮”的文字由“暂停”变为“继续”
    document.getElementById('start').innerText = "继续";
}
function restartTimer(){
    timerControl.on=false;
    timerControl.buttonStart.onclick=startTimer;
    $('#button_start').css('background',"url(../src/start.png) no-repeat center center")
    $('#button_start').css('background-size',"50px 50px")
    global.timerTime.clear();
    global.timerTime.minute=3;
    // 计时器取消后“启动按钮”的文字由变为“开始计时”
    document.getElementById('start').innerText = "开始计时";
}
window.onload=function(){
    timerControl.barRightside=$('#bar_rightside').get(0);
    timerControl.barLeftside=$('#bar_leftside').get(0);
    timerControl.barCenter=$('#bar_center').get(0);
    timerControl.buttonStart=$('#button_start').get(0);
    timerControl.buttonRestart=$('#button_restart').get(0);
    timerControl.buttonStart.onclick=startTimer;
    timerControl.buttonRestart.onclick=restartTimer;
}
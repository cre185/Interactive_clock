var timerControl={};
timerControl.on=false;
function startTimer(){
    timerControl.on=true;
    timerControl.buttonStart.onclick=pauseTimer;
    $('#button_start').css('background',"url(../src/pause.png) no-repeat center center")
    $('#button_start').css('background-size',"50px 50px")
    // todo: start timer
}
function pauseTimer(){
    timerControl.on=false;
    timerControl.buttonStart.onclick=startTimer;
    $('#button_start').css('background',"url(../src/start.png) no-repeat center center")
    $('#button_start').css('background-size',"50px 50px")
    // todo: pause timer
}
function restartTimer(){
    timerControl.on=false;
    timerControl.buttonStart.onclick=startTimer;
    $('#button_start').css('background',"url(../src/start.png) no-repeat center center 50px 50px")
    $('#button_start').css('background-size',"50px 50px")
    global.timerTime.clear();
    global.timerTime.minute=3;
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
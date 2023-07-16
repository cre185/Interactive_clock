var stopWatchControl={};
stopWatchControl.recordCount=0;
stopWatchControl.recordLast=new time();
stopWatchControl.on=false;
function appendRecord(t){
    $('#bar_rightside').append(`
    <div class="block stopwatch_block">
        <p class="stopwatch_record">${t.time2string()}&nbsp;&nbsp;#${stopWatchControl.recordCount}</p>
        <p class="stopwatch_relative">+${t.diff(stopWatchControl.recordLast)}</p>
    </div>
    `);
}
function startStopwatch(){
    stopWatchControl.on=true;
    stopWatchControl.buttonStart.onclick=pauseStopwatch;
    $('#button_start').css('background',"url(../src/pause.png) no-repeat center center")
    $('#button_start').css('background-size',"50px 50px")
    // todo: start stopwatch
}
function pauseStopwatch(){
    stopWatchControl.on=false;
    stopWatchControl.buttonStart.onclick=startStopwatch;
    $('#button_start').css('background',"url(../src/start.png) no-repeat center center")
    $('#button_start').css('background-size',"50px 50px")
    // todo: pause stopwatch
}
function restartStopwatch(){
    stopWatchControl.on=false;
    stopWatchControl.buttonStart.onclick=startStopwatch;
    $('#button_start').css('background',"url(../src/start.png) no-repeat center center")
    $('#button_start').css('background-size',"50px 50px")
    global.stopWatchTime.clear();
    $('#bar_rightside').get(0).innerHTML="";
    stopWatchControl.recordCount=0;
}
function recordStopwatch(){
    currentTime=new time();
    currentTime.hour=global.stopWatchTime.hour;
    currentTime.minute=global.stopWatchTime.minute;
    currentTime.second=global.stopWatchTime.second;
    appendRecord(currentTime);
    stopWatchControl.recordCount++;
    stopWatchControl.recordLast=currentTime;
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
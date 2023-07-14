// import 'alarmClock.js';

// declaration of variables
var navigatorControl={};
var alarmClockPage=function(){
    //todo
    alert("alarmClock");
}
var stopWatchPage=function(){
    //todo
    alert("stopWatch")
}
var timerPage=function(){
    //todo
}

window.onload=function(){
    navigatorControl.alarmClock=$('#alarmClock').get(0);
    navigatorControl.stopWatch=$('#stopWatch').get(0);
    navigatorControl.timer=$('#timer').get(0);
    navigatorControl.alarmClock.onclick=alarmClockPage;
    navigatorControl.stopWatch.onclick=stopWatchPage;
    navigatorControl.timer.onclick=timerPage;
}
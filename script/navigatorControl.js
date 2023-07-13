// create navigator
document.writeln("    <div id=\'navigator\'>");
document.writeln("    <ul>");
document.writeln("        <li id=\'alarmClock\'>闹钟</li>");
document.writeln("        <li id=\'stopWatch\'>秒表</li>");
document.writeln("        <li id=\'timer\'>计时器</li>");
document.writeln("    </ul>");
document.writeln("    </div>");
// declaration of variables
var navigatorControl={};
navigatorControl.alarmClock=document.getElementById('alarmClock');
navigatorControl.stopWatch=document.getElementById('stopWatch');
navigatorControl.timer=document.getElementById('timer');

var alarmClockPage=function(){
    //todo
    alert("alarmClock");
}
var stopWatchPage=function(){
    //todo
}
var timerPage=function(){
    //todo
}
navigatorControl.alarmClock.onclick=alarmClockPage;
navigatorControl.stopWatch.onclick=stopWatchPage;
navigatorControl.timer.onclick=timerPage;
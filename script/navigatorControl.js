// declaration of variables
var navigatorControl={};
var fullpath = location.href.split('/');
navigatorControl.htmlName = fullpath[fullpath.length - 1];
var alarmClockPage=function(){
    if(navigatorControl.htmlName==="alarmClock.html"){ return; }
    window.location.replace("alarmClock.html");
}
var stopWatchPage=function(){
    if(navigatorControl.htmlName==="stopWatch.html"){ return; }
    window.location.replace("stopWatch.html");
}
var timerPage=function(){
    if(navigatorControl.htmlName==="timer.html"){ return; }
    window.location.replace("timer.html");
}

// insertion of navigator
document.writeln("<div id=\'navigator\'>");
document.writeln("    <ul>");
document.writeln("        <li id=\'alarmClock\'>闹钟</li>");
document.writeln("        <li id=\'stopWatch\'>秒表</li>");
document.writeln("        <li id=\'timer\'>计时器</li>");
document.writeln("    </ul>");
document.writeln("</div>");

navigatorControl.alarmClock=$('#alarmClock').get(0);
navigatorControl.stopWatch=$('#stopWatch').get(0);
navigatorControl.timer=$('#timer').get(0);
navigatorControl.alarmClock.onclick=alarmClockPage;
navigatorControl.stopWatch.onclick=stopWatchPage;
navigatorControl.timer.onclick=timerPage;
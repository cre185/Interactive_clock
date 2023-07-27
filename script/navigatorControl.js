// declaration of variables
var navigatorControl={};
var fullpath = location.href.split('/');
navigatorControl.htmlName = fullpath[fullpath.length - 1];
var clockPage=function(){
    if(navigatorControl.htmlName === "clock.html"){ return; }
    window.location.replace("clock.html");
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
document.writeln("        <li id=\'clock\' style='--clr3:#ff2972'><a href='#' data-text='&nbsp;Clock&nbsp;'>&nbsp;Clock&nbsp;</a></li>");
document.writeln("        <li id=\'stopWatch\' style='--clr3:#ffdd1c'><a href='#' data-text='&nbsp;StopWatch&nbsp;'>&nbsp;StopWatch&nbsp;</a></li>");
document.writeln("        <li id=\'timer\' style='--clr3:#00dc82'><a href='#' data-text='&nbsp;Timer&nbsp;'>&nbsp;Timer&nbsp;</a></li>");
document.writeln("    </ul>");
document.writeln("</div>");

navigatorControl.clock=$('#clock').get(0);
navigatorControl.stopWatch=$('#stopWatch').get(0);
navigatorControl.timer=$('#timer').get(0);
navigatorControl.clock.onclick = clockPage;
navigatorControl.stopWatch.onclick=stopWatchPage;
navigatorControl.timer.onclick=timerPage;
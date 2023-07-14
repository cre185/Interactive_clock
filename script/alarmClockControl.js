var alarmClockControl={};
class alarmClock{
    constructor(){
        this.alarmHour=0;
        this.alarmMinute=0;
        this.alarmSecond=0;
    }
}

alarmClockControl.allAlarmclock=[]
function appendAlarmclock(){
    $('#bar_rightside').append(`
    <div class="block alarmclock_block">
        <p class="alarmclock_target">00:00:00</p>
        <button class="close alarmclock_close"></button>
    </div>
    `);
    $('.alarmclock_block').last().onclick=function(){
        openAlarmclock(alarmClockControl.allAlarmclock.length-1);
    }
    $('.alarmclock_close').last().onclick=function(){
        removeAlarmclock(alarmClockControl.allAlarmclock.length-1);
    }
}
function openAlarmclock(index){
    alarmClockControl.barLeftside.innerHTML="";
    // todo
}
var removeAlarmclock=function(){
    // todo
}
var newAlarmclock=function(){
    var tmpClock=new alarmClock();
    alarmClockControl.allAlarmclock.push(tmpClock);
    appendAlarmclock();
    openAlarmclock(alarmClockControl.allAlarmclock.length-1);
}

window.onload=function(){
    alarmClockControl.barRightside=$('#bar_rightside').get(0);
    alarmClockControl.barLeftside=$('#bar_leftside').get(0);
    alarmClockControl.barCenter=$('#bar_center').get(0);
    alarmClockControl.buttonNewAlarm=$('#button_new_alarmclock').get(0);
    alarmClockControl.buttonNewAlarm.onclick=newAlarmclock;
}
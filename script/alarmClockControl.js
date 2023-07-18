var alarmClockControl={};
function* generateId(){
    for(let i=0;;i++){
        yield i;
    }
}
alarmClockControl.idGenerator=generateId();
class alarmClock{
    constructor(){
        this.time=new time();
        this.id=alarmClockControl.idGenerator.next().value;
    }
}
alarmClockControl.allAlarmclock=[]
function id2index(id){
    let recIndex;
    alarmClockControl.allAlarmclock.find((item,index)=>{
        if(item.id===id){
            recIndex=index;
            return true;
        }
    })
    return recIndex;
}
function appendAlarmclock(){
    $('#bar_rightside').append(`
    <div class="block alarmclock_block">
        <p class="alarmclock_target">00:00:00</p>
        <button class="close alarmclock_close"></button>
    </div>
    `);
    var tmpClock=new alarmClock();
    alarmClockControl.allAlarmclock.push(tmpClock);
    $('.alarmclock_block').last().bind('click',function(){
        openAlarmclock(tmpClock.id);
        return false;
    });
    $('.alarmclock_close').last().bind('click',function(){
        removeAlarmclock(tmpClock.id);
        return false;
    });
}
function openAlarmclock(id){
    closeAlarmclock();
    let alarmClockImg=document.createElement("img");
    alarmClockImg.className="alarmclock_selected";
    alarmClockImg.src="../src/alarmclock_selected.png"
    alarmClockImg.alt="alarmclock_selected";
    $('.alarmclock_block').get(id2index(id)).appendChild(alarmClockImg);
    alarmClockControl.currentAlarmclock=id;
    $('#bar_rightside .alarmclock_block').css("backgroundColor","#e0e0e0");
    $('#bar_rightside .alarmclock_block').get(id2index(id)).style.backgroundColor="white";
    alarmClockControl.barLeftside.innerHTML="";
    $('#bar_leftside').append(`
    <div class="bar_time">
        <div class="bar_time_item">
            <img id="hour_up" src="../src/time_up.png" alt="time_up">
            <p id="hour_setting">00</p>:
            <img id="hour_down" src="../src/time_down.png" alt="time_down">
        </div>
        <div class="bar_time_item">
            <img id="minute_up" src="../src/time_up.png" alt="time_up">
            <p id="minute_setting">00</p>:
            <img id="minute_down" src="../src/time_down.png" alt="time_down">
        </div>
        <div class="bar_time_item">
            <img id="second_up" src="../src/time_up.png" alt="time_up">
            <p id="second_setting">00</p>
            <img id="second_down" src="../src/time_down.png" alt="time_down">
        </div>
    </div>
    `);
    // <div class="bar_buttons">
    //     <button class="bar_button" id="bar_submit">确定</button>
    //     <button class="bar_button" id="bar_cancel">取消</button>
    // </div>
    $('#hour_up').get(0).onclick=function(){
        var tmpClock=alarmClockControl.allAlarmclock[id2index(id)];
        tmpClock.time.hour=(tmpClock.time.hour+1)%24;
        updateAlarmclock();
    }
    $('#hour_down').get(0).onclick=function(){
        var tmpClock=alarmClockControl.allAlarmclock[id2index(id)];
        tmpClock.time.hour=(tmpClock.time.hour+23)%24;
        updateAlarmclock();
    }
    $('#minute_up').get(0).onclick=function(){
        var tmpClock=alarmClockControl.allAlarmclock[id2index(id)];
        tmpClock.time.minute=(tmpClock.time.minute+1)%60;
        updateAlarmclock();
    }
    $('#minute_down').get(0).onclick=function(){
        var tmpClock=alarmClockControl.allAlarmclock[id2index(id)];
        tmpClock.time.minute=(tmpClock.time.minute+59)%60;
        updateAlarmclock();
    }
    $('#second_up').get(0).onclick=function(){
        var tmpClock=alarmClockControl.allAlarmclock[id2index(id)];
        tmpClock.time.second=(tmpClock.time.second+1)%60;
        updateAlarmclock();
    }
    $('#second_down').get(0).onclick=function(){
        var tmpClock=alarmClockControl.allAlarmclock[id2index(id)];
        tmpClock.time.second=(tmpClock.time.second+59)%60;
        updateAlarmclock();
    }
    updateAlarmclock();
}
function closeAlarmclock(){
    if(alarmClockControl.currentAlarmclock!=undefined){
        var tempSelect= document.querySelectorAll('.alarmclock_selected');
        if(tempSelect){//若找到
            remove(tempSelect);
        }
    }
}
function remove (e) {
    if (e) {
        for(var i=0;i<e.length;i++){
            e[i].remove();
        }
        return e;
    }
    return undefined;
 }
function updateAlarmclock(){ // use alarmClockControl.currentAlarmclock as current clock id
    if(alarmClockControl.currentAlarmclock!=undefined){
        var tmpClock=alarmClockControl.allAlarmclock[id2index(alarmClockControl.currentAlarmclock)];
        if(tmpClock.time.hour<10) $('#bar_leftside #hour_setting').get(0).innerHTML="0"+tmpClock.time.hour;
        else $('#bar_leftside #hour_setting').get(0).innerHTML=tmpClock.time.hour;
        if(tmpClock.time.minute<10) $('#bar_leftside #minute_setting').get(0).innerHTML="0"+tmpClock.time.minute;
        else $('#bar_leftside #minute_setting').get(0).innerHTML=tmpClock.time.minute;
        if(tmpClock.time.second<10) $('#bar_leftside #second_setting').get(0).innerHTML="0"+tmpClock.time.second;
        else $('#bar_leftside #second_setting').get(0).innerHTML=tmpClock.time.second;
    }
    var index=id2index(alarmClockControl.currentAlarmclock);
    if(index!=-1){
        var tmpClock=alarmClockControl.allAlarmclock[index];
        $('.alarmclock_target').get(index).innerHTML=tmpClock.time.time2string();
    }
}
var removeAlarmclock=function(id){
    var index=id2index(id);
    $('.alarmclock_block').get(index).remove();
    alarmClockControl.allAlarmclock.splice(index,1);
    if(alarmClockControl.currentAlarmclock===id){
        alarmClockControl.currentAlarmclock=undefined;
        alarmClockControl.barLeftside.innerHTML="";
    }
}
var newAlarmclock=function(){
    appendAlarmclock();
    openAlarmclock(alarmClockControl.allAlarmclock[alarmClockControl.allAlarmclock.length-1].id);
}

window.onload=function(){
    alarmClockControl.barRightside=$('#bar_rightside').get(0);
    alarmClockControl.barLeftside=$('#bar_leftside').get(0);
    alarmClockControl.barCenter=$('#bar_center').get(0);
    alarmClockControl.buttonNewAlarm=$('#button_new_alarmclock').get(0);
    alarmClockControl.buttonNewAlarm.onclick=newAlarmclock;
}
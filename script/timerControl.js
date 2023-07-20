var timerControl={};
timerControl.on=false;
function update(){
    if(global.timerTime.hour==0&&global.timerTime.min==0&&global.timerTime.sec==0&&global.timerTime.mSec==0){
        restartTimer();
        alert("时间到！");
        return;
    }
    //判断是否该停止
    global.timerTime.tick_reverse();
    var h=global.timerTime.hour;
    if(h<10){
        document.querySelector('#count_hour').innerText="0"+h.toString();
    }
    else document.querySelector('#count_hour').innerText=h.toString();
    var m=global.timerTime.min;
    if(m<10){
        document.querySelector('#count_minute').innerText="0"+m.toString();
    }
    else document.querySelector('#count_minute').innerText=m.toString();
    var s=global.timerTime.sec;
    if(s<10){
        document.querySelector('#count_second').innerText="0"+s.toString();
    }
    else document.querySelector('#count_second').innerText=s.toString();

}
function startTimer(){
    timerControl.on=true;
    $('#timer_bar').css('display',"none");
    timerControl.buttonStart.onclick=pauseTimer;
    $('#button_start').css('background',"url(../src/pause.png) no-repeat center center")
    $('#button_start').css('background-size',"50px 50px")
    global.timerTime.hour= parseInt(document.querySelector('#count_hour').innerText);
    global.timerTime.min= parseInt(document.querySelector('#count_minute').innerText);
    global.timerTime.sec= parseInt(document.querySelector('#count_second').innerText);
    // todo: start timer
    // 计时器启动后“启动按钮”的文字由“开始计时”变为“暂停”
    document.getElementById('start').innerText = "暂停";
    clockTick = setInterval(update, 20);
}
function pauseTimer(){
    timerControl.on=false;
    timerControl.buttonStart.onclick=startTimer;
    $('#button_start').css('background',"url(../src/start.png) no-repeat center center")
    $('#button_start').css('background-size',"50px 50px")
    clearInterval(clockTick);
    // todo: pause timer
    // 计时器暂停后“启动按钮”的文字由“暂停”变为“继续”
    document.getElementById('start').innerText = "继续";
}
function restartTimer(){
    timerControl.on=false;
    $('#timer_bar').css('display',"flex");
    timerControl.buttonStart.onclick=startTimer;
    $('#button_start').css('background',"url(../src/start.png) no-repeat center center")
    $('#button_start').css('background-size',"50px 50px")
    clearInterval(clockTick);
    global.timerTime.clear();
    // 计时器取消后“启动按钮”的文字由变为“开始计时”
    document.querySelector('#hour').value="00";
    document.querySelector('#minute').value="00";
    document.querySelector('#second').value="00";
    document.querySelector('#count_hour').innerText="00";
    document.querySelector('#count_minute').innerText="00";
    document.querySelector('#count_second').innerText="00";//初始化
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
    const hourInTimer=document.querySelector('#hour');
    hourInTimer.addEventListener('change',(event)=>{
        document.querySelector('#count_hour').textContent=`${event.target.value}`;
    });
    const minuteInTimer=document.querySelector('#minute');
    minuteInTimer.addEventListener('change',(event)=>{
        document.querySelector('#count_minute').textContent=`${event.target.value}`;
    });
    const secondInTimer=document.querySelector('#second');
    secondInTimer.addEventListener('change',(event)=>{
        document.querySelector('#count_second').textContent=`${event.target.value}`;
    });
}
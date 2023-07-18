var global={};
function int2string(h,m,s){ // return a string like "00:00:00"
    h=parseInt(h);
    m=parseInt(m);
    s=parseInt(s);
    if(h<10) h="0"+h;
    if(m<10) m="0"+m;
    if(s<10) s="0"+s;
    return h+":"+m+":"+s;
}
class time{
    constructor(){
        this.clear();
    }
    clear(){
        this.hour=0;
        this.minute=0;
        this.second=0;
    }
    time2string(){
        return int2string(this.hour,this.minute,this.second);
    }
    diff(t){
        var whole=(this.hour-t.hour)*3600+(this.minute-t.minute)*60+(this.second-t.second);
        var h=parseInt(whole/3600);
        var m=parseInt((whole-h*3600)/60);
        var s=parseInt(whole-h*3600-m*60);
        return int2string(h,m,s);
    }
}

global.globalTime=new time(); // global time used by alarm clock
var mDate=new Date();
global.globalTime.hour=mDate.getHours();
global.globalTime.minute=mDate.getMinutes();
global.globalTime.second=mDate.getSeconds();
global.stopWatchTime=new time(); // time used by stop watch
global.timerTime=new time(); // time used by timer
global.timerTime.minute=3;
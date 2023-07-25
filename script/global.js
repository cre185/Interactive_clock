var global={};
/*function int2string(h,m,s){ // return a string like "00:00:00"
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
}*/

class time{
    constructor(){
        this.hour = 0;
        this.min = 0;
        this.sec = 0;
        this.mSec = 0;
    }

    toString() {
        return (this.hour < 10 ? '0' + this.hour : this.hour) + ':' +
        (this.min < 10 ? '0' + this.min : this.min) + ':' +
        (this.sec < 10 ? '0' + this.sec : this.sec);   
    }

    getHour() {
        return (this.hour < 10 ? "0" : "") + this.hour + " :";
    }

    getMin() {
        return (this.min  < 10 ? "0" : "") + this.min + " :";
    }

    getSec() {
        return (this.sec  < 10 ? "0" : "") + this.sec;
    }

    calHourAngle(){
        return ((this.hour % 12) * 3.6e6 + this.min * 6e4 + this.sec * 1e3 + this.mSec) / 4.32e7 * 360;
    }

    calMinAngle(){
        return (this.min * 6e4 + this.sec * 1e3 + this.mSec) / 3.6e6 * 360;
    }

    calSecAngle(){
        return (this.sec * 1e3 + this.mSec) / 6e4 * 360;
    }

    tick(){
        this.mSec += 20;
        if(this.mSec == 1000){
            this.mSec = 0;
            this.sec++;
        }
        if(this.sec == 60){
            this.sec = 0;
            this.min++;
        }
        if(this.min == 60){
            this.min = 0;
            this.hour++;
            this.hour %= 24;
        }
    }

    tick_reverse(){
        this.mSec -= 20;
        if(this.mSec == -20){
            this.mSec = 980;
            this.sec--;
        }
        if(this.sec == -1){
            this.sec = 59;
            this.min--;
        }
        if(this.min == -1){
            this.min = 59;
            this.hour += 23;
            this.hour %= 24;
        }
    }
    clear(){
        this.hour = 0;
        this.min = 0;
        this.sec = 0;
        this.mSec = 0;
    }
}

global.globalTime=new time(); // global time used by clock
var mDate=new Date();
global.globalTime.hour=mDate.getHours();
global.globalTime.min=mDate.getMinutes();
global.globalTime.sec=mDate.getSeconds();
global.timerTime=new time(); // time used by timer

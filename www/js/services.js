// SERVICES
console.log('Loading services.js');

picalApp.service('settings', function() {
    var self = this;
    this.tzOffsetHours = 10;
    this.tzOffsetSeconds = this.tzOffsetHours * 60 * 60;
    this.minSyncAttempts = "3";
    this.maxSyncAttempts = "0";
    this.nextEventUtc = 0;
    //this.nextEventLocal = this.nextEventUtc + this.tzOffsetSeconds;
    
    this.calcTimeRemaining = function() {
        var now = new Date().getTime();
        var now_seconds = parseInt(now / 1000);
        var now_milliseconds = now - (now_seconds * 1000);
        var secondsRemaining = self.nextEventUtc - now_seconds;
        self.secondsRemaining = secondsRemaining;
        
        var hours = Math.floor(secondsRemaining / 3600);
        if (hours < 10) {
            h = '0' + hours;
        } else {
            h = '' + hours;
        }
        
        var minutes = Math.floor(secondsRemaining / 60);
        var mins = minutes - (hours * 60)
        if (mins < 10) {
            m = '0' + mins;
        } else {
            m = '' + mins;
        }
        
        var seconds = secondsRemaining - (minutes * 60);
        var s = '00';
        if (seconds < 10) {
            s = '0' + seconds;
        } else {
            s = '' + seconds;
        }
        
        var returnString = h + ':' + m + ':' + s; // + '.' + now_milliseconds;
        
        return returnString;
    }
    
    this.timeTillNextEvent = this.calcTimeRemaining();
    console.log(this.timeTillNextEvent);
    
});
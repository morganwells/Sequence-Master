// This function count the time. It is called from the StartSequence.js which tells it how long the timer should run for
// It also runs the functions sent to it every second 
// REFERENCE: https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer


function CountDownTimer(duration, granularity) {
    this.duration = duration;
    this.granularity = granularity || 1000;
    this.tickFtns = [];
    this.running = false;
    this.abandon = false;
}

CountDownTimer.prototype.start = function () {
    if (this.running) {
        return;
    }
    this.running = true;
    var start = Date.now(),
        that = this,
        diff, obj;

    (function timer() {
        diff = that.duration - (((Date.now() - start) / 1000) | 0);

        if (that.abandon) {
            return;
        } else {
            if (diff > 0) {
                setTimeout(timer, that.granularity);
            } else {
                diff = 0;
                that.running = false;
            }

            obj = CountDownTimer.parse(diff);
            that.tickFtns.forEach(function (ftn) {
                ftn.call(this, obj.minutes, obj.seconds);
            }, that);
        }    
    }());
};

CountDownTimer.prototype.onTick = function (ftn) {
    if (typeof ftn === 'function') {
        this.tickFtns.push(ftn);
    }
    return this;
};

CountDownTimer.prototype.expired = function () {
    return !this.running;
};

CountDownTimer.parse = function (seconds) {
    return {
        'minutes': (seconds / 60) | 0,
        'seconds': (seconds % 60) | 0
    };
};


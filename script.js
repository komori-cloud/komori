document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const startBtn = document.getElementById('startBtn');
    const breakBtn = document.getElementById('breakBtn');
    const resetBtn = document.getElementById('resetBtn');
    const statusMessage = document.getElementById('statusMessage');

    const WORK_TIME = 25 * 60; // 25 minutes
    const BREAK_TIME = 5 * 60; // 5 minutes

    let timer;
    let timeLeft = WORK_TIME;
    let isWorking = true;
    let isPaused = true;
    let isEndless = true; // Default to endless

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function updateDisplay() {
        display.textContent = formatTime(timeLeft);
    }

    function startTimer() {
        if (!isPaused) return; // Prevent multiple intervals
        isPaused = false;
        statusMessage.textContent = isWorking ? "Time to focus! 🚀" : "Enjoy your break! ☕";
        
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                clearInterval(timer);
                playAlarmSound(); // Optional: play a sound
                if (isEndless) {
                    if (isWorking) {
                        statusMessage.textContent = "Work's done! Starting break... 🎉";
                        setTimeout(() => startBreak(true), 2000); // Give a moment for message
                    } else {
                        statusMessage.textContent = "Break's over! Starting work... 💪";
                        setTimeout(() => startWork(true), 2000); // Give a moment for message
                    }
                } else {
                    statusMessage.textContent = isWorking ? "Pomodoro session complete!" : "Break complete!";
                    isPaused = true; // Allow restart
                }
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timer);
        isPaused = true;
        statusMessage.textContent = isWorking ? "Work paused." : "Break paused.";
    }

    function resetTimer() {
        clearInterval(timer);
        isPaused = true;
        isWorking = true; // Reset to work mode
        timeLeft = WORK_TIME;
        updateDisplay();
        statusMessage.textContent = "Ready to focus!";
        // You might want to update button states here too
    }

    function startWork(autoStart = false) {
        clearInterval(timer);
        isWorking = true;
        timeLeft = WORK_TIME;
        updateDisplay();
        if (autoStart) {
            isPaused = true; // Set to paused temporarily so startTimer can activate
            startTimer();
        } else {
            isPaused = true;
            statusMessage.textContent = "Ready for a 25-min focus session.";
        }
    }

    function startBreak(autoStart = false) {
        clearInterval(timer);
        isWorking = false;
        timeLeft = BREAK_TIME;
        updateDisplay();
        if (autoStart) {
            isPaused = true; // Set to paused temporarily so startTimer can activate
            startTimer();
        } else {
            isPaused = true;
            statusMessage.textContent = "Ready for a 5-min break.";
        }
    }

    function playAlarmSound() {
        // You'll need an actual audio file for this.
        // For example: <audio id="alarmSound" src="alarm.mp3" preload="auto"></audio> in HTML
        const alarm = new Audio('path/to/your/alarm.mp3'); // Replace with your sound file path
        if (alarm) {
            alarm.play().catch(e => console.error("Error playing sound:", e));
        } else {
            console.warn("Alarm sound element not found or path incorrect.");
        }
    }


    // Event Listeners
    startBtn.addEventListener('click', () => {
        if (!isWorking || isPaused) { // If currently on break or paused on work, start work
            startWork(); // Set to work mode
            startTimer(); // Start the timer
        } else { // If already working, pause it
            pauseTimer();
        }
    });

    breakBtn.addEventListener('click', () => {
        if (isWorking || isPaused) { // If currently working or paused on break, start break
            startBreak(); // Set to break mode
            startTimer(); // Start the timer
        } else { // If already on break, pause it
            pauseTimer();
        }
    });

    resetBtn.addEventListener('click', resetTimer);

    // Initial display update
    updateDisplay();
});
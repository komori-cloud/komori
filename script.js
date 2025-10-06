document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const startBtn = document.getElementById('startBtn');
    const breakBtn = document.getElementById('breakBtn');
    const resetBtn = document.getElementById('resetBtn');
    const statusMessage = document.getElementById('statusMessage');
    const workTimeInput = document.getElementById('workTimeInput');
    const breakTimeInput = document.getElementById('breakTimeInput');
    const adjustWorkUpBtn = document.getElementById('adjustWorkUp');
    const adjustWorkDownBtn = document.getElementById('adjustWorkDown');
    const adjustBreakUpBtn = document.getElementById('adjustBreakUp');
    const adjustBreakDownBtn = document.getElementById('adjustBreakDown');

    let WORK_MINUTES = 25; // Default work time in minutes
    let BREAK_MINUTES = 5; // Default break time in minutes

    let timer;
    let timeLeft;
    let isWorking = true;
    let isPaused = true;
    let isEndless = true; // Default to endless (unchanged)

    // Initial setup based on default minutes
    function initializeTimes() {
        timeLeft = WORK_MINUTES * 60;
        workTimeInput.value = WORK_MINUTES;
        breakTimeInput.value = BREAK_MINUTES;
        updateDisplay();
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    function updateDisplay() {
        display.textContent = formatTime(timeLeft);
    }

    function startTimer() {
        if (!isPaused) return; // Prevent multiple intervals if already running
        isPaused = false;
        startBtn.textContent = "Pause Work"; // Update button text
        breakBtn.textContent = "Pause Break";
        statusMessage.textContent = isWorking ? "Time to focus! 🚀" : "Enjoy your break! ☕";

        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                clearInterval(timer);
                playSoothingAlarm(); // Play the new soothing alarm
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
                    startBtn.textContent = "Start Work (25 min)"; // Reset button text
                    breakBtn.textContent = "Start Break (5 min)";
                }
            }
        }, 1000);
    }

    function pauseTimer() {
        clearInterval(timer);
        isPaused = true;
        startBtn.textContent = isWorking ? "Resume Work" : "Start Work";
        breakBtn.textContent = !isWorking ? "Resume Break" : "Start Break";
        statusMessage.textContent = isWorking ? "Work paused." : "Break paused.";
    }

    function resetTimer() {
        clearInterval(timer);
        isPaused = true;
        isWorking = true; // Reset to work mode
        timeLeft = WORK_MINUTES * 60;
        updateDisplay();
        statusMessage.textContent = "Ready to focus!";
        startBtn.textContent = `Start Work (${WORK_MINUTES} min)`;
        breakBtn.textContent = `Start Break (${BREAK_MINUTES} min)`;
    }

    function startWork(autoStart = false) {
        clearInterval(timer);
        isWorking = true;
        timeLeft = WORK_MINUTES * 60;
        updateDisplay();
        if (autoStart) {
            isPaused = true; // Set to paused temporarily so startTimer can activate
            startTimer();
        } else {
            isPaused = true;
            statusMessage.textContent = `Ready for a ${WORK_MINUTES}-min focus session.`;
            startBtn.textContent = `Start Work (${WORK_MINUTES} min)`;
            breakBtn.textContent = `Start Break (${BREAK_MINUTES} min)`;
        }
    }

    function startBreak(autoStart = false) {
        clearInterval(timer);
        isWorking = false;
        timeLeft = BREAK_MINUTES * 60;
        updateDisplay();
        if (autoStart) {
            isPaused = true; // Set to paused temporarily so startTimer can activate
            startTimer();
        } else {
            isPaused = true;
            statusMessage.textContent = `Ready for a ${BREAK_MINUTES}-min break.`;
            startBtn.textContent = `Start Work (${WORK_MINUTES} min)`;
            breakBtn.textContent = `Start Break (${BREAK_MINUTES} min)`;
        }
    }

    function playSoothingAlarm() {
        // You'll need an actual audio file for this.
        // For example: <audio id="soothingAlarm" src="soothing_alarm.mp3" preload="auto"></audio> in HTML
        const alarm = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'); // Example: A gentle tone, replace with your own
        if (alarm) {
            alarm.volume = 0.5; // Set volume if desired
            alarm.play().catch(e => console.error("Error playing sound:", e));
        } else {
            console.warn("Soothing alarm sound element not found or path incorrect.");
        }
    }

    // Event Listeners for main controls
    startBtn.addEventListener('click', () => {
        if (isWorking && !isPaused) { // If currently working and not paused, pause it
            pauseTimer();
        } else { // If paused or on break, start/resume work
            startWork(true);
        }
    });

    breakBtn.addEventListener('click', () => {
        if (!isWorking && !isPaused) { // If currently on break and not paused, pause it
            pauseTimer();
        } else { // If paused or working, start/resume break
            startBreak(true);
        }
    });

    resetBtn.addEventListener('click', resetTimer);

    // Event Listeners for minute adjustments
    adjustWorkUpBtn.addEventListener('click', () => {
        WORK_MINUTES = Math.min(60, WORK_MINUTES + 1); // Max 60 mins
        workTimeInput.value = WORK_MINUTES;
        if (isWorking && isPaused) { // Only update if currently on work mode and paused
            timeLeft = WORK_MINUTES * 60;
            updateDisplay();
            startBtn.textContent = `Start Work (${WORK_MINUTES} min)`;
        }
        if (!isWorking && isPaused) { // If on break and paused, update work button
             startBtn.textContent = `Start Work (${WORK_MINUTES} min)`;
        }
    });

    adjustWorkDownBtn.addEventListener('click', () => {
        WORK_MINUTES = Math.max(1, WORK_MINUTES - 1); // Min 1 min
        workTimeInput.value = WORK_MINUTES;
        if (isWorking && isPaused) {
            timeLeft = WORK_MINUTES * 60;
            updateDisplay();
            startBtn.textContent = `Start Work (${WORK_MINUTES} min)`;
        }
        if (!isWorking && isPaused) {
             startBtn.textContent = `Start Work (${WORK_MINUTES} min)`;
        }
    });

    adjustBreakUpBtn.addEventListener('click', () => {
        BREAK_MINUTES = Math.min(30, BREAK_MINUTES + 1); // Max 30 mins
        breakTimeInput.value = BREAK_MINUTES;
        if (!isWorking && isPaused) { // Only update if currently on break mode and paused
            timeLeft = BREAK_MINUTES * 60;
            updateDisplay();
            breakBtn.textContent = `Start Break (${BREAK_MINUTES} min)`;
        }
        if (isWorking && isPaused) { // If on work and paused, update break button
            breakBtn.textContent = `Start Break (${BREAK_MINUTES} min)`;
        }
    });

    adjustBreakDownBtn.addEventListener('click', () => {
        BREAK_MINUTES = Math.max(1, BREAK_MINUTES - 1); // Min 1 min
        breakTimeInput.value = BREAK_MINUTES;
        if (!isWorking && isPaused) {
            timeLeft = BREAK_MINUTES * 60;
            updateDisplay();
            breakBtn.textContent = `Start Break (${BREAK_MINUTES} min)`;
        }
        if (isWorking && isPaused) {
            breakBtn.textContent = `Start Break (${BREAK_MINUTES} min)`;
        }
    });

    // Handle direct input changes for robustness (optional, but good)
    workTimeInput.addEventListener('change', () => {
        let val = parseInt(workTimeInput.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 60) val = 60; // Max 60 mins
        WORK_MINUTES = val;
        workTimeInput.value = WORK_MINUTES;
        if (isWorking && isPaused) {
            timeLeft = WORK_MINUTES * 60;
            updateDisplay();
        }
        startBtn.textContent = `Start Work (${WORK_MINUTES} min)`;
    });

    breakTimeInput.addEventListener('change', () => {
        let val = parseInt(breakTimeInput.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 30) val = 30; // Max 30 mins
        BREAK_MINUTES = val;
        breakTimeInput.value = BREAK_MINUTES;
        if (!isWorking && isPaused) {
            timeLeft = BREAK_MINUTES * 60;
            updateDisplay();
        }
        breakBtn.textContent = `Start Break (${BREAK_MINUTES} min)`;
    });

    // Initial display update
    initializeTimes();
});
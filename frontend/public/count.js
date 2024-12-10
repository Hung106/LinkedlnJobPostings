export function startCountdown() {
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 5); // Countdown for 5 days

    const timer = setInterval(() => {
        const now = new Date();
        const timeDiff = endTime - now;

        if (timeDiff <= 0) {
            clearInterval(timer);

            // Check each element and update textContent if the element exists
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');

            if (daysElement) daysElement.textContent = "00";
            if (hoursElement) hoursElement.textContent = "00";
            if (minutesElement) minutesElement.textContent = "00";
            if (secondsElement) secondsElement.textContent = "00";
        } else {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            // Check each element and update textContent if the element exists
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');

            if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
            if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
            if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
            if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
        }
    }, 1000);
}

window.onload = startCountdown;

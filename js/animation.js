const values = [
    { id: "circle1", textIdA: "text1a", target: 12, maxValue: 50 },      // Patents
    { id: "circle2", textIdA: "text2a", target: 2, maxValue: 10 },       // Book Chapters
    { id: "circle3", textIdA: "text3a", target: 24, maxValue: 50 },      // Conference Papers
    { id: "circle4", textIdA: "text4a", target: 29, maxValue: 50 },      // Research Interest Score
    { id: "circle5", textIdA: "text5a", target: 3, maxValue: 10 },       // Citations
    { id: "circle6", textIdA: "text6a", target: 6, maxValue: 10 }        // h-index
];

const maxOffset = 251.2;

function animateValue(circleId, textIdA, targetValue, maxValue, onComplete) {
    let progress = 0;
    const circle = document.getElementById(circleId);
    const textA = document.getElementById(textIdA);
    const isDecimal = (textIdA === "text4a"); // Research Score has decimal

    // Calculate the stroke dashoffset for the target
    const targetPercent = targetValue / maxValue;
    const targetOffset = maxOffset * (1 - targetPercent);

    let interval = setInterval(() => {
        if (progress >= targetValue) {
            clearInterval(interval);
            textA.textContent = isDecimal ? targetValue.toFixed(1) : Math.round(targetValue);
            circle.style.strokeDashoffset = targetOffset;
            if (onComplete) onComplete();
        } else {
            // Smooth easing: progress accelerates then decelerates
            const increment = targetValue / 60; // ~60 frames for smooth animation
            progress += increment;
            if (progress > targetValue) progress = targetValue;

            textA.textContent = isDecimal ? progress.toFixed(1) : Math.round(progress);

            const currentPercent = progress / maxValue;
            const currentOffset = maxOffset * (1 - currentPercent);
            circle.style.strokeDashoffset = currentOffset;
        }
    }, 16); // ~60fps
}

function animateSequentially(index) {
    if (index >= values.length) return;

    const item = values[index];
    animateValue(item.id, item.textIdA, item.target, item.maxValue, () => {
        // Small delay before starting next animation for a nice cascade effect
        setTimeout(() => animateSequentially(index + 1), 150);
    });
}

// Start the sequential animation
animateSequentially(0);
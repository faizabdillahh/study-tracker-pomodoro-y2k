// Study Tracker · Pomodoro & Suara Fokus (Hujan, Pink Noise, Brown Noise)
// Footer: Jam digital & total sesi
"use strict";

/* ================================================================
   DATA SESI (localStorage)
   ================================================================ */
const STORAGE_KEY = "y2k_study_sessions";

function loadSessions() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveSessions(sessions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

/* ================================================================
   TIMER POMODORO
   ================================================================ */
let timerInterval = null;
let remainingSeconds = 25 * 60;
let isRunning = false;
let currentDuration = 25; // menit

const timerDisplay = document.getElementById("timerDisplay");
const startPauseBtn = document.getElementById("startPauseBtn");
const startPauseIcon = document.getElementById("startPauseIcon");
const startPauseText = document.getElementById("startPauseText");
const resetBtn = document.getElementById("resetBtn");
const durationButtons = document.querySelectorAll(".duration-options .btn-retro");
const timerFill = document.getElementById("timerFill");
const CIRCUMFERENCE = 2 * Math.PI * 44; // ≈276.46

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(remainingSeconds);
    const fraction = remainingSeconds / (currentDuration * 60);
    timerFill.style.strokeDashoffset = CIRCUMFERENCE * (1 - fraction);
}

function startTimer() {
    if (remainingSeconds <= 0) return;
    isRunning = true;
    startPauseIcon.textContent = "\u23F8"; // ⏸ (bukan emoji, karakter teks)
    startPauseText.textContent = "Jeda";
    timerInterval = setInterval(() => {
        remainingSeconds--;
        updateTimerDisplay();
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            isRunning = false;
            startPauseIcon.textContent = "\u25B6"; // ▶
            startPauseText.textContent = "Mulai";
            playBeep();
            recordCompletedSession(currentDuration);
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    startPauseIcon.textContent = "\u25B6"; // ▶
    startPauseText.textContent = "Lanjut";
}

function resetTimer(durationMinutes = currentDuration) {
    clearInterval(timerInterval);
    isRunning = false;
    remainingSeconds = durationMinutes * 60;
    currentDuration = durationMinutes;
    updateTimerDisplay();
    startPauseIcon.textContent = "\u25B6"; // ▶
    startPauseText.textContent = "Mulai";
    durationButtons.forEach(btn => {
        const btnMin = parseInt(btn.dataset.minutes, 10);
        btn.classList.toggle("active", btnMin === durationMinutes);
    });
}

function playBeep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 800;
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
}

function recordCompletedSession(minutes) {
    const sessions = loadSessions();
    const now = new Date();
    sessions.push({
        id: Date.now(),
        subject: `Pomodoro ${minutes} menit`,
        duration: minutes,
        date: now.toISOString().split("T")[0]
    });
    saveSessions(sessions);
    renderSessions(sessions);
    updateFooterSessionCount(sessions.length);
}

startPauseBtn.addEventListener("click", () => {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener("click", () => {
    resetTimer(currentDuration);
});

durationButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const minutes = parseInt(btn.dataset.minutes, 10);
        resetTimer(minutes);
    });
});

/* ================================================================
   SUARA AMBIENT (Hujan, Pink Noise, Brown Noise)
   ================================================================ */
let ambientCtx = null;
let currentNodes = [];

function stopAmbient() {
    if (ambientCtx) {
        ambientCtx.close();
        ambientCtx = null;
        currentNodes = [];
    }
    document.querySelectorAll(".ambient-btn").forEach(b => b.setAttribute("aria-pressed", "false"));
    document.querySelectorAll(".ambient-status").forEach(el => el.textContent = "");
}

// Generator pink noise berkualitas tinggi (Voss-McCartney)
function createPinkNoiseBuffer(ctx, duration = 2) {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11;
        b6 = white * 0.115926;
    }
    return buffer;
}

// Brown noise
function createBrownNoiseBuffer(ctx, duration = 2) {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * duration;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
    }
    return buffer;
}

// Hujan multi-layer (realistis)
function playRain(ctx, destination) {
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(destination);

    // Layer 1: pink noise lowpass (fondasi rintik)
    const pinkBuf = createPinkNoiseBuffer(ctx, 2);
    const pinkSrc = ctx.createBufferSource();
    pinkSrc.buffer = pinkBuf;
    pinkSrc.loop = true;
    const pinkFilter = ctx.createBiquadFilter();
    pinkFilter.type = "lowpass";
    pinkFilter.frequency.value = 600;
    const pinkGain = ctx.createGain();
    pinkGain.gain.value = 0.4;
    pinkSrc.connect(pinkFilter).connect(pinkGain).connect(masterGain);
    pinkSrc.start();
    currentNodes.push(pinkSrc);

    // Layer 2: noise bandpass (tetesan halus)
    const bandBuf = createPinkNoiseBuffer(ctx, 2);
    const bandSrc = ctx.createBufferSource();
    bandSrc.buffer = bandBuf;
    bandSrc.loop = true;
    const bandFilter = ctx.createBiquadFilter();
    bandFilter.type = "bandpass";
    bandFilter.frequency.value = 300;
    bandFilter.Q.value = 2.5;
    const bandGain = ctx.createGain();
    bandGain.gain.value = 0.3;
    bandSrc.connect(bandFilter).connect(bandGain).connect(masterGain);
    bandSrc.start();
    currentNodes.push(bandSrc);

    // Layer 3: tetesan individu (impuls acak)
    const dropBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const dropData = dropBuf.getChannelData(0);
    for (let i = 0; i < dropData.length; i++) {
        if (Math.random() < 0.008) {
            const dur = Math.floor(ctx.sampleRate * 0.03);
            for (let j = 0; j < dur && (i + j) < dropData.length; j++) {
                dropData[i + j] = (Math.random() * 2 - 1) * Math.exp(-j / 300);
            }
        }
    }
    const dropSrc = ctx.createBufferSource();
    dropSrc.buffer = dropBuf;
    dropSrc.loop = true;
    const dropGain = ctx.createGain();
    dropGain.gain.value = 0.25;
    dropSrc.connect(dropGain).connect(masterGain);
    dropSrc.start();
    currentNodes.push(dropSrc);
}

// Pink noise murni
function playPinkNoise(ctx, destination) {
    const buffer = createPinkNoiseBuffer(ctx, 2);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = 0.45;
    source.connect(gain).connect(destination);
    source.start();
    currentNodes.push(source);
}

// Brown noise
function playBrownNoise(ctx, destination) {
    const buffer = createBrownNoiseBuffer(ctx, 2);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const gain = ctx.createGain();
    gain.gain.value = 0.4;
    source.connect(gain).connect(destination);
    source.start();
    currentNodes.push(source);
}

function playAmbient(type) {
    stopAmbient();
    ambientCtx = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = ambientCtx.createGain();
    masterGain.gain.value = 0.8;
    masterGain.connect(ambientCtx.destination);

    switch (type) {
        case "rain":
            playRain(ambientCtx, masterGain);
            break;
        case "pink":
            playPinkNoise(ambientCtx, masterGain);
            break;
        case "brown":
            playBrownNoise(ambientCtx, masterGain);
            break;
        default:
            break;
    }

    const btn = document.querySelector(`.ambient-btn[data-sound="${type}"]`);
    if (btn) {
        btn.setAttribute("aria-pressed", "true");
        const statusEl = btn.querySelector(".ambient-status");
        if (statusEl) statusEl.textContent = "ON";
    }
}

document.querySelectorAll(".ambient-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const sound = btn.dataset.sound;
        const isActive = btn.getAttribute("aria-pressed") === "true";
        if (isActive) {
            stopAmbient();
        } else {
            playAmbient(sound);
        }
    });
});

/* ================================================================
   FOOTER (Jam Digital & Total Sesi)
   ================================================================ */
function updateFooterClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const clockEl = document.getElementById("footerClock");
    if (clockEl) {
        clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

function updateFooterSessionCount(count) {
    const countEl = document.getElementById("footerSessionCount");
    if (countEl) {
        countEl.textContent = `${count} sesi`;
    }
}

// Jalankan jam setiap detik dan perbarui segera
setInterval(updateFooterClock, 1000);

/* ================================================================
   RENDER RIWAYAT SESI
   ================================================================ */
function renderSessions(sessions) {
    const listContainer = document.getElementById("sessionList");
    const emptyState = document.getElementById("emptyState");
    if (sessions.length === 0) {
        listContainer.innerHTML = "";
        emptyState.style.display = "block";
        updateFooterSessionCount(0);
        return;
    }
    emptyState.style.display = "none";
    const sorted = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));
    listContainer.innerHTML = sorted.map(session => {
        const dateObj = new Date(session.date);
        const formatted = dateObj.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
        return `
        <div class="session-item">
            <div>
                <div class="session-subject">${escapeHtml(session.subject)}</div>
                <div class="session-meta">${formatted} · ${session.duration} menit</div>
            </div>
            <span class="session-duration">+${session.duration}m</span>
        </div>`;
    }).join("");
    updateFooterSessionCount(sessions.length);
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

/* ================================================================
   INISIALISASI
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {
    updateTimerDisplay();
    updateFooterClock();
    const sessions = loadSessions();
    renderSessions(sessions);
    // Mulai jam tepat setelah render
});
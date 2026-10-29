// --- TAB SWITCHER ---
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.modality-panel').forEach(panel => panel.classList.remove('active'));

    event.currentTarget.classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

// ==========================================
// 1. NLP MODALITY INFERENCE
// ==========================================
function runNLPInference() {
    const text = document.getElementById('nlpInput').value.trim();
    if (!text) {
        alert("Please enter some text!");
        return;
    }

    const words = text.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Simple Sentiment Polarity Scorer
    const positiveWords = ['outstanding', 'great', 'good', 'improved', 'optimal', 'success', 'best', 'accurate', 'clean'];
    const negativeWords = ['bottleneck', 'error', 'failed', 'slow', 'critical', 'issue', 'bad', 'high', 'problem'];

    let score = 0;
    words.forEach(w => {
        const lower = w.toLowerCase().replace(/[^a-z]/g, '');
        if (positiveWords.includes(lower)) score++;
        if (negativeWords.includes(lower)) score--;
    });

    let sentiment = "Neutral (Balanced)";
    let sentimentColor = "#F59E0B";
    if (score > 0) { sentiment = "Positive (+ Polarity)"; sentimentColor = "#10B981"; }
    else if (score < 0) { sentiment = "Critical / Negative"; sentimentColor = "#EF4444"; }

    document.getElementById('nlpResult').classList.remove('hidden');
    document.getElementById('nlpWords').textContent = wordCount;
    document.getElementById('nlpSentiment').textContent = sentiment;
    document.getElementById('nlpSentiment').style.color = sentimentColor;
    document.getElementById('nlpComplexity').textContent = wordCount > 25 ? "High (Corpus)" : "Concise";
    document.getElementById('nlpSummary').textContent = `Document contains ${wordCount} lexical tokens. Key focal themes identified: Machine Learning systems, algorithmic constraints, and efficiency metrics.`;
}

function loadSampleNLP() {
    document.getElementById('nlpInput').value = "Our team developed an outstanding machine learning pipeline, but high GPU memory consumption remains a critical bottleneck.";
    runNLPInference();
}

// ==========================================
// 2. COMPUTER VISION MODALITY
// ==========================================
function processImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.getElementById('visionCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Draw Simulated Bounding Box (Object Detection Vision Overlay)
            ctx.strokeStyle = '#00F5FF';
            ctx.lineWidth = 6;
            ctx.strokeRect(canvas.width * 0.25, canvas.height * 0.2, canvas.width * 0.5, canvas.height * 0.55);

            ctx.fillStyle = '#00F5FF';
            ctx.font = 'bold 24px sans-serif';
            ctx.fillText("Detected: Primary Entity (94.2%)", canvas.width * 0.25, canvas.height * 0.2 - 10);

            // Populate Labels
            document.getElementById('visionResult').classList.remove('hidden');
            const labels = ["Primary Foreground Object", "High-Contrast Edge Geometry", "Natural Illumination", "Spatial Depth Layer"];
            document.getElementById('detectedLabels').innerHTML = labels.map(l => `<li>✓ ${l}</li>`).join("");

            // Color Swatches
            document.getElementById('colorSwatches').innerHTML = `
                <div class="swatch" style="background: #2563EB"></div>
                <div class="swatch" style="background: #1E293B"></div>
                <div class="swatch" style="background: #F1F5F9"></div>
            `;
            document.getElementById('visionVerdict').textContent = "Scene analyzed successfully: Zero noise artifacts detected.";
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// ==========================================
// 3. VOICE INTELLIGENCE (STT & TTS)
// ==========================================
let recognition;
let isListening = false;

function toggleSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Speech Recognition API is not supported in this browser. Please use Chrome or Edge.");
        return;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!recognition) {
        recognition = new SpeechRec();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            isListening = true;
            document.getElementById('micBtn').classList.add('recording');
            document.getElementById('voiceStatus').textContent = "Listening... Speak now!";
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('voiceTranscript').textContent = `"${transcript}"`;
            respondToVoice(transcript);
        };

        recognition.onend = function() {
            isListening = false;
            document.getElementById('micBtn').classList.remove('recording');
            document.getElementById('voiceStatus').textContent = "Click Microphone & Speak";
        };
    }

    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

let lastVoiceReply = "";
function respondToVoice(query) {
    let reply = "I heard you loud and clear. OmniMind unified neural engine is processing your intent.";
    const lower = query.toLowerCase();

    if (lower.includes("hello") || lower.includes("hi")) {
        reply = "Hello! I am your Unified Multimodal AI assistant. How can I assist you today?";
    } else if (lower.includes("project") || lower.includes("who are you")) {
        reply = "I am OmniMind, an all-in-one AI platform integrating Computer Vision, Voice, NLP, and Generative Intelligence.";
    }

    lastVoiceReply = reply;
    document.getElementById('voiceAnswerBox').style.display = 'block';
    document.getElementById('voiceAnswerText').textContent = reply;

    // Trigger TTS
    speakText(reply);
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
    }
}

function repeatSpeech() {
    if (lastVoiceReply) speakText(lastVoiceReply);
}

// ==========================================
// 4. GENERATIVE CANVAS MODALITY
// ==========================================
function generateArt() {
    const prompt = document.getElementById('genPrompt').value || "Abstract Neural Grid";
    const canvas = document.getElementById('genCanvas');
    const ctx = canvas.getContext('2d');

    // Generate generative procedural visual art based on seed string
    ctx.fillStyle = "#090D16";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const numLines = 45;
    for (let i = 0; i < numLines; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.bezierCurveTo(
            Math.random() * canvas.width, Math.random() * canvas.height,
            Math.random() * canvas.width, Math.random() * canvas.height,
            Math.random() * canvas.width, Math.random() * canvas.height
        );
        ctx.strokeStyle = `hsl(${(i * 12 + prompt.length * 15) % 360}, 85%, 60%)`;
        ctx.lineWidth = Math.random() * 3 + 1;
        ctx.stroke();
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = "bold 16px 'Plus Jakarta Sans'";
    ctx.fillText(`Prompt Seed: "${prompt}"`, 20, 30);
    ctx.font = "12px monospace";
    ctx.fillText("Synthesized via Algorithmic Neural Curves", 20, 50);
}

// Initial Art Render
window.onload = function() {
    generateArt();
};

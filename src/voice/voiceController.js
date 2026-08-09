/* =========================================================
AURA — VOICE CONTROLLER
Uses the browser Web Speech API.
========================================================= */


let recognition = null;
let isListening = false;

/* ================= CREATE VOICE RECOGNITION ================= */

export function setupVoiceRecognition(
onCommand
) {

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (!SpeechRecognition) {

    console.error(
        "Speech Recognition is not supported."
    );

    return null;

}


recognition =
    new SpeechRecognition();


recognition.continuous =
    false;


recognition.interimResults =
    false;


recognition.lang =
    "en-US";


recognition.onstart =
    () => {

        isListening = true;

        console.log(
            "🎤 Voice recognition started"
        );

    };


recognition.onresult =
    (event) => {

        const transcript =
            event.results[0][0]
                .transcript
                .toLowerCase();


        console.log(
            "🎤 Heard:",
            transcript
        );


        onCommand(
            transcript
        );

    };


recognition.onerror =
    (event) => {

        console.error(
            "Voice recognition error:",
            event.error
        );

    };


recognition.onend =
    () => {

        isListening = false;

        console.log(
            "🎤 Voice recognition stopped"
        );

    };


return recognition;

}

/* ================= START LISTENING ================= */

export function startListening() {

    if (!recognition) {

        console.error(
            "Voice recognition not initialized."
        );

        return;

    }

    if (isListening) {

        console.log(
            "🎤 Voice recognition is already running."
        );

        return;

    }

    recognition.start();

}
import "../styles/main.css";

import {
    createHandTracker,
    detectHands
} from "./hand/handTracker.js";

import {
    detectGesture
} from "./hand/gestureEngine.js";

import {
    moveObjectWithHand,
    resizeObjectWithPinch,
    rotateObjectWithHand,

    moveObjectWithTwoHands,
    resizeObjectWithTwoHands,
    rotateObjectWithTwoHands,

    handleObjectGesture,
    showObject,
    hideObject,

    getControlledObject,
    getObjectStatus,

    resizeObjectByVoice,
    moveObjectByVoice,
    rotateObjectByVoice

} from "./ar/objectController.js";

import {
    createARScene,
    loadDynamicObject
} from "./ar/scene.js";

import {
    setupVoiceRecognition,
    startListening
} from "./voice/voiceController.js";

import {
    parseCommand
} from "./ai/commandParser.js";


/* =========================================================
AURA STATE
STAGE 10.1 → 10.7
========================================================= */

const state = {

    cameraReady: false,

    handDetected: false,

    handCount: 0,

    currentGesture: "WAITING",

    currentObject: null,

    objectVisible: false,

    voiceCommand: "",

    aiMessage: "READY",

    voiceVisibilityOverride: false

};


/* =========================================================
ELEMENTS
========================================================= */

const elements = {

    camera:
        document.getElementById("camera"),

    arCanvas:
        document.getElementById("arCanvas"),

    systemStatus:
        document.getElementById("systemStatus"),

    handStatus:
        document.getElementById("handStatus"),

    objectStatus:
        document.getElementById(
            "objectStatus"
        ),

    objectName:
        document.getElementById(
            "objectName"
        ),

    objectDescription:
        document.getElementById(
            "objectDescription"
        ),
    gestureStatus:
        document.getElementById("gestureStatus"),

    gestureName:
        document.getElementById("gestureName"),

    aiStatus:
        document.getElementById("aiStatus"),

    voiceText:
        document.getElementById("voiceText"),

    welcome:
        document.getElementById("welcome"),

    voiceButton:
        document.getElementById("voiceButton")

};


/* =========================================================
CAMERA
========================================================= */

async function startCamera() {

    try {

        const stream =
            await navigator.mediaDevices
                .getUserMedia({

                    video: {

                        width: {
                            ideal: 1280
                        },

                        height: {
                            ideal: 720
                        },

                        facingMode: "user"

                    },

                    audio: false

                });


        elements.camera.srcObject =
            stream;


        await elements.camera.play();


        state.cameraReady =
            true;


        elements.systemStatus.textContent =
            "CAMERA READY";


    }

    catch (error) {

        console.error(
            "Camera error:",
            error
        );


        elements.systemStatus.textContent =
            "CAMERA ERROR";

    }

}


/* =========================================================
OBJECT PANEL
========================================================= */

/* =========================================================
10.7 — LIVE OBJECT PANEL
Updates BOTH:

1. Bottom OBJECT status
2. Right-side OBJECT card
========================================================= */

function updateObjectPanel() {

    const status =
        getObjectStatus();


    /* =====================================================
    NO OBJECT
    ===================================================== */

    if (
        !status.exists
    ) {

        state.currentObject =
            null;

        state.objectVisible =
            false;


        /* ---------- Bottom status ---------- */

        if (
            elements.objectStatus
        ) {

            elements.objectStatus.textContent =
                "—";

        }


        /* ---------- Right panel ---------- */

        if (
            elements.objectName
        ) {

            elements.objectName.textContent =
                "—";

        }


        if (
            elements.objectDescription
        ) {

            elements.objectDescription.textContent =
                "No object detected.";

        }


        return;

    }


    /* =====================================================
    ACTUAL OBJECT
    ===================================================== */

    const objectName =
        status.name ||
        "3D Object";


    state.currentObject =
        objectName;


    state.objectVisible =
        status.visible;


    const displayName =
        objectName.toUpperCase();


    /* =====================================================
    BOTTOM OBJECT STATUS
    ===================================================== */

    if (
        elements.objectStatus
    ) {

        if (
            status.visible
        ) {

            elements.objectStatus.textContent =
                "● " +
                displayName;

        }

        else {

            elements.objectStatus.textContent =
                "○ " +
                displayName +
                " — HIDDEN";

        }

    }


    /* =====================================================
    RIGHT-SIDE OBJECT NAME
    ===================================================== */

    if (
        elements.objectName
    ) {

        elements.objectName.textContent =
            displayName;

    }


    /* =====================================================
    RIGHT-SIDE OBJECT DESCRIPTION
    ===================================================== */

    if (
        elements.objectDescription
    ) {

        if (
            status.visible
        ) {

            elements.objectDescription.textContent =
                "3D " +
                objectName +
                " is active and ready.";

        }

        else {

            elements.objectDescription.textContent =
                "3D " +
                objectName +
                " is hidden.";

        }

    }

}

/* =========================================================
UI
========================================================= */

function updateUI() {

    if (!elements.handStatus) {

        return;

    }


    elements.handStatus.textContent =
        state.handDetected
            ? state.handCount +
              " HAND" +
              (
                  state.handCount > 1
                      ? "S"
                      : ""
              ) +
              " DETECTED"
            : "SEARCHING";


    elements.gestureStatus.textContent =
        state.currentGesture;


    elements.gestureName.textContent =
        state.currentGesture;


    elements.voiceText.textContent =
        state.voiceCommand ||
        "Say something...";


    elements.aiStatus.textContent =
        state.aiMessage;


    updateObjectPanel();


    if (
        state.handDetected &&
        elements.welcome
    ) {

        elements.welcome.style.display =
            "none";

    }

}


/* =========================================================
HAND TRACKING
========================================================= */

let lastVideoTime = -1;

let lastGestureForObject =
    "WAITING";


async function startHandTracking() {

    try {

        await createHandTracker();


        console.log(
            "✋ Two-hand tracking started"
        );


        function processHands() {

            if (
                elements.camera.readyState >=
                HTMLMediaElement.HAVE_CURRENT_DATA
            ) {

                const currentTime =
                    performance.now();


                if (
                    elements.camera.currentTime !==
                    lastVideoTime
                ) {

                    const results =
                        detectHands(
                            elements.camera,
                            currentTime
                        );


                    lastVideoTime =
                        elements.camera.currentTime;


                    /* =================================================
                    NO HAND
                    ================================================= */

                    if (
                        !results ||
                        !results.landmarks ||
                        results.landmarks.length === 0
                    ) {

                        state.handDetected =
                            false;

                        state.handCount =
                            0;

                        state.currentGesture =
                            "WAITING";

                        lastGestureForObject =
                            "WAITING";

                    }


                    /* =================================================
                    HANDS FOUND
                    ================================================= */

                    else {

                        const hands =
                            results.landmarks;


                        state.handDetected =
                            true;


                        state.handCount =
                            hands.length;


                        /* =================================================
                        FIRST HAND GESTURE
                        ================================================= */

                        const firstGesture =
                            detectGesture(
                                hands[0]
                            );


                        state.currentGesture =
                            firstGesture;


                        /* =================================================
                        SHOW / HIDE
                        ================================================= */

                        if (
                            (
                                firstGesture ===
                                "FIST"

                                ||

                                firstGesture ===
                                "OPEN PALM"
                            )

                            &&

                            firstGesture !==
                            lastGestureForObject
                        ) {

                            if (
                                !state.voiceVisibilityOverride
                            ) {

                                handleObjectGesture(
                                    firstGesture
                                );

                            }


                            lastGestureForObject =
                                firstGesture;

                        }


                        /* =================================================
                        TWO HAND CONTROL
                        ================================================= */

                        if (
                            hands.length >= 2
                        ) {

                            const hand1 =
                                hands[0];

                            const hand2 =
                                hands[1];


                            /*
                                TWO HANDS:

                                🤲 Move
                                ↔️ Resize
                                🔄 Rotate
                            */

                            moveObjectWithTwoHands(
                                hand1,
                                hand2
                            );


                            resizeObjectWithTwoHands(
                                hand1,
                                hand2
                            );


                            rotateObjectWithTwoHands(
                                hand1,
                                hand2
                            );


                            console.log(
                                "🤲 TWO-HAND CONTROL ACTIVE"
                            );

                        }


                        /* =================================================
                        ONE HAND FALLBACK
                        ================================================= */

                        else if (
                            hands.length === 1
                        ) {

                            const landmarks =
                                hands[0];


                            moveObjectWithHand(
                                landmarks
                            );


                            resizeObjectWithPinch(
                                landmarks
                            );


                            rotateObjectWithHand(
                                landmarks
                            );

                        }

                    }


                    updateUI();

                }

            }


            requestAnimationFrame(
                processHands
            );

        }


        processHands();

    }

    catch (error) {

        console.error(
            "Hand tracking error:",
            error
        );


        state.handDetected =
            false;

        state.handCount =
            0;

        state.currentGesture =
            "ERROR";

        state.aiMessage =
            "HAND ERROR";


        updateUI();

    }

}


/* =========================================================
AURA AI RESPONSE
========================================================= */

function speakAI(message) {

    state.aiMessage =
        message;


    console.log(
        "🤖 AURA:",
        message
    );


    updateUI();

}


/* =========================================================
VOICE
========================================================= */

function setupVoice() {

    setupVoiceRecognition(

        async (command) => {

            console.log(
                "🧠 AURA command:",
                command
            );


            state.voiceCommand =
                command;


            state.aiMessage =
                "PROCESSING";


            updateUI();


            const parsedCommand =
                parseCommand(
                    command
                );


            console.log(
                "🧠 Parsed command:",
                parsedCommand
            );


            /* =================================================
            SHOW OBJECT
            ================================================= */

            if (
                parsedCommand.action ===
                "SHOW_OBJECT"
            ) {

                state.voiceVisibilityOverride =
                    true;


                const objectName =
                    parsedCommand.object;


                if (
                    objectName ===
                    "earth"
                ) {

                    showObject();


                    state.currentObject =
                        "earth";


                    speakAI(
                        "Earth is ready."
                    );

                }


                else {

                    try {

                        const object =
                            await loadDynamicObject(
                                objectName
                            );


                        
                        if (object) {

                            const actualName =
                                object.userData?.auraObjectName ||
                                object.name ||
                                objectName;

                            state.currentObject =
                                actualName;

                            state.objectVisible =
                                object.visible;

                            state.aiMessage =
                                actualName.toUpperCase() +
                                " READY";

                            console.log(
                                "🎮 Actual controlled object:",
                                actualName
                            );

                            speakAI(
                                objectName +
                                " is ready."
                            );

                        }

                        else {

                            speakAI(
                                "I couldn't find a 3D model for " +
                                objectName +
                                "."
                            );

                        }

                    }

                    catch (error) {

                        console.error(
                            error
                        );


                        speakAI(
                            "There was a problem loading " +
                            objectName +
                            "."
                        );

                    }

                }


                state.voiceVisibilityOverride =
                    false;


                updateUI();

                return;

            }


            /* =================================================
            HIDE
            ================================================= */

            if (
                parsedCommand.action ===
                "HIDE_OBJECT"
            ) {

                hideObject();


                speakAI(
                    "Object hidden."
                );


                updateUI();

                return;

            }


            /* =================================================
            HIDE CURRENT
            ================================================= */

            if (
                parsedCommand.action ===
                "HIDE_CURRENT"
            ) {

                const success =
                    hideObject();


                speakAI(
                    success
                        ? "Current object hidden."
                        : "There is no active object."
                );


                updateUI();

                return;

            }


            /* =================================================
            SHOW CURRENT
            ================================================= */

            if (
                parsedCommand.action ===
                "SHOW_CURRENT"
            ) {

                const success =
                    showObject();


                speakAI(
                    success
                        ? "Current object shown."
                        : "There is no active object."
                );


                updateUI();

                return;

            }


            /* =================================================
            RESIZE
            ================================================= */

            if (
                parsedCommand.action ===
                "RESIZE_OBJECT"
            ) {

                const success =
                    resizeObjectByVoice(
                        parsedCommand.direction
                    );


                speakAI(

                    success

                        ? (
                            parsedCommand.direction ===
                            "BIGGER"

                                ? "Making it bigger."

                                : "Making it smaller."
                        )

                        : "There is no active object to resize."

                );


                updateUI();

                return;

            }


            /* =================================================
            MOVE
            ================================================= */

            if (
                parsedCommand.action ===
                "MOVE_OBJECT"
            ) {

                const success =
                    moveObjectByVoice(
                        parsedCommand.direction
                    );


                speakAI(

                    success

                        ? "Moving it " +
                          parsedCommand.direction
                              .toLowerCase() +
                          "."

                        : "There is no active object to move."

                );


                updateUI();

                return;

            }


            /* =================================================
            ROTATE
            ================================================= */

            if (
                parsedCommand.action ===
                "ROTATE_OBJECT"
            ) {

                const success =
                    rotateObjectByVoice();


                speakAI(

                    success

                        ? "Rotating the object."

                        : "There is no active object to rotate."

                );


                updateUI();

                return;

            }


            /* =================================================
            CURRENT OBJECT
            ================================================= */

            if (
                parsedCommand.action ===
                "CURRENT_OBJECT"
            ) {

                const object =
                    getControlledObject();


                if (object) {

                    const name =
                        object
                            .userData
                            .auraObjectName ||
                        "3D object";


                    speakAI(
                        "The active object is " +
                        name +
                        "."
                    );

                }

                else {

                    speakAI(
                        "There is no active object."
                    );

                }


                updateUI();

                return;

            }


            /* =================================================
            UNKNOWN
            ================================================= */

            speakAI(
                "I didn't understand that command."
            );

        }

    );


    /* =========================================================
    VOICE BUTTON
    ========================================================= */

    elements.voiceButton
        .addEventListener(
            "click",
            () => {

                state.voiceCommand =
                    "Listening...";


                state.aiMessage =
                    "LISTENING";


                updateUI();


                startListening();

            }
        );

}


/* =========================================================
INIT
========================================================= */

async function initialize() {

    console.log(
        "✦ AURA initializing..."
    );


    setupVoice();


    await startCamera();


    createARScene(
        elements.arCanvas
    );


    updateUI();


    await startHandTracking();


    console.log(
        "✦ AURA READY"
    );


    speakAI(
        "AURA READY"
    );

}


initialize();


/* =========================================================
LIVE OBJECT PANEL REFRESH
IMPORTANT STAGE 10.7 FIX
========================================================= */

setInterval(
    () => {

        updateObjectPanel();

    },
    200
);
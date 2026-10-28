/* =========================================================
AURA — GESTURE ENGINE
Uses MediaPipe's 21 hand landmarks
========================================================= */

/* ================= LANDMARK INDEXES ================= */

const THUMB_TIP = 4;
const INDEX_TIP = 8;
const INDEX_PIP = 6;
const MIDDLE_TIP = 12;
const MIDDLE_PIP = 10;
const RING_TIP = 16;
const RING_PIP = 14;
const PINKY_TIP = 20;
const PINKY_PIP = 18;

/* ================= DISTANCE ================= */

function distance(pointA, pointB) {

const x =
    pointA.x - pointB.x;

const y =
    pointA.y - pointB.y;

const z =
    (pointA.z || 0) -
    (pointB.z || 0);

return Math.sqrt(
    x * x +
    y * y +
    z * z
);

}

/* ================= FINGER EXTENSION ================= */

function isFingerExtended(
landmarks,
tipIndex,
pipIndex
) {

const tip =
    landmarks[tipIndex];

const pip =
    landmarks[pipIndex];

return tip.y < pip.y;

}

/* ================= GESTURE DETECTION ================= */

export function detectGesture(
landmarks
) {
    console.log(
    "🧠 Gesture detection started"
);

if (
    !landmarks ||
    landmarks.length !== 21
) {
    console.log(
    "Gesture → WAITING");
    return "WAITING";

}


/* ---------- PINCH ---------- */

const pinchDistance =
    distance(
        landmarks[THUMB_TIP],
        landmarks[INDEX_TIP]
    );


if (pinchDistance < 0.07) {
    console.log(
    "Gesture → PINCH");
    return "PINCH";

}


/* ---------- FINGER STATES ---------- */

const indexExtended =
    isFingerExtended(
        landmarks,
        INDEX_TIP,
        INDEX_PIP
    );


const middleExtended =
    isFingerExtended(
        landmarks,
        MIDDLE_TIP,
        MIDDLE_PIP
    );


const ringExtended =
    isFingerExtended(
        landmarks,
        RING_TIP,
        RING_PIP
    );


const pinkyExtended =
    isFingerExtended(
        landmarks,
        PINKY_TIP,
        PINKY_PIP
    );


/* ---------- OPEN PALM ---------- */

if (
    indexExtended &&
    middleExtended &&
    ringExtended &&
    pinkyExtended
) {
    console.log(
    "Gesture → OPEN PALM");
    return "OPEN PALM";

}


/* ---------- POINT ---------- */

if (
    indexExtended &&
    !middleExtended &&
    !ringExtended &&
    !pinkyExtended
) {
    console.log(
    "Gesture → POINT");
    return "POINT";

}


/* ---------- FIST ---------- */

if (
    !indexExtended &&
    !middleExtended &&
    !ringExtended &&
    !pinkyExtended
) {
    console.log(
    "Gesture → FIST"
    );
    return "FIST";

}

console.log(
    "Gesture → UNKNOWN"
);
return "UNKNOWN";

}
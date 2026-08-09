/* =========================================================
AURA — 3D OBJECT CONTROLLER
STAGE 10.1 → 10.7
FINAL TWO-HAND VERSION

Supports:
✋ Two-hand movement
🤲 Two-hand resize
🔄 Two-hand rotation
✊ Hide
🖐️ Show
🎤 Voice control
📊 Live object status
========================================================= */

let controlledObject = null;

/* =========================================================
STAGE 12.1 — OBJECT MEMORY
========================================================= */

const objectMemory = new Map();
/* =========================================================
SET CONTROLLED OBJECT
========================================================= */

export function setControlledObject(object) {

    /* ---------- Hide previous ---------- */

    if (
        controlledObject &&
        controlledObject !== object
    ) {

        controlledObject.visible = false;

        console.log(
            "👻 Previous object hidden:",
            controlledObject.userData?.auraObjectName
        );

    }


    controlledObject = object;


    if (!controlledObject) {

        console.log(
            "⚠️ Controlled object cleared"
        );

        return;

    }


    /* =====================================================
    OBJECT NAME
    ===================================================== */

    if (
        !controlledObject.userData.auraObjectName
    ) {

        controlledObject.userData.auraObjectName =
            controlledObject.name ||
            "3D Object";

    }


    /* =====================================================
    BASE SCALE
    ===================================================== */

    if (
        !controlledObject.userData.auraBaseScale
    ) {

        controlledObject.userData.auraBaseScale =
            controlledObject.scale.x;

    }


    /* =====================================================
    INITIAL POSITION
    ===================================================== */

    if (
        !controlledObject.userData.auraInitialPosition
    ) {

        controlledObject.userData.auraInitialPosition = {

            x: controlledObject.position.x,
            y: controlledObject.position.y,
            z: controlledObject.position.z

        };

    }


    /* =====================================================
    SHOW
    ===================================================== */

    controlledObject.visible = true;


    console.log(
        "🎮 AURA active object:",
        controlledObject
            .userData
            .auraObjectName
    );

}


/* =========================================================
GET CONTROLLED OBJECT
========================================================= */

export function getControlledObject() {

    return controlledObject;

}

/* =========================================================
SAVE OBJECT MEMORY
========================================================= */

export function saveObjectMemory() {

    if (!controlledObject) {

        console.log(
            "⚠️ No object to save."
        );

        return false;

    }

    const name =
        controlledObject
            .userData
            .auraObjectName ||
        controlledObject.name ||
        "3D Object";


    objectMemory.set(
        name.toLowerCase(),
        {

            position: {

                x: controlledObject.position.x,
                y: controlledObject.position.y,
                z: controlledObject.position.z

            },

            scale: {

                x: controlledObject.scale.x,
                y: controlledObject.scale.y,
                z: controlledObject.scale.z

            },

            rotation: {

                x: controlledObject.rotation.x,
                y: controlledObject.rotation.y,
                z: controlledObject.rotation.z

            },

            visible:
                controlledObject.visible

        }
    );


    console.log(
        "💾 Object memory saved:",
        name
    );


    return true;

}
/* =========================================================
RESTORE OBJECT MEMORY
========================================================= */

export function restoreObjectMemory() {

    if (!controlledObject) {

        console.log(
            "⚠️ No active object."
        );

        return false;

    }


    const name =
        controlledObject
            .userData
            .auraObjectName ||
        controlledObject.name ||
        "3D Object";


    const memory =
        objectMemory.get(
            name.toLowerCase()
        );


    if (!memory) {

        console.log(
            "⚠️ No memory found for:",
            name
        );

        return false;

    }


    /* ---------- Restore position ---------- */

    controlledObject.position.set(

        memory.position.x,
        memory.position.y,
        memory.position.z

    );


    /* ---------- Restore scale ---------- */

    controlledObject.scale.set(

        memory.scale.x,
        memory.scale.y,
        memory.scale.z

    );


    /* ---------- Restore rotation ---------- */

    controlledObject.rotation.set(

        memory.rotation.x,
        memory.rotation.y,
        memory.rotation.z

    );


    /* ---------- Restore visibility ---------- */

    controlledObject.visible =
        memory.visible;


    console.log(
        "🧠 Object memory restored:",
        name
    );


    return true;

}
/* =========================================================
GET OBJECT STATUS
========================================================= */

export function getObjectStatus() {

    if (!controlledObject) {

        return {

            exists: false,
            name: null,
            visible: false

        };

    }


    return {

        exists: true,

        name:
            controlledObject
                .userData
                .auraObjectName || controlledObject.name ||
            "3D Object",

        visible:
            controlledObject.visible

    };

}


/* =========================================================
TWO-HAND MOVE
========================================================= */

export function moveObjectWithTwoHands(
    hand1,
    hand2
) {

    if (
        !controlledObject ||
        !controlledObject.visible ||
        !hand1 ||
        !hand2
    ) {

        return;

    }


    const palm1 = hand1[9];
    const palm2 = hand2[9];


    /* ---------- Midpoint between hands ---------- */

    const centerX =
        (palm1.x + palm2.x) / 2;

    const centerY =
        (palm1.y + palm2.y) / 2;


    const targetX =
        (0.5 - centerX) * 10;

    const targetY =
        (0.5 - centerY) * 10;


    /* ---------- Smooth movement ---------- */

    controlledObject.position.x +=
        (
            targetX -
            controlledObject.position.x
        ) * 0.35;


    controlledObject.position.y +=
        (
            targetY -
            controlledObject.position.y
        ) * 0.35;

}


/* =========================================================
TWO-HAND RESIZE
========================================================= */

export function resizeObjectWithTwoHands(
    hand1,
    hand2
) {

    if (
        !controlledObject ||
        !controlledObject.visible ||
        !hand1 ||
        !hand2
    ) {

        return;

    }


    const point1 =
        hand1[9];

    const point2 =
        hand2[9];


    const dx =
        point1.x -
        point2.x;

    const dy =
        point1.y -
        point2.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    /*
        Distance between two palms.

        Small distance  → smaller object
        Large distance  → larger object
    */

    const minDistance = 0.12;
    const maxDistance = 0.75;


    const normalized =
        Math.max(
            0,
            Math.min(
                1,
                (
                    distance -
                    minDistance
                ) /
                (
                    maxDistance -
                    minDistance
                )
            )
        );


    const minMultiplier = 0.50;
    const maxMultiplier = 2.50;


    const multiplier =
        minMultiplier +
        (
            maxMultiplier -
            minMultiplier
        ) *
        normalized;


    const baseScale =
        controlledObject
            .userData
            .auraBaseScale ||
        1;


    const targetScale =
        baseScale *
        multiplier;


    const currentScale =
        controlledObject.scale.x;


    const smoothScale =
        currentScale +
        (
            targetScale -
            currentScale
        ) * 0.15;


    controlledObject.scale.set(
        smoothScale,
        smoothScale,
        smoothScale
    );

}


/* =========================================================
TWO-HAND ROTATION
========================================================= */

export function rotateObjectWithTwoHands(
    hand1,
    hand2
) {

    if (
        !controlledObject ||
        !controlledObject.visible ||
        !hand1 ||
        !hand2
    ) {

        return;

    }


    const point1 =
        hand1[9];

    const point2 =
        hand2[9];


    const dx =
        point2.x -
        point1.x;

    const dy =
        point2.y -
        point1.y;


    const angle =
        Math.atan2(
            dy,
            dx
        );


    const targetRotation =
        -angle;


    const currentRotation =
        controlledObject.rotation.z;


    /* ---------- Smooth rotation ---------- */

    controlledObject.rotation.z +=
        (
            targetRotation -
            currentRotation
        ) * 0.20;

}


/* =========================================================
SINGLE HAND MOVE
========================================================= */

export function moveObjectWithHand(
    landmarks
) {

    if (
        !controlledObject ||
        !controlledObject.visible ||
        !landmarks
    ) {

        return;

    }


    const palm =
        landmarks[9];


    const targetX =
        (0.5 - palm.x) * 10;

    const targetY =
        (0.5 - palm.y) * 10;


    controlledObject.position.x +=
        (
            targetX -
            controlledObject.position.x
        ) * 0.40;


    controlledObject.position.y +=
        (
            targetY -
            controlledObject.position.y
        ) * 0.40;

}


/* =========================================================
SINGLE HAND PINCH RESIZE
========================================================= */

export function resizeObjectWithPinch(
    landmarks
) {

    if (
        !controlledObject ||
        !controlledObject.visible ||
        !landmarks
    ) {

        return;

    }


    const thumb =
        landmarks[4];

    const index =
        landmarks[8];


    const dx =
        thumb.x -
        index.x;

    const dy =
        thumb.y -
        index.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const minDistance = 0.03;
    const maxDistance = 0.30;


    const normalized =
        Math.max(
            0,
            Math.min(
                1,
                (
                    distance -
                    minDistance
                ) /
                (
                    maxDistance -
                    minDistance
                )
            )
        );


    const multiplier =
        0.50 +
        2.00 * normalized;


    const baseScale =
        controlledObject
            .userData
            .auraBaseScale ||
        1;


    const targetScale =
        baseScale *
        multiplier;


    const currentScale =
        controlledObject.scale.x;


    const smoothScale =
        currentScale +
        (
            targetScale -
            currentScale
        ) * 0.15;


    controlledObject.scale.set(
        smoothScale,
        smoothScale,
        smoothScale
    );

}


/* =========================================================
SINGLE HAND ROTATION
========================================================= */

export function rotateObjectWithHand(
    landmarks
) {

    if (
        !controlledObject ||
        !controlledObject.visible ||
        !landmarks
    ) {

        return;

    }


    const wrist =
        landmarks[0];

    const middle =
        landmarks[9];


    const dx =
        middle.x -
        wrist.x;

    const dy =
        middle.y -
        wrist.y;


    const angle =
        Math.atan2(
            dy,
            dx
        );


    controlledObject.rotation.z +=
        (
            -angle -
            controlledObject.rotation.z
        ) * 0.20;

}


/* =========================================================
HAND SHOW / HIDE
========================================================= */

export function handleObjectGesture(
    gesture
) {

    if (!controlledObject) {

        return;

    }


    if (
        gesture === "FIST"
    ) {

        controlledObject.visible =
            false;

        console.log(
            "✊ Hidden:",
            controlledObject
                .userData
                .auraObjectName
        );

    }


    else if (
        gesture === "OPEN PALM"
    ) {

        controlledObject.visible =
            true;

        console.log(
            "🖐️ Shown:",
            controlledObject
                .userData
                .auraObjectName
        );

    }

}


/* =========================================================
VOICE SHOW
========================================================= */

export function showObject() {

    if (!controlledObject) {

        return false;

    }


    controlledObject.visible = true;


    controlledObject.position.set(
        0,
        0,
        controlledObject.position.z
    );


    return true;

}


/* =========================================================
VOICE HIDE
========================================================= */

export function hideObject() {

    if (!controlledObject) {

        return false;

    }


    controlledObject.visible = false;

    return true;

}


/* =========================================================
VOICE RESIZE
========================================================= */

export function resizeObjectByVoice(
    direction
) {

    if (!controlledObject) {

        return false;

    }


    const baseScale =
        controlledObject
            .userData
            .auraBaseScale ||
        1;


    let newScale =
        controlledObject.scale.x;


    if (
        direction === "BIGGER"
    ) {

        newScale *= 1.30;

    }

    else {

        newScale *= 0.70;

    }


    newScale =
        Math.max(
            baseScale * 0.50,
            Math.min(
                baseScale * 3.00,
                newScale
            )
        );


    controlledObject.scale.set(
        newScale,
        newScale,
        newScale
    );


    return true;

}


/* =========================================================
VOICE MOVE
========================================================= */

export function moveObjectByVoice(
    direction
) {

    if (!controlledObject) {

        return false;

    }


    const amount = 0.50;


    if (direction === "LEFT") {

        controlledObject.position.x -= amount;

    }

    else if (direction === "RIGHT") {

        controlledObject.position.x += amount;

    }

    else if (direction === "UP") {

        controlledObject.position.y += amount;

    }

    else if (direction === "DOWN") {

        controlledObject.position.y -= amount;

    }

    else {

        return false;

    }


    return true;

}


/* =========================================================
VOICE ROTATE
========================================================= */

export function rotateObjectByVoice() {

    if (!controlledObject) {

        return false;

    }


    controlledObject.rotation.y +=
        Math.PI / 6;


    return true;

}

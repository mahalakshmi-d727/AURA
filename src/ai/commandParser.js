/* =========================================================
AURA — SMART AI COMMAND PARSER
Stage 11.1
OBJECT MEMORY

Understands:

SHOW
HIDE
RESIZE
MOVE
ROTATE
CURRENT OBJECT
PREVIOUS OBJECT
SHOW AGAIN
HIDE IT

========================================================= */

export function parseCommand(command) {
    console.log("🤖 CommandParser Input:", command);

    const text =
        command
            .toLowerCase()
            .trim();


    /* =====================================================
    OBJECT NAMES
    ===================================================== */

    const objects = [

        "earth",
        "rose",
        "chair",
        "car",
        "table",
        "ball",
        "book",
        "cow",
        "cup",
        "doll",
        "horse",
        "house",
        "microphone",
        "bottle"

    ];


    /* =====================================================
    DETECT OBJECT
    ===================================================== */

    let detectedObject =
        null;


    for (
        const objectName of objects
    ) {

        if (
            text.includes(
                objectName
            )
        ) {

            detectedObject =
                objectName;

            break;

        }

    }


    /* =====================================================
    MEMORY WORDS
    ===================================================== */

    const refersToMemory =

        text.includes("it") ||

        text.includes("that") ||

        text.includes("again") ||

        text.includes("previous") ||

        text.includes("last object") ||

        text.includes("remembered object");


    /* =====================================================
    SHOW NAMED OBJECT
    ===================================================== */

    if (
        text.includes("show") ||
        text.includes("display") ||
        text.includes("bring") ||
        text.includes("give me") ||
        text.includes("i want to see") ||
        text.includes("let me see") ||
        text.includes("put")
    ) {

        /* ---------- Specific object ---------- */

        if (
            detectedObject
        ) {

            return {

                action:
                    "SHOW_OBJECT",

                object:
                    detectedObject

            };

        }


        /* ---------- Remembered object ---------- */

        if (
            refersToMemory
        ) {

            return {

                action:
                    "SHOW_MEMORY",

                object:
                    null

            };

        }

    }


    /* =====================================================
    HIDE
    ===================================================== */

    if (
        text.includes("hide") ||
        text.includes("remove") ||
        text.includes("close") ||
        text.includes("put away") ||
        text.includes("take away")
    ) {

        /* ---------- Specific object ---------- */

        if (
            detectedObject
        ) {

            return {

                action:
                    "HIDE_OBJECT",

                object:
                    detectedObject

            };

        }


        /* ---------- Current / remembered object ---------- */

        if (
            refersToMemory
        ) {

            return {

                action:
                    "HIDE_CURRENT",

                object:
                    null

            };

        }

    }


    /* =====================================================
    SHOW AGAIN
    ===================================================== */

    if (
        text.includes("show again") ||
        text.includes("bring it back") ||
        text.includes("bring that back") ||
        text.includes("show it again") ||
        text.includes("display it again") ||
        text.includes("show the previous object") ||
        text.includes("show previous object") ||
        text.includes("show last object")
    ) {

        return {

            action:
                "SHOW_MEMORY",

            object:
                null

        };

    }


    /* =====================================================
    MAKE BIGGER
    ===================================================== */

    if (
        text.includes("make it bigger") ||
        text.includes("make it large") ||
        text.includes("make it larger") ||
        text.includes("increase size") ||
        text.includes("increase the size") ||
        text.includes("make bigger") ||
        text.includes("bigger") ||
        text.includes("larger")
    ) {

        return {

            action:
                "RESIZE_OBJECT",

            direction:
                "BIGGER",

            object:
                detectedObject

        };

    }


    /* =====================================================
    MAKE SMALLER
    ===================================================== */

    if (
        text.includes("make it smaller") ||
        text.includes("make it small") ||
        text.includes("decrease size") ||
        text.includes("decrease the size") ||
        text.includes("make smaller") ||
        text.includes("smaller")
    ) {

        return {

            action:
                "RESIZE_OBJECT",

            direction:
                "SMALLER",

            object:
                detectedObject

        };

    }


    /* =====================================================
    MOVE LEFT
    ===================================================== */

    if (
        text.includes("move left") ||
        text.includes("go left") ||
        text.includes("shift left") ||
        text.includes("put it left") ||
        (text.includes("move") && text.includes("left"))
    ) {

        return {

            action:
                "MOVE_OBJECT",

            direction:
                "LEFT",

            object:
                detectedObject

        };

    }


    /* =====================================================
    MOVE RIGHT
    ===================================================== */

    if (
        text.includes("move right") ||
        text.includes("go right") ||
        text.includes("shift right") ||
        text.includes("put it right") ||
        (text.includes("move") && text.includes("right"))
    ) {

        return {

            action:
                "MOVE_OBJECT",

            direction:
                "RIGHT",

            object:
                detectedObject

        };

    }


    /* =====================================================
    MOVE UP
    ===================================================== */

    if (
        text.includes("move up") ||
        text.includes("go up") ||
        text.includes("shift up") ||
        text.includes("put it up") ||
        (text.includes("move") && text.includes("up"))
    ) {

        return {

            action:
                "MOVE_OBJECT",

            direction:
                "UP",

            object:
                detectedObject

        };

    }


    /* =====================================================
    MOVE DOWN
    ===================================================== */

    if (
        text.includes("move down") ||
        text.includes("go down") ||
        text.includes("shift down") ||
        text.includes("put it down") ||
        (text.includes("move") && text.includes("down"))
    ) {

        return {

            action:
                "MOVE_OBJECT",

            direction:
                "DOWN",

            object:
                detectedObject

        };

    }


    /* =====================================================
    ROTATE
    ===================================================== */

    if (
        text.includes("rotate") ||
        text.includes("turn") ||
        text.includes("spin")
    ) {

        return {

            action:
                "ROTATE_OBJECT",

            direction:
                "ROTATE",

            object:
                detectedObject

        };

    }


    /* =====================================================
    CURRENT OBJECT
    ===================================================== */

    if (
        text.includes("current object") ||
        text.includes("active object") ||
        text.includes("what object") ||
        text.includes("what am i controlling") ||
        text.includes("what am i holding") ||
        text.includes("which object")
    ) {

        return {

            action:
                "CURRENT_OBJECT",

            object:
                null

        };

    }


    /* =====================================================
    PREVIOUS OBJECT
    ===================================================== */

    if (
        text.includes("previous object") ||
        text.includes("last object") ||
        text.includes("remembered object")
    ) {

        return {

            action:
                "CURRENT_OBJECT",

            object:
                null

        };

    }


    /* =====================================================
    UNKNOWN
    ===================================================== */

    return {

        action:
            "UNKNOWN",

        object:
            detectedObject

    };

}
console.log("🤖 CommandParser Test:");

console.log(
    "SHOW EARTH →",
    JSON.stringify(parseCommand("show earth"))
);

console.log(
    "MAKE IT BIGGER →",
    JSON.stringify(parseCommand("make it bigger"))
);

console.log(
    "MOVE EARTH LEFT →",
    JSON.stringify(parseCommand("move earth left"))
);

console.log(
    "ROTATE EARTH →",
    JSON.stringify(parseCommand("rotate earth"))
);

console.log(
    "HIDE IT →",
    JSON.stringify(parseCommand("hide it"))
);
import {
    FilesetResolver,
    HandLandmarker
} from "@mediapipe/tasks-vision";


let handLandmarker = null;


/* =========================================================
CREATE HAND LANDMARKER
========================================================= */

export async function createHandTracker() {

    try {

        const vision =
            await FilesetResolver.forVisionTasks(
                "/wasm"
            );


        handLandmarker =
            await HandLandmarker.createFromOptions(
                vision,
                {

                    baseOptions: {

                        modelAssetPath:
                            "/models/hand_landmarker.task"

                    },

                    runningMode:
                        "VIDEO",

                    /* IMPORTANT */

                    numHands:
                        2,

                    minHandDetectionConfidence:
                        0.5,

                    minHandPresenceConfidence:
                        0.5,

                    minTrackingConfidence:
                        0.5

                }
            );


        console.log(
            "✋ MediaPipe TWO-HAND tracker ready"
        );


        return handLandmarker;

    }

    catch (error) {

        console.error(
            "❌ MediaPipe initialization error:",
            error
        );

        throw error;

    }

}


/* =========================================================
DETECT HANDS
========================================================= */

export function detectHands(
    video,
    timestamp
) {

    if (!handLandmarker) {

        return null;

    }


    return handLandmarker.detectForVideo(
        video,
        timestamp
    );

}
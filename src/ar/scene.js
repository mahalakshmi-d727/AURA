import * as THREE from "three";

import {
    GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader.js";

import {
    setControlledObject
} from "./objectController.js";

import {
    loadModelByName
} from "./dynamicModelLoader.js";


let scene = null;
let camera = null;
let renderer = null;


/* =========================================================
CREATE AR SCENE
========================================================= */

export function createARScene(canvas) {
    console.log("🟡 createARScene() called");

    scene =
        new THREE.Scene();


    /* =====================================================
    CAMERA
    ===================================================== */

    camera =
        new THREE.PerspectiveCamera(
            45,
            canvas.clientWidth /
            canvas.clientHeight,
            0.1,
            100
        );


    camera.position.set(
        0,
        0,
        5
    );


    /* =====================================================
    RENDERER
    ===================================================== */

    renderer =
        new THREE.WebGLRenderer({

            canvas: canvas,

            alpha: true,

            antialias: true

        });

        console.log("🎨 Three.js WebGL renderer created");
    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        canvas.clientWidth,
        canvas.clientHeight,
        false
    );


    /* =====================================================
    LIGHT
    ===================================================== */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            2
        );


    scene.add(
        ambientLight
    );


    /* =====================================================
    EARTH
    ===================================================== */

    const loader =
        new GLTFLoader();


    loader.load(

        "/models/earth.glb",

        (gltf) => {

            const earth =
                gltf.scene;


            earth.scale.set(
                0.06,
                0.06,
                0.06
            );


            earth.position.set(
                0,
                0,
                0
            );


            earth.userData
                .auraObjectName =
                "earth";


            scene.add(
                earth
            );


            /* IMPORTANT */

            setControlledObject(
                earth
            );


            console.log(
                "🌍 Earth loaded and connected to controller"
            );

        },

        undefined,

        (error) => {

            console.error(
                "❌ Earth failed to load:",
                error
            );

        }

    );


    /* =====================================================
    ANIMATION
    ===================================================== */

    function animate() {

        requestAnimationFrame(
            animate
        );


        renderer.render(
            scene,
            camera
        );

    }


    animate();


    /* =====================================================
    RESIZE
    ===================================================== */

    function resize() {

        const width =
            canvas.clientWidth;

        const height =
            canvas.clientHeight;


        if (
            width === 0 ||
            height === 0
        ) {

            return;

        }


        camera.aspect =
            width / height;


        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height,
            false
        );

    }


    window.addEventListener(
        "resize",
        resize
    );


    resize();


    console.log(
        "🌐 Three.js AR scene ready"
    );


    return {

        scene,
        camera,
        renderer

    };

}


/* =========================================================
LOAD DYNAMIC OBJECT
========================================================= */

export async function loadDynamicObject(objectName) {

    if (!scene) {

        console.error(
            "❌ AURA scene is not ready."
        );

        return null;

    }

    console.log(
        "🧠 AURA requested object:",
        objectName
    );

    try {

        const object =
            await loadModelByName(
                scene,
                objectName
            );

        if (!object) {

            console.warn(
                "⚠️ Object not available:",
                objectName
            );

            return null;

        }

        /* IMPORTANT:
           Store the actual Three.js object
           inside objectController.
        */

        setControlledObject(
            object
        );

        console.log(
            "✅ Controlled object connected:",
            object.userData?.auraObjectName ||
            object.name ||
            objectName
        );

        return object;

    }

    catch (error) {

        console.error(
            "❌ Dynamic object error:",
            error
        );

        return null;

    }

}
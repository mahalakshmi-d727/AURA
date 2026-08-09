/* =========================================================
AURA — DYNAMIC 3D MODEL LOADER
Stage 8.7.1
Active Object Manager
========================================================= */

import * as THREE from "three";

import {
    GLTFLoader
} from "three/examples/jsm/loaders/GLTFLoader.js";

import {
    modelCatalog
} from "./modelCatalog.js";


const loader =
    new GLTFLoader();


/* =========================================================
CURRENT ACTIVE DYNAMIC OBJECT
========================================================= */

let activeDynamicObject = null;


/* =========================================================
REMOVE ACTIVE OBJECT
========================================================= */

function removeActiveObject(scene) {

    if (
        !activeDynamicObject
    ) {

        return;

    }


    console.log(
        "🧹 Removing previous object:",
        activeDynamicObject.userData
            .auraObjectName
    );


    scene.remove(
        activeDynamicObject
    );


    /*
        Dispose geometries
        and materials to prevent
        memory buildup.
    */

    activeDynamicObject.traverse(
        (child) => {

            if (
                child.geometry
            ) {

                child.geometry.dispose();

            }


            if (
                child.material
            ) {

                if (
                    Array.isArray(
                        child.material
                    )
                ) {

                    child.material.forEach(
                        (material) => {

                            material.dispose();

                        }
                    );

                }

                else {

                    child.material.dispose();

                }

            }

        }
    );


    activeDynamicObject =
        null;

}


/* =========================================================
LOAD MODEL BY NAME
========================================================= */

export function loadModelByName(
    scene,
    objectName
) {

    const normalizedName =
        objectName
            .toLowerCase()
            .trim();


    const modelPath =
        modelCatalog[
            normalizedName
        ];


    /* =====================================================
    MODEL NOT FOUND
    ===================================================== */

    if (!modelPath) {

        console.warn(
            "⚠️ No 3D model found for:",
            normalizedName
        );

        return Promise.resolve(
            null
        );

    }


    console.log(
        "🧠 AURA requested dynamic:",
        normalizedName
    );


    console.log(
        "📦 Loading:",
        modelPath
    );


    /*
        Remove the previous dynamic
        object before loading the new one.
    */

    removeActiveObject(
        scene
    );


    return new Promise(
        (resolve, reject) => {

            loader.load(

                modelPath,

                (gltf) => {

                    const object =
                        gltf.scene;


                    /* =================================================
                    CENTER MODEL
                    ================================================= */

                    const box =
                        new THREE.Box3()
                            .setFromObject(
                                object
                            );


                    const center =
                        box.getCenter(
                            new THREE.Vector3()
                        );


                    object.position.sub(
                        center
                    );


                    /* =================================================
                    CALCULATE MODEL SIZE
                    ================================================= */

                    const size =
                        box.getSize(
                            new THREE.Vector3()
                        );


                    const largestDimension =
                        Math.max(
                            size.x,
                            size.y,
                            size.z
                        );


                    /* =================================================
                    NORMALIZE MODEL SIZE
                    ================================================= */

                    const targetSize =
                        2.0;


                    if (
                        largestDimension > 0
                    ) {

                        const scale =
                            targetSize /
                            largestDimension;


                        object.scale.set(
                            scale,
                            scale,
                            scale
                        );

                    }


                    /* =================================================
                    SAVE AURA DATA
                    ================================================= */

                    object.userData
                        .auraBaseScale =
                        object.scale.x;


                    object.userData
                        .auraObjectName =
                        normalizedName;


                    object.userData
                        .auraDynamic =
                        true;


                    /* =================================================
                    INITIAL POSITION
                    ================================================= */

                    object.position.set(
                        0,
                        0,
                        0
                    );


                    object.visible =
                        true;


                    /* =================================================
                    ADD TO SCENE
                    ================================================= */

                    scene.add(
                        object
                    );


                    /*
                        Remember this as the
                        currently active object.
                    */

                    activeDynamicObject =
                        object;


                    console.log(
                        "✅ Dynamic model loaded:",
                        normalizedName
                    );


                    console.log(
                        "📏 Model normalized:",
                        largestDimension
                    );


                    console.log(
                        "🎯 Active object:",
                        normalizedName
                    );


                    resolve(
                        object
                    );

                },

                undefined,

                (error) => {

                    console.error(
                        "❌ Model loading failed:",
                        error
                    );


                    reject(
                        error
                    );

                }

            );

        }
    );

}


/* =========================================================
GET ACTIVE OBJECT
========================================================= */

export function getActiveDynamicObject() {

    return activeDynamicObject;

}


/* =========================================================
REMOVE ACTIVE OBJECT MANUALLY
========================================================= */

export function clearActiveDynamicObject(
    scene
) {

    removeActiveObject(
        scene
    );

}
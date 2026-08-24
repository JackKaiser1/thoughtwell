<script setup lang="ts">
    import { onMounted, useTemplateRef, ref, computed } from 'vue';
    import p5 from "p5";
    import { serverURL } from '@/constants';
    import { printError } from '@/lib/errorHandler';
    import { apiErrorHandler } from '@/lib/errorHandler';

    const sketchContainer = useTemplateRef<HTMLElement | undefined>('sketch');

    const pointSize = ref(10);
    const currentPointSize = computed(() => {
        if (pointSize.value === 10) {
            return "small";
        } else if (pointSize.value === 20) {
            return "medium";
        } else if (pointSize.value === 30) {
            return "large";
        }
    });

    function changePointSize(event: Event) {
        const element = event.target;
        if (element instanceof HTMLElement) {
            if (element.id === "smallPoint") {
                pointSize.value = 10;

            } else if (element.id === "mediumPoint") {
                pointSize.value = 20;
                
            } else if (element.id === "largePoint") {
                pointSize.value = 30;
                
            }
        }
    }

    var sketch: p5;
    var sketchCanvas: p5.Renderer;

    const sketchConfig = (p: p5) => {
        p.setup = () => {
            sketchCanvas = p.createCanvas(250, 400);
            sketch.background(255);
        };

        p.draw = () => {
            p.fill(0);
            p.noStroke();
            if (p.mouseIsPressed) {
                p.circle(p.mouseX, p.mouseY, pointSize.value);
            }
        };
    }

    async function saveSketch(blob: Blob | null) {
        try {
            if (blob === null) {
                throw new Error;
            }
            
            const formData = new FormData();

            const sketchKey = new Uint32Array(1);
            crypto.getRandomValues(sketchKey);

            formData.append(
                "sketch", 
                blob, 
                `sk-${sketchKey}-${sessionStorage.userId}.png`
            );

            const url = `${serverURL}/api/sketches`;
            const response = await fetch(url, {
                method: "POST",
                mode: "cors",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${sessionStorage.accessToken}`,
                }
            });

            if (!response.ok) {
                apiErrorHandler(response);
                throw new Error;
            }

        } catch (err) {
            printError(err);
        }
    }
    
    async function submitSketch() {
        sketchCanvas.elt.toBlob(saveSketch, "image/png");
        sketch.setup();
        sketch.draw();
    }

    onMounted(() => {
        if (sketchContainer.value) {
            sketch = new p5(sketchConfig, sketchContainer.value);
        }
    });
</script>

<template>
    <div class="sketchModeContainer">
        <div class="pointSizeContainer">
            <button 
                class="smallPointButton" 
                id="smallPoint" 
                :style="currentPointSize === 'small' ? { backgroundColor: 'rgb(150, 150, 150)' } : { backgroundColor: 'white' }"  
                @click="changePointSize">
            </button>

            <button 
                class="mediumPointButton" 
                id="mediumPoint" 
                :style="currentPointSize === 'medium' ? { backgroundColor: 'rgb(150, 150, 150)' } : { backgroundColor: 'white' }"    
                @click="changePointSize">
            </button>

            <button 
                class="largePointButton" 
                id="largePoint" 
                :style="currentPointSize === 'large' ? { backgroundColor: 'rgb(150, 150, 150)' } : { backgroundColor: 'white' }"
                @click="changePointSize">
            </button>
        </div>
        <div class="sketchContainer">
            <div ref="sketch" class="sketch" ></div>
            <button class="mainMenuButton submitSketchButton" @click="submitSketch">Submit</button>
        </div>
    </div>
</template>

<style>
    .sketchModeContainer {
        display: flex;
        flex-direction: row;
        align-items: top;
        justify-content:center;
        width: 90%;
    }

    .sketchContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: top;
    }

    .sketch {
        box-shadow: 2px 2px 2px rgb(20, 20, 20);
    }

    .submitSketchButton {
        margin-top: 1rem;
        width: 13rem;
    }

    .pointSizeContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 5%;
    }

    .smallPointButton {
        height: 11px;
        width: 11px;
        border-radius: 100%;
        border: none;
        box-shadow: 2px 2px 2px rgb(21, 21, 21);
        background-color: white;
        transition: background-color 0.15s;
    }

    .mediumPointButton {
        height: 20px;
        width: 20px;
        border-radius: 100%;
        border: none;
        box-shadow: 2px 2px 2px rgb(21, 21, 21);
        background-color: white;
        transition: background-color 0.15s;
    }

    .largePointButton {
        height: 30px;
        width: 30px;
        border-radius: 100%;
        border: none;
        box-shadow: 2px 2px 2px rgb(21, 21, 21);
        background-color: white;
        transition: background-color 0.12s;
    }

    :is(.smallPointButton, .mediumPointButton, .largePointButton):hover {
        background-color: rgb(212, 212, 212);
    }

</style>
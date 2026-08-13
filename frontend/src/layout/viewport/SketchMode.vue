<script setup lang="ts">
    import { onMounted, useTemplateRef, ref, computed } from 'vue';
    import p5 from "p5";

    const pointSize = ref(10);
    var isPointSize

    const currentPointSize = computed(() => {
        if (pointSize.value === 10) {
            return "small";
        } else if (pointSize.value === 20) {
            return "medium";
        } else if (pointSize.value === 30) {
            return "large";
        }
    });


    var drawing: p5;
    const sketchContainer = useTemplateRef<HTMLElement | undefined>('sketch');

    const s = (sketch: p5) => {
        sketch.setup = () => {
            sketch.createCanvas(250, 400);
            sketch.background(255);
        };

        sketch.draw = () => {
            sketch.fill(0);
            sketch.noStroke();
            if (sketch.mouseIsPressed) {
                sketch.circle(sketch.mouseX, sketch.mouseY, pointSize.value);
            }
        };
    }

    function submit() {
        if (sketchContainer.value){
            drawing.setup();
            drawing.draw();
        }
    }
    
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

    onMounted(() => {
        if (sketchContainer.value){
            drawing = new p5(s, sketchContainer.value);
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
            <button class="mainMenuButton submitSketchButton" @click="submit">Submit</button>
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
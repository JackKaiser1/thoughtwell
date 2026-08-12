<script setup lang="ts">
    import { onMounted, useTemplateRef, ref } from 'vue';
    import p5 from "p5";

    const pointSize = ref(10);
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

    // Make these one function
    function changePointSize10() {
        pointSize.value = 10;
    }

    function changePointSize20() {
        pointSize.value = 20;
    }

    function changePointSize30() {
        pointSize.value = 30;
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
            <button class="mainMenuButton" @click="changePointSize10">10</button>
            <button class="mainMenuButton" @click="changePointSize20">20</button>
            <button class="mainMenuButton" @click="changePointSize30">30</button>
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
        justify-content: center;
        width: 100%;
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
        gap: 1rem;
    }
</style>
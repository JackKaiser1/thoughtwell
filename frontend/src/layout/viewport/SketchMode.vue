<script setup lang="ts">
    import { onMounted } from 'vue';
    import p5 from "p5";
    import { useTemplateRef } from 'vue';

    var drawing: p5;
    const sketchContainer = useTemplateRef<HTMLElement | undefined>('sketch');

    const s = (sketch: p5) => {
        sketch.setup = () => {
            sketch.createCanvas(300, 450);
            sketch.background(255);
        };

        sketch.draw = () => {
            sketch.fill(0);
            sketch.noStroke();
            if (sketch.mouseIsPressed){
                sketch.circle(sketch.mouseX, sketch.mouseY, 20);
            }
        };
    }

    function clear() {
        if (sketchContainer.value){
            drawing.setup();
            drawing.draw();
        }
    }

    onMounted(() => {
        if (sketchContainer.value){
            drawing = new p5(s, sketchContainer.value);
        }
    });
</script>

<template>
    <div class="sketchContainer">
        <div ref="sketch" class="sketch" ></div>
    </div>
    <button @click="clear">Clear</button>
</template>

<style>
    .sketchContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    .sketch {
        box-shadow: 2px 2px 2px rgb(20, 20, 20);
    }
</style>
<template>
  <div class="playground">
    <GameMap/>
  </div>
</template>


<script>
export default {
  name: "PlayGround"
}
</script>

<script setup>
import GameMap from "@/components/GameMap";

</script>

<style scoped>
div.playground {
  width: 70vw;
  height: 85vh;
  margin: 40px auto;
  background-color: lightblue;
}
</style>

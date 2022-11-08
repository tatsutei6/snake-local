<template>
  <NavigationBar/>
  <PlayGround/>
</template>

<script>
import NavigationBar from "@/components/NavigationBar";
import PlayGround from "@/components/PlayGround";

export default {
  name: 'App',
  components: {
    NavigationBar,
    PlayGround
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

body {
  width: 100%;
  height: 100%;
}
</style>

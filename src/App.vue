<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  position: relative;
  width: 100%;
  height: 100%;
  /* min-width: 1200px; */
}
/* 隐藏滚动条 */
/* ::-webkit-scrollbar {
width: 0em;
}
::-webkit-scrollbar:horizontal {
height: 0em;
} */


</style>

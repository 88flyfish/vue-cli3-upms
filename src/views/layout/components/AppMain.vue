<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
      <!-- <router-view :key="key"></router-view> -->
        <router-view class="el-scrollbar"/>
    </transition>
  </section>
</template>

<script>
export default {
    name: 'AppMain',
    computed: {
        // key() {
        //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
        // }
    }
};
</script>

<style scoped>
.app-main {
    /*50 = navbar  */
    width: 100%;
    height: calc(100vh - 85px);
    position: relative;
    overflow: auto;
}
</style>

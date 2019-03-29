<template>
  <div class="header-container" :style="backgroundStyle">
    <div class="avatar-div">
      <img class="avatar" :src="avatar" @click="clickAvatar" />
      <div class="username-div">
        {{ username }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserHeader',
};
</script>

<style lang="stylus" scoped>
.header-container
  background white
  height 0
  padding-bottom 60%
  position relative
  background-size 100% auto
  background-image url("http://flowbook-pic.oss-cn-hangzhou.aliyuncs.com/background/back4.png_user-background")
  .avatar-div
  width 100%
  height 80px
  position absolute
  left 0
  right 0
  top 0
  bottom 0
  margin auto
  text-align center
  .avatar
    width 80px
    height 80px
    .username-div
    font-size 20px
</style>

<template>
  <div class="my-container ">
    <span class="key">{{ myKey }}</span>
    <div class="value">{{ myValue }}</div>
  </div>
</template>

<script>
export default {
  name: 'ValueItem',
  props: {
    myKey: {
      type: String,
      default: ''
    },
    myValue: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="stylus" scoped>
.my-container
  padding-top 3px
  font-size 14px
  background-color white
  line-height: 21px
  display flex
  .key
    color #999999
    min-width 70px
    flex none
  .value
    color #151515
    flex 1
</style>

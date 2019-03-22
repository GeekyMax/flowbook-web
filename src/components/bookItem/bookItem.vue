<template>
  <van-card
    class="item-card van-hairline--bottom"
    title="go语言实战"
    :thumb="data.pictureUrlList[2]"
    tag="全新"
    desc="上学期上课的教材，九成新，现在随缘出售，想要的先私我。"
    :origin-price="data.originalPrice"
    :price="data.sellPrice"
  >
    <div slot="tags">
      <van-tag round plain>
        线下交易
      </van-tag>
      <van-tag round plain>
        全新
      </van-tag>
    </div>
  </van-card>
</template>

<script>
export default {
  props: {
    data: Object,
    moreRoute: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="stylus" scoped>
.item-card
  background-color white
  padding 12px
  margin-top 0
.van-card__title
  font-size 16px
  -webkit-line-clamp 1
  overflow-y visible
.van-card__price
  font-size 20px
.van-card__thumb
  width 100px
  height 100px
.van-card__tags
  color: red
.van-card__desc
  font-size 12px
  padding 4px 0
.van-tag
  margin 4px 0
  margin-right 4px
</style>

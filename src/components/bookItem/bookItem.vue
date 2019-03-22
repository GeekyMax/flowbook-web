<template>
  <van-card
    class="item-card van-hairline--bottom"
    :thumb="data.coverUrl"
    tag="全新"
    desc="上学期上课的教材，九成新，现在随缘出售，想要的先私我。"
    :origin-price="data.originalPrice"
  >
    <div slot="tags">
      <van-tag round plain>
        {{ commodityType }}
      </van-tag>
      <van-tag round plain>
        {{ data.category }}
      </van-tag>
    </div>
    <div slot="title" class="my-title">
      {{ data.bookName }}
    </div>
    <div slot="price" class="my-price">￥{{ data.sellPrice }}</div>
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
  },
  computed: {
    commodityType() {
      if (this.data.commodityType) {
        if (this.data.commodityType === 'SELL') {
          return '出售';
        } else {
          return '求购';
        }
      } else {
        return '';
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.item-card
  background-color white
  padding 12px
  margin-top 0
  padding 4px 0
.van-tag
  margin-right 4px
.my-title
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
  font-size 16px
.my-price
  font-size 20px
</style>

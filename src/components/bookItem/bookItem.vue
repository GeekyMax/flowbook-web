<template>
  <van-card
    class="item-card van-hairline--bottom"
    :thumb="data.coverUrl"
    tag="最新"
    :desc="data.description"
    :origin-price="data.originalPrice"
  >
    <div slot="tags">
      <van-tag round plain>
        {{ commodityType }}
      </van-tag>
      <van-tag round plain>
        {{ data.category }}
      </van-tag>
      <van-tag round plain v-for="method in data.deliveryMethodList" :key="method">
        {{ method.name }}
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
  margin-top 0
  padding 10px 8px
.van-tag
  margin 4px 0
  margin-right 4px
.my-title
  color #404040
  font-weight 500
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
  font-size 14px
.my-price
  font-size 20px
</style>

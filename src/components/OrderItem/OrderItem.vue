<template>
  <van-card
    class="item-card "
    :title="data.book.bookName"
    :price="data.price"
    :thumb="data.book.coverUrl"
    :desc="data.book.description"
  >
    <div slot="title" class="my-title">
      {{ data.book.bookName }}
    </div>
    <div slot="price" class="my-price"><span class="my-price-label">总计: </span>￥{{ data.price }}</div>
    <div slot="footer" v-if="withFooter">
      <van-button size="small" @click="showOrderDetail(item)" round plain class="footer-btn"> 订单详情</van-button>
      <van-button size="small" round plain class="footer-btn" @click="goChat"> 联系卖家</van-button>
      <van-button size="small" type="warning" round plain class="footer-btn">确认收货</van-button>
    </div>
  </van-card>
</template>

<script>
export default {
  name: 'OrderItem',
  props: {
    data: Object,
    withFooter: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    showOrderDetail() {
      this.$router.push({
        path: '/orderDetail',
        query: {
          orderId: this.data.id
        }
      });
    },
    goChat() {
      this.$router.push({
        path: '/chat',
        query: {
          userId: this.data.book.userId
        }
      });
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
  vertical-align  bottom
  font-size 16px
  position absolute
  bottom 4px
  right 7px
  .my-price-label
    font-size 12px
    color #7d7e80
    font-weight 300
.footer-btn
  margin-left 8px
</style>

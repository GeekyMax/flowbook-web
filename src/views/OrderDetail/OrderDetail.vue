<template>
  <div class="order-detail">
    <van-nav-bar title="订单详情" left-text="返回" left-arrow @click-left="goBack" />
    <order-item class="order-item" :data="order" :with-footer="false"></order-item>
    <van-cell>
      <value-item my-key="订单编号:" my-value="85008168319" />
      <value-item my-key="下单时间:" :my-value="order.createTime" />
      <value-item my-key="商品金额:" :my-value="order.price" />
      <value-item my-key="交易方式:" :my-value="order.dealingMethod.name" />
      <value-item my-key="配送方式:" :my-value="order.deliveryMethod.name" />
      <value-item
        my-key="配送地址:"
        v-if="order.deliveryMethod.code === 2"
        :my-value="order.deliverySchoolAddress.name + ' ' + order.addressDetail"
      />
      <value-item my-key="自提校区:" v-if="order.deliveryMethod.code === 1" :my-value="order.pickSchoolAddress.name" />
    </van-cell>
    <van-cell title="总金额"
      ><div slot class="my-price">￥{{ order.price }}</div>
    </van-cell>
    <van-cell class="footer">
      <van-button round size="small" class="footer-btn">删除订单</van-button>
      <van-button round size="small" class="footer-btn" @click="goBook">查看商品</van-button>
      <van-button type="danger" round size="small" class="footer-btn" plain>去评价</van-button>
      <van-button type="danger" round size="small" class="footer-btn">确认收货</van-button>
    </van-cell>
  </div>
</template>

<script>
import OrderItem from '@/components/OrderItem/OrderItem';
import { getOrderInfo } from '@/api/api';
import { Toast } from 'vant';
import ValueItem from '@/components/ValueItem/ValueItem';
export default {
  name: 'OrderDetail',
  components: { ValueItem, OrderItem },
  data() {
    return {
      orderId: 0,
      order: {}
    };
  },
  created() {
    this.orderId = parseInt(this.$route.query.orderId);
    getOrderInfo({ id: this.orderId })
      .then(result => {
        if (result.code === 0) {
          this.order = result.data;
        } else {
          Toast('获取订单失败');
        }
      })
      .catch(err => {
        Toast(err);
      });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goBook() {
      this.$router.push({
        path: '/book',
        query: {
          bookId: this.order.book.id
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.order-detail
  background-color #f5f5f5
  height 100%
.order-item
  margin-bottom 12px
.my-price
  font-weight bold
  font-size 16px
  color red
.van-cell
  margin-bottom 12px
.footer
  text-align right
  position fixed
  bottom 0
  .van-cell__value
    text-align right
  .footer-btn
    margin-left 8px
</style>

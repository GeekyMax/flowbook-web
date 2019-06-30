<template>
  <transition name="slide">
    <div class="order-list">
      <van-nav-bar title="全部订单" left-text="返回" left-arrow @click-left="goBack" :z-index="10" fixed />
      <div class="list-box">
        <order-item
          v-for="item in orderList"
          :key="item"
          :data="item"
          :with-footer="true"
          class="van-hairline--bottom"
        ></order-item>
      </div>
      <div class="order-footer" v-if="orderList.length > 3">到底了~</div>
    </div>
  </transition>
</template>

<script>
import { mapMutations } from 'vuex';
import { getOrder, getGoodById } from '@/api/api';
import OrderItem from '@/components/OrderItem/OrderItem';
export default {
  components: { OrderItem },
  data() {
    return {
      orderList: []
    };
  },
  mounted() {
    getOrder({})
      .then(async result => {
        // for (let i = 0; i < result.data.list.length; i++) {
        //   var idArr = result.data[i].Goodid.substring(1, result.data[i].Goodid.length - 1).split(',');
        //   var countArr = result.data[i].Ordercount.substring(1, result.data[i].Ordercount.length - 1).split(',');
        //   idArr = idArr.map(item => {
        //     return parseInt(item);
        //   });
        //   countArr = countArr.map(item => {
        //     return parseInt(item);
        //   });
        //   var mapped = {};
        //   for (let j = 0; j < idArr.length; j++) {
        //     mapped[idArr[j]] = countArr[j];
        //   }
        //   let { data } = await getGoodById({
        //     goodId: idArr
        //   });
        //   for (let k = 0; k < data.length; k++) {
        //     data[k].orderCount = mapped[data[k].Goodid];
        //   }
        //   result.data[i].good = data;
        // }
        this.orderList = result.data.list;
        console.log(this.orderList);
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    goBack() {
      this.$router.push('/User');
    },
    goGood(item) {
      this.setGood(item);
      this.$router.push('/Good');
    },
    formatPrice(price) {
      return price.toFixed(2);
    },
    ...mapMutations({
      setGood: 'SET_GOOD_MUTATION'
    })
  }
};
</script>
<style lang="stylus" scoped>
.order-list
  background-color #f5f5f5

.list-box
  padding-top 46px

  .list
    margin-top 20px

    &:first-child
      margin-top 0

.order-footer
  height 50px
  margin-top 20px
  text-align center
  font-size 14px

.slide-enter-active, .slide-leave-active
  transition all 0.3s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)
</style>

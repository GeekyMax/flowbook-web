<template>
  <transition name="slide">
    <div class="order">
      <van-nav-bar title="提交订单" left-text="返回" left-arrow @click-left="goBack" :z-index="10" fixed />
      <div class="address" @click="goAddressList" :editable="false">
        <div class="next-icon" v-if="hasDefaultAddress">
          <van-icon name="arrow" />
        </div>
        <div class="address-item">
          <div address="address-top">
            <van-icon name="location" />
            <span class="user-info">{{ hasDefaultAddress ? defaultAddress.addressName : '添加收货地址' }}</span>
            <span class="phonenum" v-if="hasDefaultAddress">{{ defaultAddress.phone }}</span>
          </div>
          <div class="address-bottom" v-if="hasDefaultAddress">
            <div class="address-info">{{ defaultAddress.address }}{{ defaultAddress.addressDetail }}</div>
          </div>
        </div>
      </div>
      <van-panel title="商品" v-for="item in orderBookList" :key="item.id" class="allGood">
        <div class="allGood-item">
          <van-card
            :title="item.bookName"
            :desc="item.description"
            :num="1"
            :price="item.sellPrice"
            :thumb="item.coverUrl"
          />
          <van-cell-group>
            <van-cell title="配送方式" :value="item.deliveryMethod" />
            <van-field v-model="item.message" label="留言" placeholder="点击给买家留言" />
            <van-cell title="合计" style="color:#f44" :value="'￥' + formatPrice(item.sellPrice)" />
          </van-cell-group>
        </div>
      </van-panel>

      <van-cell-group class="cell">
        <van-switch-cell v-model="checked" title="短信通知收件人" />
      </van-cell-group>
      <div class="order-footer">购物愉快~</div>
      <van-submit-bar :price="totalMoney" button-text="结算" @submit="onSubmit" />
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { getAddress, createOrder, delFromCart } from '@/api/api';
export default {
  data() {
    return {
      checked: true,
      addressList: [],
      hasDefaultAddress: false,
      defaultAddress: {}
    };
  },
  mounted() {
    if (!this.orderBook.length) {
      this.$router.push('/');
    } else {
      getAddress()
        .then(result => {
          this.addressList = result.data;
          if (this.addressId) {
            result.data.forEach(item => {
              if (item.id === this.addressId) {
                this.defaultAddress = item;
                this.hasDefaultAddress = true;
                return;
              }
            });
          } else {
            result.data.forEach(item => {
              if (item.isDefault === true) {
                this.defaultAddress = item;
                this.hasDefaultAddress = true;
                return;
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  computed: {
    orderBookList() {
      this.orderBook.forEach(item => {
        item.message = '';
      });
      return this.orderBook;
    },
    totalMoney() {
      var total = 0;
      this.orderBookList.forEach(item => {
        total += item.sellPrice;
      });
      return total * 100;
    },
    ...mapGetters(['orderGood', 'addressId', 'orderBook'])
  },
  methods: {
    onSubmit() {
      var idStr = '';
      var countStr = '';
      var idArr = [];
      var countArr = [];
      for (let i = 0; i < this.orderGood.length; i++) {
        idArr.push(this.orderGood[i].Goodid);
        countArr.push(this.orderGood[0].Cartcount);
      }
      idStr = '(' + idArr.toString() + ')';
      countStr = '(' + countArr.toString() + ')';
      var obj = {
        goodId: idStr,
        cartCount: countStr,
        addressId: this.defaultAddress.Addressid,
        totalMoney: this.totalMoney / 100
      };
      createOrder(obj)
        .then(result => {
          console.log(result);
          this.$toast.success('付款成功~');
          var params = {
            delId: idArr
          };
          delFromCart(params)
            .then(result => {
              console.log(result);
            })
            .catch(error => {
              console.log(error);
            });
          setTimeout(() => {
            this.$router.push('/OrderList');
          }, 500);
        })
        .catch(error => {
          console.log(error);
        });
    },
    formatPrice(price) {
      return price.toFixed(2);
    },
    goAddressList() {
      this.setAddressList(this.addressList);
      this.$router.push('/AddressList');
    },
    goBack() {
      this.$router.go(-1);
    },
    ...mapMutations({
      setAddressList: 'SET_ADDRESSLIST_MUTATION'
    })
  }
};
</script>

<style lang="stylus" scoped>
.order
  background-color #eee

.address
  padding-top 47px
  position relative
  background-color #fff

  &::after
    content ''
    display block
    height 2px
    background -webkit-repeating-linear-gradient(135deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #3283fa 0, #3283fa 45%, transparent 0, transparent 50%)
    background repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #3283fa 0, #3283fa 45%, transparent 0, transparent 50%)
    background-size 80px

  .address-item
    padding 15px 10px

    .user-info
      margin-left 10px
      font-weight bold

    .phonenum
      float right
      margin-right 20px

    .address-bottom
      margin-top 6px

      .address-info
        font-size 14px
        margin-left 24px
        margin-right 20px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap

  .next-icon
    position absolute
    right 10px
    top 76px

    i
      font-weight bold
      color #888

.allGood
  margin-top 14px

.cell
  margin-top 10px

.order-footer
  height 120px
  margin-top 10px
  text-align center
  font-size 14px

.slide-enter-active, .slide-leave-active
  transition all 0.3s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)
</style>

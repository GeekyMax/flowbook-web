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
            <span class="user-info">{{ hasDefaultAddress ? defaultAddress.name : '添加收货地址' }}</span>
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
            <div class="van-cell van-field">
              <div class="van-cell__title van-field__label"><span>交易方式</span></div>
              <div class="van-cell__value">
                <div class="van-field__body">
                  <input
                    v-model="order.dealingMethod"
                    type="text"
                    placeholder="选择交易方式"
                    readonly="readonly"
                    class="van-field__control"
                    @click="dealingMethodShow = true"
                  />
                </div>
              </div>
            </div>
            <div class="van-cell van-field">
              <div class="van-cell__title van-field__label"><span>配送方式</span></div>
              <div class="van-cell__value">
                <div class="van-field__body">
                  <input
                    type="text"
                    v-model="order.deliveryMethod"
                    placeholder="选择配送方式"
                    readonly="readonly"
                    class="van-field__control"
                    @click="deliveryMethodShow = true"
                  />
                </div>
              </div>
            </div>
            <div class="van-cell van-field" v-if="order.deliveryMethod === '配送'">
              <div class="van-cell__title van-field__label"><span>配送校区</span></div>
              <div class="van-cell__value">
                <div class="van-field__body">
                  <input
                    v-model="order.deliverySchoolAddress"
                    type="text"
                    placeholder="选择配送校区"
                    readonly="readonly"
                    class="van-field__control"
                    @click="deliverySchoolAddressShow = true"
                  />
                </div>
              </div>
            </div>
            <van-field
              label="详细地址"
              placeholder="学园 寝室楼号"
              v-model="order.addressDetail"
              v-if="order.deliveryMethod === '配送'"
            ></van-field>
            <van-field
              label="自提校区"
              v-if="order.deliveryMethod === '自取'"
              :readonly="true"
              :value="orderBook[0].pickSchoolAddress.name"
              v-model="order.pickSchoolAddress"
              placeholder="自提校区"
            />
            <van-field v-model="order.comment" label="留言" placeholder="点击给买家留言" />
            <van-cell title="合计" style="color:#f44" :value="'￥' + formatPrice(item.sellPrice)" />
          </van-cell-group>
        </div>
      </van-panel>

      <van-cell-group class="cell">
        <van-switch-cell v-model="checked" title="短信通知收件人" />
      </van-cell-group>
      <div class="order-footer">购物愉快~</div>
      <van-submit-bar :price="totalMoney" button-text="结算" @submit="onSubmit" />
      <van-popup v-model="dealingMethodShow" position="bottom">
        <van-picker
          :columns="dealingMethodPicker"
          show-toolbar
          @cancel="dealingMethodShow = false"
          @confirm="confirmDealingMethod"
        />
      </van-popup>
      <van-popup v-model="deliveryMethodShow" position="bottom">
        <van-picker
          :columns="deliveryMethodPicker"
          show-toolbar
          @cancel="deliveryMethodShow = false"
          @confirm="confirmDeliveryMethod"
        />
      </van-popup>
      <van-popup v-model="deliverySchoolAddressShow" position="bottom">
        <van-picker
          :columns="deliverySchoolAddressPicker"
          show-toolbar
          @cancel="deliverySchoolAddressShow = false"
          @confirm="confirmDeliverySchoolAddress"
        />
      </van-popup>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { getAddress, createOrder, delFromCart } from '@/api/api';
import { Toast } from 'vant';
export default {
  data() {
    return {
      deliveryMethodIndex: 0,
      dealingMethodShow: false,
      deliveryMethodShow: false,
      deliverySchoolAddressShow: false,
      dealingMethodPicker: [],
      deliveryMethodPicker: [],
      deliverySchoolAddressPicker: [],
      pickSchoolAddressPicker: [],
      order: {
        bookId: '',
        dealingMethod: '',
        deliveryMethod: '',
        deliverySchoolAddress: '',
        addressDetail: '',
        pickSchoolAddress: '',
        comment: ''
      },
      show: false,
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
      // 处理地址
      getAddress()
        .then(result => {
          this.addressList = result.data;
          if (this.addressId) {
            result.data.forEach(item => {
              if (item.id === this.addressId) {
                this.defaultAddress = item;
                this.hasDefaultAddress = true;
              }
            });
          } else {
            result.data.forEach(item => {
              if (item.isDefault === true) {
                this.defaultAddress = item;
                this.hasDefaultAddress = true;
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
      // 处理订单
    }
  },
  created() {
    this.order.bookId = this.orderBook[0].id;

    console.log(this.orderBook[0].dealingMethod.code);

    this.order.pickSchoolAddress = this.orderBook[0].pickSchoolAddress.name;

    if (this.orderBook[0].dealingMethod.code === 2) {
      this.dealingMethodPicker = ['线下交易'];
    } else if (this.orderBook[0].dealingMethod.code === 1) {
      this.dealingMethodPicker = ['线上交易'];
    } else if (this.orderBook[0].dealingMethod.code === 3) {
      this.dealingMethodPicker = ['线下交易', '线下交易'];
    }
    this.deliveryMethodPicker = [];
    this.orderBook[0].deliveryMethodList.forEach(item => {
      this.deliveryMethodPicker.push(item.name);
    });
    this.deliverySchoolAddressPicker = [];
    this.orderBook[0].deliverySchoolAddressList.forEach(item => {
      this.deliverySchoolAddressPicker.push(item.name);
    });
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
    confirmDealingMethod(value, index) {
      this.dealingMethodShow = false;
      this.order.dealingMethod = value;
    },
    confirmDeliveryMethod(value, index) {
      this.deliveryMethodShow = false;
      this.order.deliveryMethod = value;
      this.deliveryMethodIndex = index;
    },
    confirmDeliverySchoolAddress(value, index) {
      this.deliverySchoolAddressShow = false;
      this.order.deliverySchoolAddress = value;
    },
    //todo 字段校验
    onSubmit() {
      createOrder(this.order)
        .then(result => {
          console.log(result);
          if (result.code === 0) {
            this.$toast.success('付款成功~');
            this.$router.push('/');
          }
          // var params = {
          //   delId: idArr
          // };
          // delFromCart(params)
          //   .then(result => {
          //     console.log(result);
          //   })
          //   .catch(error => {
          //     console.log(error);
          //   });
          // setTimeout(() => {
          //   this.$router.push('/OrderList');
          // }, 500);
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
      setAddressList: 'SET_ADDRESS_LIST_MUTATION'
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

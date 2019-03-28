<template>
  <transition name="slide">
    <div class="book">
      <div class="back-btn" @click="goBack">
        <van-icon name="arrow-left" />
      </div>
      <van-swipe class="swipe" style="height:375px">
        <van-swipe-item v-for="url in allUrl" :key="url">
          <img :src="url" alt="图片" />
        </van-swipe-item>
      </van-swipe>
      <div class="info">
        <van-cell-group class="book-detail" border="false">
          <van-cell>
            <div class="book-title">
              <span>{{ book.bookName }}</span>
              <span class="book-price">￥{{ book.sellPrice }}</span>
              <strike class="original-price">原价￥{{ book.originalPrice }}</strike>
            </div>
          </van-cell>
          <van-cell class="dealing-info">
            <van-row class="dealing-row">
              <van-col span="12"
                ><span class="info-label">交易</span>
                <span class="info-text">{{ this.book.dealingMethod.name }}</span></van-col
              >
              <van-col span="12"
                ><span class="info-label">类别</span> <span class="info-text">{{ this.book.category }}</span></van-col
              >
              <van-col span="12"
                ><span class="info-label">支持</span> <span class="info-text">{{ deliveryMethod }}</span></van-col
              >
              <van-col span="12" v-if="isPick"
                ><span class="info-label">自提</span>
                <span class="info-text">{{ this.book.pickSchoolAddress.name }}</span>
              </van-col>
              <van-col span="24" v-if="isDeliver"
                ><span class="info-label">配送</span>
                <span class="info-text">{{ deliveryAddress }}</span>
              </van-col>
            </van-row>
          </van-cell>
        </van-cell-group>
      </div>

      <!--只有在cell为最后一个元素的时候,不显示下分割线,所以加个div-->
      <div class="more-info-cell ">
        <div>
          <van-cell is-link title="卖家详情">
            <img class="seller-avatar" :src="sellerAvatar" alt="" />
          </van-cell>
        </div>
        <div>
          <van-cell title="查看书籍详情" is-link @click="scrollToDetail" />
        </div>
      </div>
      <van-panel title="书籍参数">
        <van-cell class="dealing-info">
          <van-row class="dealing-row">
            <van-col span="12"
              ><span class="info-label">成色</span> <span class="info-text">{{ this.book.quality }}</span></van-col
            >
            <van-col span="12"
              ><span class="info-label">版本</span> <span class="info-text">{{ this.book.version }}</span></van-col
            >
          </van-row>
          <van-row class="dealing-row">
            <van-col span="12"
              ><span class="info-label">作者</span> <span class="info-text">{{ this.book.author }}</span></van-col
            >
            <van-col span="12"
              ><span class="info-label">isbn</span>
              <span class="info-text">{{ this.book.isbn }}</span>
            </van-col>
          </van-row>
        </van-cell>
      </van-panel>
      <van-panel title="站外链接">
        <van-cell class="dealing-info">
          <van-row class="dealing-row">
            <van-col span="24" v-for="link in this.book.outerLinkList" :key="link"
              ><span class="info-label">{{ link.title }}</span>
              <span class="info-text"
                ><a :href="link.url">{{ link.url }}</a></span
              ></van-col
            >
          </van-row>
        </van-cell>
      </van-panel>
      <div class="detail" ref="detail">
        <div class="desc-title">
          <div class="border"></div>
          <div class="title">宝贝详情</div>
          <div class="border"></div>
        </div>
        <div class="book-desc">{{ book.description }}</div>
        <img v-for="pic in allUrl" :key="pic" :src="pic" alt="" />
      </div>
      <van-goods-action>
        <van-goods-action-mini-btn icon="chat" text="消息" />
        <van-goods-action-mini-btn icon="shop" text="卖家" />
        <van-goods-action-mini-btn icon="cart" text="购物车" to="/Cart" />
        <!--text="加入购物车"/>-->
        <van-goods-action-big-btn @click="showSkuModal" text="加入购物车" />
        <van-goods-action-big-btn @click="showSkuModal" text="立即购买" primary />
      </van-goods-action>
      <van-sku
        v-model="showBase"
        :sku="sku"
        :goods="this.good"
        :goods-id="this.book.id"
        @buy-clicked="onBuyClicked"
        @add-cart="onAddCartClicked"
        @stepper-change="getCount"
      />
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import { mapMutations } from 'vuex';

export default {
  name: 'Book',
  data() {
    return {
      showBase: false,
      sku: {},
      good: 1,
      activeNames: ['1', '2']
    };
  },
  created() {
    console.log(this.book);
    if (!this.book.id) {
      console.log('load book');
      this.setBook(JSON.parse(localStorage.getItem('book')));
    }
  },
  mounted() {
    this.sku = {
      tree: [
        {
          k: '颜色',
          k_id: '1',
          v: [
            {
              id: '30349',
              name: '天蓝色',
              imgUrl: this.book.coverUrl
            }
          ],
          k_s: 's1',
          count: 2
        },
        {
          k: '尺寸',
          k_id: '2',
          v: [
            {
              id: '1193',
              name: '1'
            },
            {
              id: '1194',
              name: '2'
            }
          ],
          k_s: 's2',
          count: 2
        }
      ],
      list: [
        {
          id: 2259,
          price: 100,
          discount: 100,
          code: '',
          s1: '1215',
          s2: '1193',
          s3: '0',
          s4: '0',
          s5: '0',
          extend: null,
          kdt_id: 55,
          discount_price: 0,
          stock_num: 110,
          stock_mode: 0,
          is_sell: null,
          combin_sku: false,
          goods_id: 946755
        },
        {
          id: 2260,
          price: 100,
          discount: 100,
          code: '',
          s1: '1215',
          s2: '1194',
          s3: '0',
          s4: '0',
          s5: '0',
          extend: null,
          kdt_id: 55,
          discount_price: 0,
          stock_num: 0,
          stock_mode: 0,
          is_sell: null,
          combin_sku: false,
          goods_id: 946755
        },
        {
          id: 2257,
          price: 100,
          discount: 100,
          code: '',
          s1: '30349',
          s2: '1193',
          s3: '0',
          s4: '0',
          s5: '0',
          extend: null,
          kdt_id: 55,
          discount_price: 0,
          stock_num: 999,
          stock_mode: 0,
          is_sell: null,
          combin_sku: false,
          goods_id: 946755
        },
        {
          id: 2258,
          price: 100,
          discount: 100,
          code: '',
          s1: '30349',
          s2: '1194',
          s3: '0',
          s4: '0',
          s5: '0',
          extend: null,
          kdt_id: 55,
          discount_price: 0,
          stock_num: 655,
          stock_mode: 0,
          is_sell: null,
          combin_sku: false,
          goods_id: 946755
        }
      ],
      price: this.book.sellPrice,
      stock_num: 227,
      collection_id: 2261,
      collection_price: 0,
      none_sku: false,
      sold_num: 0,
      min_price: '1.00',
      max_price: '1.00',
      hide_stock: false
    };
    this.good = {
      title: this.book.bookName,
      picture: this.book.coverUrl
    };
  },
  computed: {
    allUrl() {
      var newList = [];
      newList.push(this.getMainUrl(this.book.coverUrl));
      this.book.pictureUrlList &&
        this.book.pictureUrlList.forEach(pic => {
          newList.push(this.getMainUrl(pic));
        });
      return newList;
    },
    sellerAvatar() {
      return this.getSmallRoundAvatarUrl(this.book.pictureUrlList[0]);
    },
    deliveryMethod() {
      var str = '';
      this.book.deliveryMethodList.forEach(item => {
        if (str !== '') {
          str += ', ';
        }
        str += item.name;
      });
      return str;
    },
    deliveryAddress() {
      var str = '';
      this.book.deliverySchoolAddressList.forEach(item => {
        if (str !== '') {
          str += ', ';
        }
        str += item.name;
      });
      return str;
    },
    isPick() {
      var result = false;
      if (this.book.deliveryMethodList) {
        this.book.deliveryMethodList.forEach(item => {
          if (item.code === 1) {
            result = true;
          }
        });
      }
      return result;
    },
    isDeliver() {
      var result = false;
      if (this.book.deliveryMethodList) {
        this.book.deliveryMethodList.forEach(item => {
          if (item.code === 2) {
            result = true;
          }
        });
      }
      return result;
    },
    ...mapGetters(['book'])
  },
  methods: {
    getMainUrl(url) {
      return url + '_main-800';
    },
    getSmallAvatarUrl(url) {
      return url + '_avatar-40';
    },
    getSmallRoundAvatarUrl(url) {
      return url + '_avatar-round-40';
    },
    scrollToDetail() {
      this.$refs.detail.scrollIntoView();
    },
    goBack() {
      this.$router.go(-1);
    },
    showSkuModal() {
      this.showBase = true;
    },
    onBuyClicked() {
      this.setOrderBook([this.book]);
      this.$router.push('/Order');
    },
    ...mapMutations({
      setBook: 'SET_GOOD_MUTATION',
      setOrderBook: 'SET_ORDER_BOOK_MUTATION'
    })
  }
};
</script>

<style lang="stylus" scoped>
.van-hairline
  border 0

.book
  padding-bottom 50px
  background-color #f5f5f5

  .info-label
    font-size 12px
    color grey
    margin-right 12px

  .info-text
    font-size 12px
    color black

  .back-btn
    position fixed
    z-index 999
    top 10px
    left 10px
    width 30px
    height 30px
    border-radius 50%
    color #fff
    line-height 32px
    text-align center
    background-color rgba(102, 102, 102, 0.4)

    i
      font-weight 700
      margin-left -2px
      margin-top 4px

.swipe img
  width 100%
  height auto
  display block

.book-detail
  .book-title
    font-size 16px
    vertical-align bottom

  .book-price
    color red
    margin-left 10px

  .original-price
    color grey
    font-size 12px
    margin-left 10px

.dealing-info
  padding 0 15px

  .dealing-row
    font-size 12px
    color #999
    padding 4px 0

.more-info-cell
  margin 8px 0

.books
.detail img
  width 100%
  height auto


.desc-title
  color: grey
  display flex
  justify-content center
  align-items center
  text-align center
  font-size 14px
  height 30px

  .border
    width 12px
    height 1px
    margin 0 8px
    background-color grey

.book-desc
  padding 15px
  background-color white

.seller, .xiangqing
  margin 0.3rem 0

.seller-avatar
  width 24px
  height 24px
  vertical-align middle

.slide-enter-active, .slide-leave-active
  transition all 0.3s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)
.van-panel
  margin-bottom 8px
</style>

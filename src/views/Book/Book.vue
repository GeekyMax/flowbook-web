<template>
  <transition name="slide">
    <div class="book">
      <div class="back-btn"
           @click="goBack">
        <van-icon name="arrow-left"/>
      </div>
      <van-swipe class="swipe"
                 style="height:375px">
        <van-swipe-item v-for="url in allUrl" :key="url">
          <img :src="getMainUrl(url)" alt="图片">
        </van-swipe-item>
      </van-swipe>
      <van-cell-group class="book-detail">
        <van-cell>
          <div class="book-title">
            <span>{{book.bookName}}</span>
            <span class="book-price">￥{{book.sellPrice}}</span>
            <span class="original-price">原价￥{{book.originalPrice}}</span>

          </div>
        </van-cell>
        <van-cell class="book-dealing-info">
          <van-row>
            <van-col span="12"
                     class="books-dealing-item"><span class="info-label">交易方式</span> <span class="info-text">线上，线下</span></van-col>
            <van-col span="12"
                     class="books-dealing-item"><span class="info-label">卖家常住地</span> <span class="info-text">玉泉</span></van-col>
          </van-row>
        </van-cell>
        <van-cell class="book-dealing-info">
          <van-row>
            <van-col span="12"
                     class="books-dealing-item"><span class="info-label">书籍类别</span> <span class="info-text">计算机</span></van-col>
          </van-row>
        </van-cell>
      </van-cell-group>
      <van-cell-group class="goods-cell-group seller">
        <van-cell is-link>
          <template slot="title">
            <span class="van-cell-text">卖家详情</span>
          </template>
          <img class="seller-avatar" slot="right-icon" src="https://flowbook-pic.oss-cn-hangzhou.aliyuncs.com/20190380/a6615033-c58e-49e3-ba49-2e96fff3333d.jpeg_thumbnail-240" alt="">
        </van-cell>
      </van-cell-group>
      <van-cell-group class="books-cell-group xiangqing">
        <van-cell title="查看书籍详情"
                  is-link
                  @click="scrollToDetail"/>
      </van-cell-group>
      <div class="detail"
           ref="detail">
        <div class="book-desc">{{book.description}}</div>
        <img v-for="pic in book.pictureUrlList" :key="pic" :src="getMainUrl(pic)" alt="">
      </div>
      <van-goods-action>
        <van-goods-action-mini-btn icon="chat"
                                   text="消息"/>
        <van-goods-action-mini-btn icon="shop"
                                   text="卖家"/>
        <!--<van-goods-action-big-btn @click="showSkuModal"-->
                                  <!--text="加入购物车"/>-->
        <van-goods-action-big-btn @click="showSkuModal"
                                  text="立即购买"
                                  primary/>
      </van-goods-action>
      <van-sku v-model="showBase"
               :sku="sku"
               :books="books"
               :books-id="booksId"
               @buy-clicked="onBuyClicked"
               @add-cart="onAddCartClicked"
               @stepper-change="getCount"/>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: 'Book',
  data: function() {
    return {};
  },
  mounted() {},
  computed: {
    allUrl() {
      var newList = [];
      newList.push(this.book.coverUrl);
      return newList.concat(this.book.pictureUrlList);
    },
    ...mapGetters(['book'])
  },
  methods: {
    getMainUrl(url) {
      return url + '_main-w800h800';
    }
  }
};
</script>

<style lang="stylus" scoped>
  .book
    padding-bottom 50px
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

    .book-price
      color red
      margin-left 10px
    .original-price
      color grey
      font-size 12px
      margin-left 10px

  .book-dealing-info
    padding 5px 15px

    .books-dealing-item
      font-size 12px
      color #999
  .books
  .detail img
    width 100%
    height auto

  .seller, .xiangqing
    margin 0.3rem 0

  .seller-avatar
    width 24px
    height 24px

  .slide-enter-active, .slide-leave-active
    transition all 0.3s

  .slide-enter, .slide-leave-to
    opacity 0
    transform translate3d(100%, 0, 0)
</style>

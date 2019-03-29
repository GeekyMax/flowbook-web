<template>
  <transition name="slide">
    <div class="seller">
      <div class="back-btn" @click="goBack">
        <van-icon name="arrow-left" />
      </div>
      <div class="header-container" :style="backgroundStyle">
        <div class="avatar-div">
          <img class="avatar" :src="roundAvatar" />
          <div class="username-div">
            {{ seller.username }}
          </div>
          <div class="user-desc-div">
            {{ seller.description }}
          </div>
        </div>
      </div>
      <van-cell class="user-info-div" border="false">
        <van-row class="dealing-row">
          <van-col span="12"
            ><span class="info-label">性别</span> <span class="info-text">{{ seller.sex }}</span></van-col
          >
          <van-col span="12"
            ><span class="info-label">常住地</span>
            <span class="info-text">{{ seller.residence == '' ? '未知' : seller.residence }}</span></van-col
          >
          <van-col span="12"
            ><span class="info-label">卖出书籍</span> <span class="info-text">{{ seller.soldCount }}</span></van-col
          >
          <van-col span="12"><span class="info-label">总体评价</span> <span class="info-text">5.0</span></van-col>
        </van-row>
      </van-cell>
      <div class="seller-list-div">
        <van-tabs>
          <van-tab v-for="(value, key) in bookType" :key="key" :title="key">
            <book-list :type="value" :seller-id="id"></book-list>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </transition>
</template>

<script>
import UserHeader from '@/views/SellerHome/SellerHeader';
import { getSellerInfo } from '@/api/api';
import BookList from '@/views/BookList/BookList';
export default {
  name: 'SellerHome',
  components: { BookList, UserHeader },
  data() {
    return {
      bookType: { 出售: '1', 求购: '2', 评价: '3' },
      seller: {
        id: 0,
        username: 'username',
        sex: '',
        avatar: 'https://flowbook-pic.oss-cn-hangzhou.aliyuncs.com/avatar/default.jpg_avatar-round-120'
      },
      // description: '暂无简介',
      backgroundImage: 'http://flowbook-pic.oss-cn-hangzhou.aliyuncs.com/background/back1.jpg_user-background'
    };
  },
  computed: {
    roundAvatar() {
      return this.seller.avatar + '_avatar-round-120';
    },
    background() {
      return this.seller.avatar + '_avatar-blur-800';
    },
    backgroundStyle() {
      return {
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),url(' + this.background + ')',
        backgroundSize: '100% auto',
        backgroundPosition: 'center'
      };
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  },
  created() {
    // 获得userId
    this.id = this.$route.query.id;
    getSellerInfo({ sellerId: this.id })
      .then(result => {
        console.log('result is', result.data);
        this.seller = result.data;
      })
      .catch(err => {
        console.log('err is', err);
      });
  },
  mounted() {}
};
</script>

<style lang="stylus" scoped>
.seller
  background-color #f5f5f5
// 返回键
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
.header-container
  height 0
  padding-bottom 60%
  position relative
  background-size 100% auto
  background-position center
.avatar-div
  width 100%
  height 80px
  position absolute
  left 0
  right 0
  top 0
  bottom 0
  margin auto
  text-align center
  color white
  padding-bottom 16px
  .avatar
    width 80px
    height 80px
  .username-div
    font-size 20px
  .user-desc-div
    margin-top 4px
    font-size 10px
.user-info-div
  position relative
  top -12px
  border-top-left-radius 12px
  border-top-right-radius 12px
  background white
  margin-bottom -12px
  .dealing-row
    font-size 12px
    color #999
    padding 4px 0
    .info-label
      font-size 12px
      color grey
      margin-right 12px

    .info-text
      font-size 12px
      color black
.seller-list-div
  /*margin-top 12px*/
</style>

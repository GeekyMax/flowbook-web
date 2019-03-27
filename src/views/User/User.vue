<template>
  <div>
    <!--<img-->
    <!--class="user-poster"-->
    <!--src="https://img.yzcdn.cn/public_files/2017/10/23/8690bb321356070e0b8c4404d087f8fd.png"-->
    <!--alt="用户"-->
    <!--/>-->
    <!--<user-header :avatar="me.userInfo.avatar" />-->
    <div class="header-container" :style="backgroundStyle">
      <div class="avatar-div">
        <img class="avatar" :src="avatar" @click="clickAvatar" />
        <div class="username-div">
          {{ username }}
        </div>
      </div>
    </div>
    <van-row class="user-link">
      <van-col span="6">
        <van-icon name="pending-payment"></van-icon>
        待付款
      </van-col>
      <van-col span="6">
        <van-icon name="paid"></van-icon>
        待接单
      </van-col>
      <van-col span="6">
        <van-icon name="tosend"></van-icon>
        待发货
      </van-col>
      <van-col span="6">
        <van-icon name="logistics"></van-icon>
        待收货
      </van-col>
    </van-row>
    <van-cell-group class="user-group">
      <van-cell title="全部订单" icon="records" is-link to="/OrderList" />
      <van-cell title="我的收藏" icon="star-o" is-link />
      <van-cell title="浏览历史" icon="browsing-history-o" is-link />
    </van-cell-group>
    <van-cell-group>
      <van-cell title="设置" icon="setting-o" is-link />
    </van-cell-group>
    <van-actionsheet v-model="show" :actions="actions" @select="onSelect" cancel-text="取消" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { getMeInfo, logout } from '@/api/api';

export default {
  name: 'User',
  data() {
    return {
      backgroundStyle: {
        backgroundImage: 'http://flowbook-pic.oss-cn-hangzhou.aliyuncs.com/background/back1.jpg_user-background'
      },
      logged: false,
      show: false,
      actions: [
        {
          name: '登出'
        }
      ]
    };
  },
  computed: {
    avatar() {
      if (this.me.userInfo) {
        return this.me.userInfo.avatar + '_avatar-round-120';
      } else {
        return 'https://flowbook-pic.oss-cn-hangzhou.aliyuncs.com/avatar/default-user.png_avatar-round-120';
      }
    },
    username() {
      return this.me.userInfo ? this.me.userInfo.username : '点击头像登录';
    },
    ...mapGetters(['me'])
  },
  methods: {
    clickAvatar() {
      if (this.logged) {
        this.show = true;
      } else {
        this.$router.push('/login');
      }
    },
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.show = false;
      if (item.name === '登出') {
        logout();
        this.setMe({});
        this.$router.push('/');
      }
    },
    ...mapMutations({
      setMe: 'SET_ME_MUTATION'
    })
  },
  mounted() {
    if (!this.me.userInfo) {
      console.log('thisthisthsi');
      getMeInfo()
        .then(result => {
          console.log(result);
          if (result.code === 0) {
            this.setMe(result.data);
            this.logged = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.logged = true;
    }
  }
};
</script>

<style lang="stylus" scoped>

.user-link
  text-align center
  font-size 12px
  padding 15px 0
  background-color #fff

  .van-icon
    display block
    margin-bottom 4px
    font-size 24px

.user-group
  margin-bottom 0.3rem

.header-container
  background white
  height 0
  padding-bottom 60%
  position relative
  background-size 100% auto
  background-image url("http://flowbook-pic.oss-cn-hangzhou.aliyuncs.com/background/back4.png_user-background")
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
  .avatar
    width 80px
    height 80px
  .username-div
    font-size 20px
.van-actionsheet__item
  color red
</style>

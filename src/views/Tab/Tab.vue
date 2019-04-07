<template>
  <div style="text-align: center">
    <div class="publish-div">
      <mu-button fab color="primary" small @click="openFullscreenDialog">
        <mu-icon value="add"></mu-icon>
      </mu-button>
      <div class="publish-label">消息</div>
    </div>

    <van-tabbar v-model="active" class="tab" style="z-index:999">
      <van-tabbar-item icon="wap-home" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="cart-o" to="/Cart">购物车</van-tabbar-item>
      <van-tabbar-item></van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/chatList">消息</van-tabbar-item>
      <van-tabbar-item icon="contact" to="/User">用户</van-tabbar-item>
    </van-tabbar>
    <mu-container>
      <mu-dialog width="360" transition="slide-bottom" scrollable fullscreen :open.sync="openFullscreen" padding="0">
        <mu-appbar color="primary" title="发布图书">
          <mu-button slot="left" icon @click="closeFullscreenDialog">
            <mu-icon value="close"></mu-icon>
          </mu-button>
          <mu-button slot="right" flat @click="closeFullscreenDialog">
            完成
          </mu-button>
        </mu-appbar>
        <div>
          <publish-book />
        </div>
      </mu-dialog>
    </mu-container>
  </div>
</template>

<script>
import PublishBook from '@/views/Book/PublishBook';
export default {
  components: { PublishBook },
  data() {
    return {
      active: 0,
      openFullscreen: false
    };
  },
  methods: {
    openFullscreenDialog() {
      this.openFullscreen = true;
    },
    closeFullscreenDialog() {
      this.openFullscreen = false;
    }
  },
  watch: {
    $route(to, from) {
      switch (to.fullPath) {
        case '/':
          this.active = 0;
          break;
        case '/Cart':
          this.active = 1;
          break;
        case '/publish':
          this.active = 2;
          break;
        case '/chatList':
          this.active = 3;
          break;
        case '/User':
          this.active = 4;
          break;
        default:
          this.active = 0;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.publish-div
  z-index 1000
  position fixed
  margin-left -20px
  bottom 0
  left 50%
  .publish-label
    font-size 12px
    color #7d7e80
    margin-bottom 6px
    margin-top 8px
.mu-dialog-body
  max-height 2000px
</style>

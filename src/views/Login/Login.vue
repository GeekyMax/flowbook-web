<template>
  <transition name="slide">
    <div class="login">
      <h1 class="logo">
        flowbook
      </h1>
      <mu-paper :z-depth="4" class="login-from">
        <mu-text-field v-model="username" label="Username" type="text"></mu-text-field>
        <mu-text-field
          v-model="password"
          label="Password"
          :action-icon="visibility ? 'visibility_off' : 'visibility'"
          :action-click="() => (this.visibility = !this.visibility)"
          :type="visibility ? 'text' : 'password'"
        ></mu-text-field
        ><br />
        <van-cell>
          <van-row>
            <van-col span="12" class="btn">
              <mu-button color="primary" @click="login">登录</mu-button>
            </van-col>
            <van-col span="12" class="btn">
              <mu-button color="success" @click="reg">注册</mu-button>
            </van-col>
          </van-row>
        </van-cell>
      </mu-paper>
    </div>
  </transition>
</template>

<script>
import { cors, login, welcome } from '@/api/api';
import { Toast } from 'vant';
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      username: 'seller1',
      password: 'Max112211',
      usernameErr: '',
      passwordErr: '',
      loading: false,
      visibility: false,
      redirect: this.$route.query.redirect
    };
  },
  mounted() {
    if (this.redirect) {
      Toast({
        position: 'bottom',
        message: '未登录或登陆过期，请重新登陆~'
      });
    }
  },
  methods: {
    login() {
      this.usernameErr = '';
      this.passwordErr = '';
      this.loading = true;

      login({ username: this.username, password: this.password })
        .then(res => {
          console.log(res);
          if (res.code === 0) {
            this.loading = false;
            this.setUsername(this.username);
            this.$router.push('/');
          } else {
            this.loading = false;
            Toast.fail(res.message);
          }
        })
        .catch(error => {
          Toast.fail(error);
          this.loading = false;
        });
    },
    reg() {
      // this.$router.push('/reg');
      cors().then(res => {});
    },
    ...mapMutations({
      setUsername: 'SET_USERNAME_MUTATION'
    })
  }
};
</script>

<style lang="stylus" scoped>
.login
  width 100%
  height 100%
  text-align center
  background url('https://flowbook-pic.oss-cn-hangzhou.aliyuncs.com/background/md-2.png')
  /*background-repeat no-repeat*/
  /*background-size cover*/
  overflow hidden

.login-from
  width 80%
  text-align center
  padding 10px
  margin 0 auto

  .btn
    text-align center
    margin-top 10px

.slide-enter-active, .slide-leave-active
  transition all 0.5s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)
.logo
  margin-top 40%
  font-size 48px
  font-family Hei
  color white
  margin-bottom 24px
</style>

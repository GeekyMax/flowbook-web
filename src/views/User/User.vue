<template>
  <div>
    <img
      class="user-poster"
      src="https://img.yzcdn.cn/public_files/2017/10/23/8690bb321356070e0b8c4404d087f8fd.png"
      alt="用户"
    />
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
  </div>
</template>

<script>
export default {
  name: 'User',
  methods: {}
};
</script>

<style lang="stylus" scoped>
.user-poster
  width 100%
  height auto
  display block

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
</style>

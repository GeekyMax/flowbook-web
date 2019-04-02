<template>
  <van-cell @click="goChat">
    <div class="container">
      <div class="avatar"><img :src="avatar" :alt="toUser.username" class="avatar-img" /></div>
      <div class="right-container">
        <div class="username-date-div">
          <div class="username">{{ toUser.username }}</div>
          <div class="date">{{ lastMessageTime }}</div>
        </div>
        <div class="content">{{ lastMessage.content }}</div>
      </div>
    </div>
    <!--<div>{{ toUser.username }}</div>-->
    <!--<div>{{ toUser.avatar }}</div>-->
    <!--<div>{{ lastMessage.content }}</div>-->
    <!--<div>{{ lastMessage.sendTime }}</div>-->
  </van-cell>
</template>

<script>
export default {
  name: 'ChatListItem',
  props: {
    userId: 0,
    chat: {
      type: Object,
      required: true
    }
  },
  computed: {
    toUser() {
      for (let user of this.chat.specificChat.userList) {
        if (user.userId !== this.userId) {
          return user;
        }
      }
    },
    lastMessage() {
      return this.chat.messageList.length > 0 ? this.chat.messageList[0] : null;
    },
    avatar() {
      return this.toUser.avatar + '_avatar-round-120';
    },
    lastMessageTime() {
      var dateString = this.lastMessage.sendTime;
      var date = new Date(dateString);
      console.log('date parse is:', date);
      var now = new Date();
      if (now.getFullYear() !== date.getFullYear()) {
        return date.format('YYYY/MM/DD');
      }
      var lastWeekNow = new Date();
      lastWeekNow.setDate(lastWeekNow.getDate() - 7);
      console.log('lastWeek', lastWeekNow);
      if (
        date.getMonth() < lastWeekNow.getMonth() ||
        (date.getMonth() === lastWeekNow.getMonth() && date.getDate() < lastWeekNow.getDate())
      ) {
        return date.format('MM/dd');
      }
      if (date.getMonth() === now.getMonth() && date.getDate() === now.getDate()) {
        return date.format('hh:mm');
      }
      var yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 7);
      if (date.getDate() === yesterday.getDate()) {
        return '昨天';
      }
      console.log('yesterday', yesterday);
      var weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return weekList[date.getDay()];
    }
  },
  methods: {
    goChat() {
      this.$router.push({
        path: '/chat',
        query: {
          userId: this.toUser.userId
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.container
  display flex
  .avatar
    flex none
    height 48px
    .avatar-img
      width 48px
      height 48px
  .right-container
    flex 1
    height 40px
    padding-top 4px
    padding-bottom 4px
    padding-left 8px
    padding-right 8px
    line-height 21px
    .username-date-div
      display flex
      .username
        font-weight 500
        font-size 14px
        flex 3
      .date
        text-align right
        font-size 8px
        color #808080
        flex 1
    .content
      color #808080
      font-size 10px
</style>

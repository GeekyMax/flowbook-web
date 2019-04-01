<template>
  <div v-if="username">
    <van-nav-bar :title="toUser" left-text="返回" left-arrow @click-left="goBack" z-index="200" />
    <div class="container">
      <wx-chat
        class="wx-chat"
        :data-array="wxChatData"
        :showShade="false"
        contactNickname="简叔"
        :getUpperData="getUpperData"
        :getUnderData="getUpperData"
        ownerAvatarUrl="https://flowbook-pic.oss-cn-hangzhou.aliyuncs.com/avatar/default.jpg"
        contactAvatarUrl="https://flowbook-pic.oss-cn-hangzhou.aliyuncs.com/avatar/default.jpg"
        width="100%"
      >
      </wx-chat>
      <div class="send-footer van-hairline--top">
        <van-field
          v-model="content"
          placeholder="输入内容"
          type="textarea"
          class="send-text"
          rows="1"
          border
          :autosize="{ maxHeight: 24, minHeight: 24 }"
        />
        <van-button @click="sendToUser" class="send-btn" type="info" round>发送</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import SortedSet from 'js-sorted-set';
import { mapGetters, mapMutations } from 'vuex';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import WxChat from '@/components/weixin/wxChat';
export default {
  name: 'Chat',
  components: { WxChat },
  data() {
    return {
      wxChatSet: {},
      loading: false,
      nextPage: 1,
      toUser: '',
      content: '',
      messageList: [],
      wxChatData: [],
      stompClient: {},
      socket: {}
    };
  },
  computed: {
    ...mapGetters(['username'])
  },
  created() {
    this.toUser = this.$route.query.toUser;
    console.log('username is ' + this.username);
    if (this.username === '' || this.username == null) {
      var username = window.localStorage.getItem('username');
      this.setUsername(username);
    }
    this.wxChatSet = new SortedSet({
      comparator: function(a, b) {
        return a.id - b.id;
      }
    });
    this.connect();
  },

  beforeDestroy() {
    this.disconnect();
  },
  methods: {
    connect() {
      this.socket = new SockJS('http://localhost:8080/flowbook-ws');

      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect({}, frame => {
        this.stompClient.subscribe('/user/topic/private', greeting => {
          const parse = JSON.parse(greeting.body);
          this.showMessage(parse);
        });
        this.stompClient.subscribe('/user/topic/history', data => {
          console.log(data);
          const parse = JSON.parse(data.body);
          if (parse && parse.messageList) {
            // parse.messageList.list.forEach(item => {
            //   this.showMessage(item);
            // });
            var newList = [];
            parse.messageList.list.forEach(message => {
              newList.push({
                direction: message.senderName === this.username ? 2 : 1,
                type: 1,
                id: message.id,
                content: message.content,
                ctime: message.sendTime
              });
            });
            this.wxChatData = newList.reverse().concat(this.wxChatData);
            this.nextPage = parse.messageList.nextPage;
            this.loading = false;
          }
        });
        this.getMessageHistory();
      });
    },
    disconnect() {
      if (this.stompClient !== null) {
        this.stompClient.disconnect();
      }
      console.log('Disconnected');
    },
    sendToUser() {
      this.wxChatSet.forEach(item => {
        console.log(item);
      });
      console.log(this.wxChatSet.map(x => x));
      if (this.content.trim() === '') {
        this.content = '';
        return;
      }
      this.stompClient.send(
        '/app/chat',
        JSON.stringify({
          senderName: this.username,
          content: this.content,
          receiverName: this.toUser
        }),
        {}
      );
      this.content = '';
    },
    showMessage(message) {
      console.log(
        'id ' +
          message.id +
          ' message from ' +
          message.senderName +
          ' to ' +
          message.receiverName +
          ': ' +
          message.content +
          ' at ' +
          message.sendTime
      );
      this.messageList.push(message);
      var newMessage = {
        direction: message.senderName === this.username ? 2 : 1,
        type: 1,
        id: message.id,
        content: message.content,
        ctime: message.sendTime
      };
      this.wxChatSet.insert(newMessage);
      this.wxChatData.push(newMessage);
    },
    getUnderData() {},
    getUpperData() {
      return new Promise(this.getMessageHistory);
    },
    goBack() {
      this.$router.go(-1);
    },
    getMessageHistory() {
      if (this.loading) {
        return;
      }
      this.stompClient.send(
        '/app/history',
        JSON.stringify({
          senderName: this.username,
          receiverName: this.toUser,
          pageNum: this.nextPage
        }),
        {}
      );
      this.loading = true;
    },
    ...mapMutations({
      setUsername: 'SET_USERNAME_MUTATION'
    })
  }
};
</script>

<style scoped lang="stylus">
.nav-bar
  z-index 200
.container
  display flex
  .wx-chat
    width 100%
    margin-top 46px
    flex 1
  .send-footer
    flex 0
    background-color #f5f5f5
    z-index 200
    padding 6px 0
    width 100%
    position fixed
    bottom 0
    right 0
    display flex
    .send-btn
      margin-left 6px
      margin-right 6px
      flex none
      border-radius 12px
    .send-text
      font-size 16px
      flex 1
      border-radius 12px
      margin-left 6px
</style>

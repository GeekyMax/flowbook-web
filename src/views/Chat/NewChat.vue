<template>
  <div>
    <van-nav-bar :title="toUserInfo.username" left-text="返回" left-arrow @click-left="goBack" z-index="200" />
    <div class="container">
      <wx-chat
        id="wx-chat"
        class="wx-chat"
        :data-array="messageList"
        :showShade="false"
        :getUpperData="getUpperData"
        :getUnderData="getUnderData"
        ownerAvatarUrl="https://flowbook-pic.oss-cn-hangzhou.aliyuncs.com/avatar/default.jpg"
        contactAvatarUrl="https://flowbook-pic.oss-cn-hangzhou.aliyuncs.com/avatar/default.jpg"
        width="100%"
      >
      </wx-chat>
      <div class="send-footer van-hairline--top">
        <van-field
          v-model="input"
          placeholder="输入内容"
          type="textarea"
          class="send-text"
          rows="1"
          border
          :autosize="{ maxHeight: 24, minHeight: 24 }"
        />
        <van-button @click="onSendClick" class="send-btn" type="info" round>发送</van-button>
      </div>
      <div style="color: red">红色</div>
    </div>
  </div>
</template>

<script>
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import { Toast } from 'vant';
import WxChat from '@/components/weixin/wxChat';

export default {
  name: 'NewChat',
  components: { WxChat },
  data() {
    return {
      toUserInfo: {
        userId: 0,
        username: '',
        avatar: ''
      },
      userInfo: {
        userId: 0,
        username: '',
        avatar: ''
      },
      chat: {
        id: 0
      },
      messageList: [],
      input: '',
      socket: {},
      stompClient: {},
      nextPage: 1,
      onBottom: false
    };
  },
  watch: {},
  created() {
    this.toUserInfo.userId = parseInt(this.$route.query.userId);
    if (this.toUserInfo.userId == null) {
      Toast('无用户id');
      return;
    }
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
        // 订阅一般消息
        this.stompClient.subscribe('/user/topic/message', greeting => {
          const message = JSON.parse(greeting.body);
          console.log('get message', message);
          if (!this.scrollElement) {
            this.scrollElement = document.getElementById('scrollLoader-container');
          }
          if (this.scrollElement) {
            this.onBottom =
              this.scrollElement.scrollTop + this.scrollElement.clientHeight === this.scrollElement.scrollHeight;
          }
          const showMessage = {
            direction: message.userId === this.userInfo.userId ? 2 : 1,
            type: 1,
            id: message.id,
            content: message.content,
            ctime: message.sendTime
          };
          this.messageList.push(showMessage);
          // 滚动到底部
          this.scrollToBottom();
        });
        // 订阅开始会话消息
        this.stompClient.subscribe('/user/topic/start', greeting => {
          const parse = JSON.parse(greeting.body);
          if (!parse) {
            return;
          }
          console.log('get start: ', parse);
          const chat = parse.specificChat;
          this.chat = chat;
          if (chat && chat.userList && chat.userList.length > 0) {
            chat.userList.forEach(user => {
              if (user.userId === this.toUserInfo.userId) {
                this.toUserInfo = user;
              } else {
                this.userInfo = user;
              }
            });
          }
          if (!parse.isNew) {
            this.appendHistoryMessages(parse.messageList.list);
            this.nextPage = parse.messageList.nextPage;
          }
          this.forceScrollToBottom();
        });
        // 订阅初始会话列表消息
        this.stompClient.subscribe('/user/topic/init', greeting => {
          const parse = JSON.parse(greeting.body);
          console.log('get init list: ', parse);
        });
        // 订阅历史消息
        this.stompClient.subscribe('/user/topic/more', greeting => {
          const parse = JSON.parse(greeting.body);
          console.log('get history list: ', parse);
          this.nextPage = parse.messageList.nextPage;
          this.appendHistoryMessages(parse.messageList.list);
        });
        this.startChat(this.toUserInfo.userId);
      });
    },
    disconnect() {
      if (this.stompClient !== null) {
        this.stompClient.disconnect();
      }
      console.log('Disconnected');
    },
    startChat(toUserId) {
      this.stompClient.send(
        '/app/startChat',
        JSON.stringify({
          receiverId: toUserId,
          pageSize: 5
        })
      );
    },
    sendMessage(chatId, content) {
      this.stompClient.send(
        '/app/message',
        JSON.stringify({
          chatId: chatId,
          messageType: 'TEXT',
          content: content
        })
      );
    },
    initMessageList() {
      this.stompClient.send(
        '/app/init',
        JSON.stringify({
          userId: 0
        })
      );
    },
    // 发送拉取历史记录请求
    getHistory() {
      if (this.nextPage === 0) {
        return false;
      }
      this.stompClient.send(
        '/app/more',
        JSON.stringify({
          pageSize: 5,
          pageNum: this.nextPage,
          chatId: this.chat.id
        })
      );
      return true;
    },
    // 将历史消息添加进去
    appendHistoryMessages(messages) {
      console.log('test userid', this.userInfo.userId);
      const newList = [];
      messages.forEach(message => {
        newList.push({
          direction: message.userId === this.userInfo.userId ? 2 : 1,
          type: 1,
          id: message.id,
          content: message.content,
          ctime: message.sendTime
        });
      });
      this.messageList = newList.reverse().concat(this.messageList);
    },
    getUnderData() {
      //do nothing
      return new Promise(resolve => {
        resolve(true);
      });
    },
    getUpperData() {
      // 加载更多历史消息
      return new Promise(resolve => {
        if (this.getHistory()) {
          // 未到底
          resolve(false);
        } else {
          // 到底了
          resolve(true);
        }
      });
    },
    onSendClick() {
      // 空消息 不发送
      if (this.input.trim() === '') {
        this.input = '';
        this.scrollToBottom();
        return;
      }
      this.sendMessage(this.chat.id, this.input);
      this.input = '';
    },
    goBack() {
      this.$router.go(-1);
    },
    // 当在底部时接收到新消息时,滚动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        if (this.scrollElement && this.onBottom) {
          console.log('scroll to bottom');
          this.scrollElement.scrollTop = this.scrollElement.scrollHeight;
        }
      });
    },
    // 初始时,强制滚动到底部
    forceScrollToBottom() {
      this.$nextTick(() => {
        this.scrollElement = document.getElementById('scrollLoader-container');
        this.scrollElement.scrollTop = this.scrollElement.scrollHeight - this.scrollElement.clientHeight;
      });
    }
  }
};
</script>

<style scoped lang="stylus">
.nav-bar
  z-index 200
.container
  .wx-chat
    width 100%
    margin-top 46px
    margin-bottom 56px
    position absolute
    bottom 0
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

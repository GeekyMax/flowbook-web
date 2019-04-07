<template>
  <div class="my-container">
    <div>
      <van-nav-bar title="消息" />
      <!--<mu-appbar style="width: 100%;" color="primary" title="消息">-->
      <!--<mu-button icon slot="left">-->
      <!--<mu-icon value="menu"></mu-icon>-->
      <!--</mu-button>-->
      <!--<mu-menu slot="right">-->
      <!--<mu-button flat><mu-icon value="add"></mu-icon></mu-button>-->
      <!--<mu-list slot="content">-->
      <!--<mu-list-item button>-->
      <!--<mu-list-item-content>-->
      <!--<mu-list-item-title>发起会话</mu-list-item-title>-->
      <!--</mu-list-item-content>-->
      <!--</mu-list-item>-->
      <!--<mu-list-item button>-->
      <!--<mu-list-item-content>-->
      <!--<mu-list-item-title>更多</mu-list-item-title>-->
      <!--</mu-list-item-content>-->
      <!--</mu-list-item>-->
      <!--</mu-list>-->
      <!--</mu-menu>-->
      <!--</mu-appbar>-->
    </div>
    <div>
      <chat-list-item
        v-for="chat in this.chatList"
        :key="chat"
        :user-id="userId"
        :chat="chat"
        v-if="chat.messageList.length > 0"
      />
    </div>
  </div>
</template>

<script>
import ChatListItem from '@/views/Chat/ChatListItem';
import Stomp from 'webstomp-client';
import SockJS from 'sockjs-client';

export default {
  name: 'ChatList',
  components: { ChatListItem },
  data() {
    return {
      userId: 0,
      socket: {},
      stompClient: {},
      chatList: []
    };
  },
  created() {
    this.connect();
  },
  methods: {
    connect() {
      this.socket = new SockJS('http://localhost:8080/flowbook-ws');

      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect({}, frame => {
        // 订阅初始会话列表消息
        this.stompClient.subscribe('/user/topic/init', greeting => {
          const parse = JSON.parse(greeting.body);
          console.log('get init list: ', parse);
          this.userId = parse.userId;
          this.chatList = parse.chatList;
        });
        this.initMessageList();
      });
    },
    initMessageList() {
      this.stompClient.send(
        '/app/init',
        JSON.stringify({
          userId: 0
        })
      );
    }
  }
};
</script>

<style scoped lang="stylus">
.my-container
  height 100%
  background-color #f5f5f5
</style>

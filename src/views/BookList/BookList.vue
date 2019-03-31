<template>
  <keep-alive>
    <div class="home">
      <van-list v-model="loading" :finished="isLastPage" finished-text="没有更多了" @load="loadMoreBook">
        <book-item v-for="book in bookList" :data="book" :key="book" @click.native="showBook(book)" />
      </van-list>
    </div>
  </keep-alive>
</template>

<script>
import bookItem from '@/components/bookItem/bookItem';
import { listBook, listSellerBook } from '@/api/api';
import { mapMutations } from 'vuex';
import GoodItem from '@/components/goodItem/goodItem';

export default {
  name: 'BookList',
  components: { GoodItem, bookItem },
  comments: {
    bookItem
  },
  props: {
    category: {
      type: String,
      default: ''
    },
    sellerId: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    }
  },
  data: function() {
    return {
      loading: false,
      bookList: [],
      pageNum: 1,
      pageSize: 20,
      total: 0,
      pages: 1,
      isLastPage: false
    };
  },
  mounted() {
    this.loadMoreBook();
  },
  methods: {
    loadMoreBook() {
      this.loading = true;
      if (this.isLastPage) {
        this.loading = false;
        return;
      }
      var loadBook = listSellerBook;
      if (this.sellerId > 0) {
        loadBook = listSellerBook;
        loadBook({
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: this.sellerId
        }).then(result => {
          console.log('load more book', result);
          if (result.code === 0) {
            const data = result.data;
            this.total = data.total;
            this.pageNum = data.nextPage;
            this.isLastPage = data.isLastPage;
            this.bookList.push(...data.list);
          }
          this.loading = false;
        });
      } else {
        loadBook = listBook;
        loadBook({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }).then(result => {
          console.log('load more book', result);
          if (result.code === 0) {
            const data = result.data;
            this.total = data.total;
            this.pageNum = data.nextPage;
            this.isLastPage = data.isLastPage;
            this.bookList.push(...data.list);
          }
          this.loading = false;
        });
      }
    },
    showBook(book) {
      // this.setBook(book);
      this.$router.push({
        path: '/book',
        query: {
          bookId: book.id
        }
      });
    },
    ...mapMutations({
      setBook: 'SET_GOOD_MUTATION'
    })
  }
};
</script>

<style lang="stylus" scoped>
.home
  background-color #eee
  margin-bottom 50px
</style>

<template>
  <div class="home">
    <van-list v-model="loading" :finished="isLastPage" finished-text="没有更多了" @load="loadMoreBook">
      <van-cell v-for="book in bookList" :key="book" @click="showBook(book)">
        <book-item :data="book"/>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import bookItem from '@/components/bookItem/bookItem';
import { listBook } from '@/api/api';
import { mapMutations } from 'vuex';

export default {
  name: 'BookList',
  components: { bookItem },
  comments: {
    bookItem
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
      listBook({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(result => {
        if (result.code === 0) {
          const data = result.data;
          this.total = data.total;
          this.pageNum = data.nextPage;
          this.isLastPage = data.isLastPage;
          this.bookList.push(...data.list);
        }
        this.loading = false;
      });
    },
    showBook(book) {
      this.setBook(book);
      this.$router.push('/book');
    },
    ...mapMutations({
      setBook: 'SET_GOOD_MUTATION_WITH_SAVE'
    })
  }
};
</script>

<style lang="stylus" scoped>
  .home
    background-color #eee
    margin-bottom 50px
</style>

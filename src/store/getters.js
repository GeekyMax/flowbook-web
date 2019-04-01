const getters = {
  good: state => {
    return state.good;
  },
  orderGood: state => {
    return state.orderGood;
  },
  addressList: state => {
    return state.addressList;
  },
  editAddress: state => {
    return state.editAddress;
  },
  addressId: state => {
    return state.addressId;
  },
  book: state => {
    return state.book;
  },
  orderBook: state => {
    return state.orderBook;
  },
  userInfo: state => {
    return state.userInfo;
  },
  me: state => {
    return state.me;
  },
  username: state => {
    console.log(state.username);
    if (state.username === null && state.username === '') {
      const username = window.localStorage.getItem('username');
      if (username) {
        state.username = username;
        return username;
      }
      return '';
    }
    return state.username;
  }
};
export default getters;

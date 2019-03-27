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
  }
};
export default getters;

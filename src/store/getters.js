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
  }
};
export default getters;

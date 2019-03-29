import * as types from './mutations-types';

const mutations = {
  [types.SET_GOOD_MUTATION](state, payload) {
    state.good = payload;
  },
  [types.SET_ORDERGOOD_MUTATION](state, payload) {
    state.orderGood = payload;
  },
  [types.SET_ADDRESS_LIST_MUTATION](state, payload) {
    state.addressList = payload;
  },
  [types.SET_EDITADDRESS_MUTATION](state, payload) {
    state.editAddress = payload;
  },
  [types.SET_ADDRESSID_MUTATION](state, payload) {
    state.addressId = payload;
  },
  [types.SET_BOOK_MUTATION](state, payload) {
    state.book = payload;
  },
  [types.SET_BOOK_MUTATION_WITH_SAVE](state, payload) {
    state.book = payload;
    storeLocalStore('book', payload);
  },
  [types.SET_ORDER_BOOK_MUTATION](state, payload) {
    state.orderBook = payload;
  },
  [types.SET_USER_INFO_MUTATION](state, payload) {
    state.userInfo = payload;
  },
  [types.SET_ME_MUTATION](state, payload) {
    state.me = payload;
  },
  [types.UPDATE_ADDRESS_MUTATION](state, payload) {
    for (let i = 0; i < state.addressList.length; i++) {
      if (state.addressList[i].id === payload.id) {
        state.addressList[i] = payload;
      }
    }
  }
};
function storeLocalStore(name, state) {
  console.log('save ' + name);
  window.localStorage.setItem(name, JSON.stringify(state));
}

export default mutations;

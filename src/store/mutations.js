import * as types from './mutations-types';

const mutations = {
  [types.SET_GOOD_MUTATION](state, payload) {
    state.good = payload;
  },
  [types.SET_ORDERGOOD_MUTATION](state, payload) {
    state.orderGood = payload;
  },
  [types.SET_ADDRESSLIST_MUTATION](state, payload) {
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
  }
};
function storeLocalStore(name, state) {
  console.log('save ' + name);
  window.localStorage.setItem(name, JSON.stringify(state));
}

export default mutations;

<template>
  <transition name="slide">
    <div>
      <van-nav-bar title="地址列表" left-text="返回" left-arrow @click-left="goBack" :z-index="10" fixed />
      <van-address-list
        v-model="chosenAddressId"
        class="address-list"
        :list="list"
        @add="addAddress"
        @edit="onEdit"
        @select="onSelect"
      />
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  data() {
    return {
      chosenAddressId: 0
    };
  },
  mounted() {
    this.getDefaultId();
    console.log(this.chosenAddressId);
  },
  computed: {
    list() {
      var arr = [];
      this.addressList.forEach(item => {
        if (item.isDefault === true) {
          this.chosenAddressId = item.id;
        }
        var obj = {};
        obj.id = item.id;
        obj.name = item.name;
        obj.tel = item.phone;
        obj.address = item.address + item.addressDetail;
        arr.push(obj);
      });
      return arr;
    },
    ...mapGetters(['addressList'])
  },
  methods: {
    onAdd() {},
    onEdit(item) {
      console.log('on edit' + item.id);
      let id = item.id;
      for (let i = 0; i < this.addressList.length; i++) {
        console.log('this.addressList', this.addressList[i].id);
        if (this.addressList[i].id === id) {
          var address = this.addressList[i];
          this.setEditAddress(address);
          this.$router.push({
            path: '/EditAddress',
            query: {
              index: item.id
            }
          });
          break;
        }
      }
    },
    onSelect() {
      console.log('onselect', this.chosenAddressId);
      this.setAddressId(this.chosenAddressId);
    },
    getDefaultId() {
      let id = 1;
      for (let i = 0; i < this.addressList.length; i++) {
        if (this.addressList[i].isDefault === true) {
          id = this.addressList[i].id;
          break;
        }
      }
      this.chosenAddressId = id;
    },
    goBack() {
      this.$router.go(-1);
    },
    addAddress() {
      this.$router.push({
        path: '/editAddress',
        query: {
          new: true
        }
      });
    },
    ...mapMutations({
      setAddressId: 'SET_ADDRESSID_MUTATION',
      setEditAddress: 'SET_EDITADDRESS_MUTATION'
    })
  }
};
</script>

<style lang="stylus" scoped>
.address-list
  padding-top 46px

.slide-enter-active, .slide-leave-active
  transition all 0.3s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)
</style>

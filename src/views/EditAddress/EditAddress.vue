<template>
  <transition name="slide">
    <div class="my-container">
      <van-nav-bar title="地址编辑" left-text="返回" left-arrow @click-left="goBack" :z-index="10" />
      <div>
        <van-cell-group>
          <div>
            <van-field label="姓名" placeholder="收货人姓名" type="text" v-model="addressInfo.name" />
          </div>

          <div>
            <van-field label="电话" placeholder="收货人手机号" type="text" v-model="addressInfo.phone">你好</van-field>
          </div>
          <div class="van-cell van-field">
            <div class="van-cell__title van-field__label"><span>地区</span></div>
            <div class="van-cell__value">
              <div class="van-field__body">
                <input
                  type="text"
                  placeholder="选择校区"
                  readonly="readonly"
                  class="van-field__control"
                  @click="clickAddress"
                  v-model="addressInfo.address"
                />
              </div>
            </div>
          </div>
          <div>
            <van-field label="详细地址" placeholder="园区 寝室号" type="text" v-model="addressInfo.addressDetail" />
          </div>
          <van-switch-cell v-model="addressInfo.isDefault" title="设为默认地址" />
        </van-cell-group>
        <div class="button-group">
          <van-button type="danger" size="large" class="btn" @click="onSave">保存</van-button>
          <van-button size="large" class="btn" @click="onDelete">删除</van-button>
        </div>
      </div>
      <van-popup v-model="show" position="bottom">
        <van-picker :columns="addressColumns" show-toolbar @cancel="show = false" @confirm="confirmAddress" />
      </van-popup>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { Toast } from 'vant';
import { addAddress, removeAddress, updateAddress } from '@/api/api';
import { REMOVE_ADDRESS_MUTATION } from '@/store/mutations-types';
export default {
  data() {
    return {
      isNew: false, //1 代表新增.0 其他代表修改
      addressColumns: ['玉泉', '紫金港'],
      schoolList: {
        province_list: {
          100000: '未选择',
          110000: '浙江大学',
          120000: '城市学院'
        },
        city_list: {
          110100: '玉泉',
          110200: '紫金港',
          110300: '西溪',
          110400: '之江'
        }
      },
      show: false,
      isDefault: true,
      addressInfo: {
        name: '',
        phone: '',
        address: '',
        addressDetail: '',
        isDefault: false,
        userId: 0
      }
    };
  },
  mounted() {
    console.log(this.editAddress);
  },
  computed: {
    ...mapGetters(['editAddress'])
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    onSave(content) {
      if (this.isNew) {
        addAddress(this.addressInfo).then(result => {
          if (result.code === 0) {
            this.addAddress(this.addressInfo);
            Toast('添加成功');
            this.$router.go(-1);
          } else {
            Toast('修改失败');
          }
        });
      } else {
        updateAddress(this.addressInfo)
          .then(result => {
            if (result.code === 0) {
              this.updateAddressState(this.addressInfo);
              Toast('修改成功');
              this.$router.go(-1);
            } else {
              Toast('修改失败');
            }
          })
          .catch(err => {
            Toast(err);
          });
      }
    },
    onDelete() {
      if (this.isNew) {
        this.$router.go(-1);
      } else {
        removeAddress({ addressId: this.addressInfo.id })
          .then(result => {
            if (result.code === 0) {
              this.removeAddressState(this.addressInfo.id);
              Toast('删除成功');
              this.$router.go(-1);
            } else {
              Toast('删除失败');
            }
          })
          .catch(err => {
            Toast(err);
          });
      }
    },
    clickAddress() {
      this.show = true;
    },
    confirmAddress(value, index) {
      this.show = false;
      Toast(value, index);
      this.addressInfo.address = value;
    },
    ...mapMutations({
      updateAddressState: 'UPDATE_ADDRESS_MUTATION',
      removeAddressState: 'REMOVE_ADDRESS_MUTATION',
      addAddress: 'ADD_ADDRESS_MUTATION'
    })
  },
  created() {
    let n = this.$route.query.new;
    if (n != null) {
      this.isNew = true;
    } else {
      this.addressInfo = this.editAddress;
    }
  }
};
</script>

<style lang="stylus" scoped>
.my-container
  background #f5f5f5
  height 100%
.slide-enter-active, .slide-leave-active
  transition all 0.3s

.slide-enter, .slide-leave-to
  opacity 0
  transform translate3d(100%, 0, 0)

.button-group
  padding 12px

.btn
  margin-bottom 12px
</style>

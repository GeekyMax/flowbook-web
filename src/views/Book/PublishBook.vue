<template>
  <div>
    <!--<van-nav-bar title="发布图书" left-arrow left-text="返回" @click-left="goBack" />-->
    <div class="my-container">
      <div class="submit-container">
        <van-cell style="background-color: transparent">
          <!--<van-button type="info" size="large" round @click="onSubmitClicked">发布图书</van-button>-->
          <mu-button full-width large round color="primary" @click="onSubmitClicked">发布图书</mu-button>
        </van-cell>
      </div>
      <div class="field-container">
        <van-cell-group style="margin-bottom: 12px" title="基本信息">
          <van-field v-model="book.bookName" placeholder="输入书名及简单信息" label="书籍标题" clearable />
          <cube-validator
            v-model="valid.bookName"
            :model="book.bookName"
            :rules="rules.bookName"
            messages="你好"
          ></cube-validator>
          <van-field
            clearable
            v-model="book.description"
            placeholder="描述书籍的转手原因,购入渠道和具体细节等"
            label="书籍描述"
            type="textarea"
            rows="1"
            autosize
          />
          <van-cell class="upload-container">
            <div class="upload-label">上传图片({{ book.pictureUrlList.length }}/8)</div>
            <cube-upload
              :action="action"
              :simultaneous-uploads="1"
              @files-added="filesAdded"
              @file-success="fileSuccess"
              @file-removed="fileRemoved"
            />
          </van-cell>
          <van-field v-model="book.sellPrice" placeholder="输入出售价格" type="number" label="出售价格" />
          <van-field v-model="book.category" label="分类" placeholder="输入图书分类" />
        </van-cell-group>
        <van-cell-group title="交易信息">
          <div class="van-cell van-field">
            <div class="van-cell__title van-field__label"><span>交易方式</span></div>
            <div class="van-cell__value">
              <div class="van-field__body">
                <input
                  :value="this.book.dealingMethod"
                  type="text"
                  placeholder="选择交易方式"
                  readonly="readonly"
                  class="van-field__control"
                  @click="show.dealingMethod = true"
                />
              </div>
            </div>
          </div>
          <div class="van-cell van-field">
            <div class="van-cell__title van-field__label"><span>配送方式</span></div>
            <div class="van-cell__value">
              <div class="van-field__body">
                <input
                  :value="deliveryMethod"
                  type="text"
                  placeholder="选择配送方式"
                  readonly="readonly"
                  class="van-field__control"
                  @click="show.deliveryMethod = true"
                />
              </div>
            </div>
          </div>
          <div class="van-cell van-field" v-if="allowDelivery">
            <div class="van-cell__title van-field__label"><span>支持配送校区</span></div>
            <div class="van-cell__value">
              <div class="van-field__body">
                <input
                  :value="deliverySchoolAddress"
                  type="text"
                  placeholder="选择配送校区"
                  readonly="readonly"
                  class="van-field__control"
                  @click="show.deliverySchoolAddress = true"
                />
              </div>
            </div>
          </div>
          <div class="van-cell van-field" v-if="allowPickUp">
            <div class="van-cell__title van-field__label"><span>自提校区</span></div>
            <div class="van-cell__value">
              <div class="van-field__body">
                <input
                  :value="this.book.pickSchoolAddress"
                  type="text"
                  placeholder="选择自提校区"
                  readonly="readonly"
                  class="van-field__control"
                  @click="show.pickSchoolAddress = true"
                />
              </div>
            </div>
          </div>
        </van-cell-group>
        <van-cell-group title="书籍参数 (可选)">
          <van-field label="作者" placeholder="输入作者" v-model="book.author" />
          <van-field label="版次" placeholder="输入版次" v-model="book.version" />
          <van-field label="原价" placeholder="输入原价" type="number" v-model="book.originalPrice" />
          <van-field label="成色" placeholder="输入成色(10代表全新)" type="number" v-model="book.quality" />
          <van-field label="isbn" placeholder="输入书籍编号" v-model="book.isbn" />
        </van-cell-group>
      </div>

      <van-popup v-model="show.dealingMethod" position="bottom">
        <van-picker :columns="column.dealingMethod" @change="changeDealingMethod" />
      </van-popup>
      <van-popup v-model="show.deliveryMethod" position="bottom">
        <van-checkbox-group v-model="book.deliveryMethodList">
          <van-cell
            v-for="(item, index) in column.deliveryMethod"
            clickable
            :key="item"
            :title="`支持 ${item}`"
            @click="toggleDeliveryMethod(index)"
          >
            <van-checkbox :name="item" ref="delivery_method_checkboxes" />
          </van-cell>
        </van-checkbox-group>
      </van-popup>
      <van-popup v-model="show.deliverySchoolAddress" position="bottom">
        <van-checkbox-group v-model="book.deliverySchoolAddressList">
          <van-cell
            v-for="(item, index) in column.deliverySchoolAddress"
            clickable
            :key="item"
            :title="`${item}校区`"
            @click="toggleDeliverySchoolAddress(index)"
          >
            <van-checkbox :name="item" ref="delivery_school_address_checkboxes" />
          </van-cell>
        </van-checkbox-group>
      </van-popup>
      <van-popup v-model="show.pickSchoolAddress" position="bottom">
        <van-picker :columns="column.pickSchoolAddress" @change="changeDeliverySchoolAddress" />
      </van-popup>
      <div style="height: 100px" />
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import { publishBook } from '@/api/api';

export default {
  name: 'PublishBook',
  data() {
    return {
      valid: {
        bookName: undefined,
        category: undefined
      },
      rules: {
        bookName: {
          required: true,
          type: 'string',
          max: 80
        },
        category: {
          required: true,
          type: 'string',
          max: 20
        },
        author: {
          required: false,
          type: 'string',
          max: 80
        },
        sellPrice: {
          required: true,
          type: 'number',
          max: 10000,
          min: 0
        }
      },
      action: {
        target: 'http://localhost:8080/storage/upload',
        prop: 'file',
        withCredentials: true
      },
      show: {
        dealingMethod: false,
        deliveryMethod: false,
        deliverySchoolAddress: false,
        pickSchoolAddress: false
      },
      column: {
        dealingMethod: ['', '线上交易', '线下交易', '线上线下'],
        deliveryMethod: ['自取', '配送'],
        deliverySchoolAddress: ['玉泉', '紫金港', '西溪', '之江', '华家池', '海宁', '舟山'],
        pickSchoolAddress: ['', '玉泉', '紫金港', '西溪', '之江', '华家池', '海宁', '舟山']
      },
      book: {
        bookName: '',
        commodityType: '出售',
        description: '',
        originalPrice: {},
        sellPrice: {},
        category: '',
        coverUrl: '',
        quality: 10,
        version: '',
        author: '',
        outerLinkList: [],
        pictureUrlList: [],
        dealingMethod: '',
        deliveryMethodList: [],
        deliverySchoolAddressList: ['玉泉', '紫金港', '西溪', '之江', '华家池', '海宁', '舟山'],
        pickSchoolAddress: ''
      }
    };
  },
  computed: {
    deliveryMethod() {
      return this.book.deliveryMethodList.join(', ');
    },
    deliverySchoolAddress() {
      if (this.book.deliverySchoolAddressList.length === this.column.deliverySchoolAddress.length) {
        return '全部校区';
      }
      return this.book.deliverySchoolAddressList.join(',');
    },
    allowPickUp() {
      for (let str of this.book.deliveryMethodList) {
        if (str === '自取') {
          return true;
        }
      }
      return false;
    },
    allowDelivery() {
      for (let str of this.book.deliveryMethodList) {
        if (str === '配送') {
          return true;
        }
      }
      return false;
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    changeDealingMethod(picker, value) {
      this.book.dealingMethod = value;
    },
    changeDeliverySchoolAddress(picker, value) {
      this.book.pickSchoolAddress = value;
    },
    toggleDeliveryMethod(index) {
      this.$refs.delivery_method_checkboxes[index].toggle();
    },
    toggleDeliverySchoolAddress(index) {
      this.$refs.delivery_school_address_checkboxes[index].toggle();
    },
    filesAdded(files) {
      let hasIgnore = false;
      let enough = false;
      const maxSize = 1024 * 1024 * 10; // 10M
      for (let file of files) {
        if (this.book.pictureUrlList.length >= 8) {
          file.ignore = true;
          enough = true;
        } else if (file.size > maxSize) {
          file.ignore = true;
          hasIgnore = true;
        }
      }
      hasIgnore && Toast('请不要选择大于10M的图片');
      enough && Toast('照片最多只能上传8张哦');
    },
    fileSuccess(file) {
      if (this.book.pictureUrlList.length > 8) {
        Toast('照片最多只能上传8张哦');
        return;
      }
      console.log(file);
      const response = file.response;
      if (response && response.code === 0) {
        this.book.pictureUrlList.push(response.data.url);
        file.url = response.data.url;
        this.book.coverUrl = this.book.pictureUrlList[0];
      } else {
        Toast('图片上传失败');
      }
    },
    fileRemoved(file) {
      console.log(file);
      let newList = [];
      if (this.book.pictureUrlList.length === 1) {
        this.book.coverUrl = '';
      }
      for (let url of this.book.pictureUrlList) {
        if (file.response.data.url !== url) {
          newList.push(url);
        }
      }
      this.book.pictureUrlList = newList;
    },
    onSubmitClicked() {
      publishBook(this.book)
        .then(result => {
          if (result.code === 0) {
            Toast('发布图书成功');
            this.$router.go(-1);
          } else {
            Toast('发布图书失败');
          }
        })
        .catch(err => {
          console.log(err);
          Toast('发布图书失败');
        });
    },
    validateAll() {}
  }
};
</script>

<style scoped lang="stylus">
.my-container
  background-color #f5f5f5
  height 100%
.submit-container
  z-index 100
  position fixed
  bottom 0
  width 100%
.upload-container
  padding-right  0
.upload-label
  margin-bottom 8px
.cube-validator
  padding-left 105px
</style>

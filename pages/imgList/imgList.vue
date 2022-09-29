<template>
  <view class="free-panel-title">
    <view class="free-WaterfallFlow">
      <view class="flex-wrap" v-for="(item, index) in imgList" :key="index">
        <image
          mode="widthFix"
          :src="item.imageUrl"
          :data-src="item.imageUrl"
          @click="clickimg"
        ></image>
        <view @click="downloadImg(item.imageUrl)">下载</view>
        <view @click="deleteImg(item)">删除</view>
        <view>{{ item.createTime }}</view>
      </view>
    </view>
    <view class="top" :style="{ display: flag === true ? 'block' : 'none' }" @click="top">
      返回顶部
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      imgList: [],
      flag: false
    }
  },
  onLoad() {
    this.selectImage()
  },
  methods: {
    // 查询图片列表
    async selectImage() {
      uni.showLoading({
        title: "查询中..."
      })
      try {
        const imgsDealObj = uniCloud.importObject("imgsDealObj")
        const objRes = await imgsDealObj.get()
        console.log("objRes", objRes)
        this.imgList = objRes.data
        this.imgList.forEach(item => {
          //循环调用函数happenTimeFun，将时间戳转为年月日
          item.createTime = this.happenTimeFun(item.createTime)
        })
        uni.hideLoading()
      } catch (e) {
        uni.showModal({
          title: "失败",
          content: e.errMsg,
          showCancel: false
        })
      }
    },
    // 时间戳数据处理
    happenTimeFun(num) {
      let date = new Date(num) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? "0" + MM : MM //月补0
      let d = date.getDate()
      d = d < 10 ? "0" + d : d //天补0
      let h = date.getHours()
      h = h < 10 ? "0" + h : h //小时补0
      let m = date.getMinutes()
      m = m < 10 ? "0" + m : m //分钟补0
      let s = date.getSeconds()
      s = s < 10 ? "0" + s : s //秒补0
      return y + "-" + MM + "-" + d // 年月日
      //return y + '-' + MM + '-' + d + ' ' + h + ':' + m+ ':' + s; // 年月日时分秒
    },
    // 图片预览
    clickimg(event) {
      console.log(event)
      var imgurl = event.currentTarget.dataset.src
      var currentUrl = event.currentTarget.dataset.src //获取点击图片的地址, **对应<template>里面的 :data-src="item.imageUrl"
      uni.previewImage({
        urls: [imgurl], //这里是单图 . 需要预览的全部图片地址,这个数组是必须的,要用[]
        current: currentUrl //当前显示图片的地址
      })
    },
    //回到顶部
    top() {
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    },
    onPageScroll(e) {
      //根据距离顶部距离是否显示回到顶部按钮
      if (e.scrollTop > 600) {
        //当距离大于600时显示回到顶部按钮
        this.flag = true
      } else {
        //当距离小于600时隐藏回到顶部按钮
        this.flag = false
      }
    },
    downloadImg(url) {
      uni.downloadFile({
        url, // 图片路径
        success: res => {
          console.log(res)
          if (res.statusCode === 200) {
            // 预览文件
            // uni.openDocument({
            //   filePath: res.tempFilePath,
            //   success: function(file) {
            //     console.log("file-success", file)
            //   }
            // })
            // 保存文件至手机，一般存储路径为：手机存储/dcim/camera文件夹下
            uni.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function() {
                uni.showToast({
                  title: "保存成功！",
                  icon: "none"
                })
              },
              fail: function() {
                uni.showToast({
                  title: "保存失败，请稍后重试！",
                  icon: "none"
                })
              }
            })
          }
        }
      })
    },
    /** 调用云对象删除图片 */
    async deleteImg(item) {
      try {
        const imgsDealObj = uniCloud.importObject("imgsDealObj")
        const objRes = await imgsDealObj.del({
          id: item._id,
          fileId: item.imageUrl
        })
        console.log("objRes", objRes)
        this.selectImage()
      } catch (e) {
        uni.showModal({
          title: "失败",
          content: e.errMsg,
          showCancel: false
        })
      }
    }
  }
}
</script>

<style>
.free-WaterfallFlow {
  width: 96%;
  column-count: 2; /* 分隔的列数 */
}
.free-WaterfallFlow .flex-wrap {
  display: inline-block;
  width: 98%;
  margin-left: 3%;
  margin-bottom: 3%;
  padding: 2%;
  padding-top: 5%;
  border: 0px solid #cc22b0; /* 边框 */
  box-shadow: 0 2px 2px rgba(34, 25, 25, 0.4); /* 框阴影 */
  text-align: center; /* 框内元素居中对齐 */
}
.flex-wrap image {
  width: 100%;
  height: auto;
  margin: 0 auto;
}
/* 回到顶部 */
.top {
  width: 30px;
  position: fixed;
  right: 5px;
  top: 80%;
  background-color: #fff;
  text-align: center;
  display: none; /* 先将元素隐藏 */
}
</style>

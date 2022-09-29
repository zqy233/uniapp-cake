<template>
  <view>
    <button class="btn" type="default" @click="upload">上传图片</button>
    <button class="btn" type="default" @click="browseImage">查看云图片</button>
  </view>
</template>

<script>
export default {
  methods: {
    /** 选择并上传图片 */
    upload() {
      // 选择图片，默认不设置count属性的话最多9张
      uni.chooseImage({
        success: res => {
          // 通过遍历调用uniCloud.uploadFile来批量上传
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            uni.showLoading({
              title: "上传中..."
            })
            let filePath = res.tempFilePaths[i] // 选择图片的临时路径
            uniCloud.uploadFile({
              filePath, // 必传，要上传图片的临时路径
              cloudPath: Date.now() + "-img", // 必传，保存在云端的文件名，这里以时间戳命名
              success: res => {
                this.addImage(res)
              },
              fail(err) {
                console.log(err)
              },
              complete() {
                uni.hideLoading()
              }
            })
          }
        }
      })
    },
    /** 调用云对象上传图片 */
    async addImage(res) {
      try {
        let imageUrl = res.fileID // 云端返回的真实图片地址，存入数据库
        const imgsDealObj = uniCloud.importObject("imgsDealObj")
        const objRes = await imgsDealObj.add({
          imageUrl, // 图片路径
          createTime: Date.now() // 创建时间
        })
        uni.showToast({
          title: "上传成功"
        })
      } catch (e) {
        uni.showModal({
          title: "失败",
          content: e.errMsg,
          showCancel: false
        })
      }
    },
    /** 跳转到图片列表页面 */
    browseImage() {
      uni.navigateTo({
        url: "../imgList/imgList"
      })
    }
  }
}
</script>
<style>
.content {
  width: 300px;
  height: 150px;
  margin: auto;
  -webkit-mask: radial-gradient(circle at 7px, transparent 10px, red 0) -10px / 100% 30px;
  border-radius: 10px;
  background: linear-gradient(45deg, #f2c67d, #f9dea0);
}
</style>

"use strict"

const db = uniCloud.database()
module.exports = {
  add: async data => {
    // tableImages为云数据库里的表名，用于记录上传图片到云存储后返回的真实路径fileID，db.collection表示获取表'tableImages'的集合对象
    const collection = db.collection("tableImages")
    const res = await collection.add(data) // event为客户端上传的参数
    return res // 返回json给客户端
  },
  /**
   * 获取图片列表
   * @param {Object} data 可选，传递一个对象{ pageSize: number, pageIndex: number }，用于分页，不传则获取全部数据
   * @returns 列表数据
   */
  get: async data => {
    console.log(data)
    const collection = db.collection("tableImages")
    if (data) {
      const res = await collection
        .skip(data.pageIndex * data.pageSize)
        .limit(data.pageSize)
        .orderBy("createTime", "desc")
        .orderBy("_id", "desc")
        .get()
      return res
    } else {
      const res = await collection
        .orderBy("createTime", "desc")
        .orderBy("_id", "desc")
        .get()
      return res
    }
  },
  /**
   *
   * @param {Object} data
   * @returns
   */
  del: async data => {
    const collection = db.collection("tableImages")
    // 同时执行删除文件和删除表中数据的操作
    const res = await Promise.all([
      uniCloud.deleteFile({
        fileList: [data.fileId],
      }),
      collection.doc(data.id).remove(),
    ])
    // 返回删除文件和删除表中数据的操作结果
    return {
      deleteFile: res[0],
      deleleData: res[1],
    }
  },
}

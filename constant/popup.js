// alert
export const alert = (title = '', content, confirmText = '确定', onConfirm) => {
  wx.showModal({
    title,
    content, // 提示的内容,
    showCancel: false, // 是否显示取消按钮,
    confirmText, // 确定按钮的文字，默认为取消，最多 4 个字符,
    confirmColor: '#ff6633', // 确定按钮的文字颜色,
    success: res => {
      if (res.confirm && onConfirm) {
        onConfirm()
      }
    }
  })
}

// confirm
export const confirm = (title = '提示', content, confirmText = '确定', onConfirm, onCancel = null) => {
  wx.showModal({
    title, // 提示的标题,
    content, // 提示的内容,
    showCancel: true, // 是否显示取消按钮,
    cancelText: '取消', // 取消按钮的文字，默认为取消，最多 4 个字符,
    cancelColor: '#000000', // 取消按钮的文字颜色,
    confirmText, // 确定按钮的文字，默认为取消，最多 4 个字符,
    confirmColor: '#ff6633', // 确定按钮的文字颜色,
    success: res => {
      if (res.confirm) {
        onConfirm()
      } else if (res.cancel) {
        if (onCancel) {
          onCancel()
        }
      }
    }
  })
}
// toast
export const toast = (icon, title, onShow = null, duration = 2000, mask = true) => {
  wx.showToast({
    title, // 提示的内容,
    icon, // 图标,
    duration, // 延迟时间,
    mask, // 显示透明蒙层，防止触摸穿透,
    success: res => {
      if (onShow) {
        let timer = setTimeout(() => {
          onShow()
          clearTimeout(timer)
        }, duration)
      }
    }
  })
}

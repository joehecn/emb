
import { app, BrowserWindow, Menu, shell, ipcMain, dialog } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'
import ctrlMsg from './ctrlMsg/index.js'
import closeMqtt from './mqtt/index.js'

// 关闭警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let mainWindow = null

const isDevelopment = process.env.NODE_ENV !== 'production'

// Menu
const template = [{
  label: '编辑',
  submenu: [
    {role: 'undo', label: '撤销'},
    {role: 'redo', label: '重做'},
    {type: 'separator'},
    {role: 'cut', label: '剪切'},
    {role: 'copy', label: '复制'},
    {role: 'paste', label: '粘贴'},
    {role: 'delete', label: '删除'},
    {role: 'selectall', label: '全选'}
  ]
}, {
  role: 'help',
  submenu: [
    {
      label: '建议反馈...',
      click () {
        shell.openExternal('https://github.com/joehecn/emb/issues')
      }
    },
    {type: 'separator'},
    {
      label: '支持',
      click () {
        shell.openExternal('https://github.com/joehecn/emb')
      }
    }
  ]
}]
const createMenu = () => {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

// 开发模式
const makeDevelopmentMode = win => {
  win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}/`)

  // 打开开发者工具
  win.webContents.openDevTools()
}

// 生产模式
const makeProductMode = win => {
  win.loadURL(formatUrl({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }))
}

const createMainWindow = () => {
  // Menu
  createMenu()

  // 创建浏览器窗口。
  let win = new BrowserWindow({
    width: 800,
    height: 700,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // console.log('--------- win closed')
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    // 销毁相关对象
    closeMqtt()
    win = null
    mainWindow = null
  })

  // 开发模式
  if (isDevelopment) {
    makeDevelopmentMode(win)
    return win
  }

  // 生产模式
  makeProductMode(win)
  return win
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
  mainWindow = createMainWindow()
})

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // console.log('---- activate')
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (mainWindow === null) {
    // console.log('mainWindow === null')
    mainWindow = createMainWindow()
  }
})

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。

ipcMain.on('renderer-msg', async (event, msg) => {
  await ctrlMsg(msg, mainWindow)
  event.reply('main-msg', msg)
})

ipcMain.on('promise-msg', async (event, msg) => {
  await ctrlMsg(msg, mainWindow)
  event.reply(msg.eventName, msg)
})

ipcMain.on('show-save-dialog', (event, { type, defaultPath }) => {
  dialog.showSaveDialog(mainWindow, {
    defaultPath
  }).then(res => {
    if (res && !res.canceled) {
      event.reply('selected-file', { type, filePath: res.filePath })
    }
  })
})

import { exec } from 'child_process';
import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
// import decompress from 'decompress';
import * as  dl from 'electron-dl';
const decompress = require('decompress');
// const { download } = require('electron-dl');

const dataBat = '@echo off\n' +
  'set "label=USBVKS"\n' +
  ':a\n' +
  '::-------V----Change this to your drive Letter\n' +
  'if exist - %label%:\\ (goto Yes) else (goto a)\n' +
  '\n' +
  ':Yes\n' +
  '::V----Change this to your drive Letter\n' +
  'for /f "usebackq tokens=2 delims==" %%G in (`wmic logicaldisk where "drivetype=2 and volumename=\'%label%\'" get caption /value`) do (\n' +
  '    set "usbName=%%G"\n' +
  ')\n' +
  '::----V----You can put any Program you want here\n' +
  'start %usbName%\\File.bat\n' +
  'goto end\n' +
  '\n' +
  ':end'

let win: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

function createWindow(): BrowserWindow {

  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    // x: 0,
    // y: 0,
    // width: size.width,
    // height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: (serve),
      contextIsolation: false,
    },
  });

  // fs.writeFile('auto.bat', dataBat, (err) => {
  //   if (err) {
  //     console.error(err);
  //     return;
  //   }
  //   console.log('File JavaScript đã được tạo thành công!');
  // });

  // const batFilePath = 'auto.bat'
  // exec(`start /B ${batFilePath}`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Lỗi khi chạy tệp tin .bat: ${error.message}`);
  //     return;
  //   }
  //   if (stderr) {
  //     console.error(`Lỗi trong quá trình thực thi tệp tin .bat: ${stderr}`);
  //     return;
  //   }
  //   console.log(`Kết quả từ tệp tin .bat: ${stdout}`);
  // });

  const handleCreateFolder = (name: string) => {
    if (!fs.existsSync(name)) {
      try {
        fs.mkdirSync(name);
      } catch (err) {
        console.error('Loi tao thu muc:', err);
      }
      console.log("🚀 ~ handleCreateFolder ~ name:", name)
    } else {
      console.log(`${name} da ton tai`);
    }
  };

  const handleUnzip = () => {
    const files = fs.readdirSync('ZipData').filter((file) => {
      const extension = path.extname(file);
      return extension === '.zip';
    });
    if (files.length > 0) {
      files.forEach((file) => {
        console.log("🚀 ~ files.forEach ~ file:", file)
        const newFolderName = file.split(".zip")[0]
        decompress(`ZipData/${file}`, `ZipData/${newFolderName}`).then(() => {
          try {
            fs.unlinkSync(`ZipData/${file}`);
            console.log('Del zip ok');
          } catch (err) {
            console.log('Del zip not ok')
          }
        }).catch(() => { console.log('err') })
        // const fileName = file.split(/[\\/]/).pop();
      })
    }
  };

  const handleRename = () => {
    const newExtension = '.vks';
    const renamePath = 'RenameData'
    const rootPath = 'ZipData'
    const filesRoot = fs.readdirSync(rootPath)
    // copy files
    filesRoot.forEach(file => {
      const filesInFolder = fs.readdirSync(`${rootPath}/${file}`)
      if (!fs.existsSync(`${renamePath}/${file}`)) {
        fs.mkdirSync(`${renamePath}/${file}`);
        console.log('creating directory RenameData')
      }
      filesInFolder.forEach(fileInFolder => {
        if (!fs.existsSync(`${renamePath}/${fileInFolder}`)) {
          fs.copyFile(`${rootPath}/${file}/${fileInFolder}`, `${renamePath}/${file}/${fileInFolder}`, (err) => {
            if (err) {
              console.error('Error copy', err);
            } else {
              console.log('Copy done');
            }
          });
        }
      })
    });
    //rename files
    const filesRename = fs.readdirSync(renamePath)
    filesRename.forEach(file => {
      const filesInFolder = fs.readdirSync(`${rootPath}/${file}`)
      filesInFolder.forEach(fileInFolder => {
        const newFilePath = path.join(path.dirname(`${renamePath}/${file}/${fileInFolder}`), path.basename(`${renamePath}/${file}/${fileInFolder}`, path.extname(`${renamePath}/${file}/${fileInFolder}`)) + newExtension);
        fs.rename(`${renamePath}/${file}/${fileInFolder}`, newFilePath, (err) => {
          if (err) {
            console.error('Rename error');
          } else {
            console.log('Rename succeeded');
          }
        });
      })
    });
  };

  handleCreateFolder('ZipData');
  handleCreateFolder('RenameData');

  ipcMain.on('unzip', () => {
    handleUnzip();
  });
  ipcMain.on('switchOffline', () => {
    handleRename();
  });

  ipcMain.on('download-file', async (event, { downloadUrl, fileName }) => {
    // Use electron-dl to download the file
    const win = BrowserWindow.getFocusedWindow();
    const filesRoot = fs.readdirSync('ZipData')

    try {
      const options = {
        directory: filesRoot[0], // Thay đổi đường dẫn lưu trữ ở đây
        filename: fileName,
      };

      const downloadItem = await dl.download(win, downloadUrl, options);
      const savePath = downloadItem.getSavePath();
      console.log('Tệp đã được tải xuống tới:', savePath);
    } catch (error) {
      if (error) {
        console.info('item.cancel() đã được gọi');
      } else {
        console.error(error);
      }
    }
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });

  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    setTimeout(createWindow, 400)

    // ipcMain.on('unzip', (data) => {
    //   console.log("🚀 ~ ipcMain.on ~ data:", data)
    //   const files = fs.readdirSync('ZipData');
    //   console.log("🚀 ~ ipcMain.on ~ files:", files)
    // });

  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}

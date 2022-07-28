const { app, BrowserWindow, ipcMain, Menu, Tray, nativeImage, nativeTheme } = require('electron');
const fs = require('fs');
const path = require('path');
const platform = process.platform;

nativeTheme.themeSource = 'dark';

app.on('window-all-closed', () => {
    if(platform !== 'darwin') app.quit();
})
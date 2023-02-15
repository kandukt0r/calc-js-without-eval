const { app, BrowserWindow } = require('electron')

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 325,
		height: 560,
		backgroundColor: '#000000'
	})
	mainWindow.loadFile('index.html')
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
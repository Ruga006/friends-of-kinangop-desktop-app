# Friends of Kinangop Plateau Desktop App

This is a desktop application version of the "Friends of Kinangop Plateau" web app, packaged using Electron. It allows you to run the app locally on your computer without needing a browser or internet connection.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- npm (comes with Node.js)
- PowerShell (for running the desktop shortcut creation script on Windows)

## Installation and Running Locally

1. Open a terminal or command prompt in the project directory.

2. Install dependencies:

```bash
npm install
```

3. Run the app:

```bash
npm start
```

This will launch the desktop app window.

## Packaging the App

To package the app into a standalone Windows executable:

```bash
npm run package
```

The packaged app will be created in the `dist` folder.

## Creating a Desktop Shortcut (Windows)

To create a desktop shortcut to launch the app easily:

1. Open PowerShell in the project directory.

2. Run the shortcut creation script:

```powershell
.\create-desktop-shortcut.ps1
```

This will create a shortcut named "Friends of Kinangop Plateau.lnk" on your desktop.

## Notes

- You can customize the app icon by adding an `icon.ico` file in the project root and updating `main.js` and the shortcut script accordingly.
- The app runs locally and does not require internet access.

## Troubleshooting

- If you encounter permission issues running the PowerShell script, you may need to adjust your execution policy. Run PowerShell as Administrator and execute:

```powershell
Set-ExecutionPolicy RemoteSigned
```

Then try running the script again.

## License

MIT License

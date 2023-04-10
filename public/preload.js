// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");
const jsmediatags = require("jsmediatags");
const fs = require("fs");
const { Buffer } = require("buffer");

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("versions", process.versions);
  contextBridge.exposeInMainWorld("dialog", {
    open: () => {
      ipcRenderer.send("open-file-dialog");
    },
    save: (content) => {
      ipcRenderer.send("save-file-dialog");
      ipcRenderer.on("saved-file", (event, path) => {
        fs.writeFile(
          path.toString(),
          Buffer.from(JSON.stringify(content, null, 2)),
          (err) => {
            if (err) throw err;
            console.log("Saved!");
          }
        );
      });
    },
    getPaths: (setState) => {
      ipcRenderer.on("selected-files", (event, paths) => {
        setState(paths);
      });
    },
    removeEventListener: () => {
      ipcRenderer.removeAllListeners("selected-file");
    },
  });

  contextBridge.exposeInMainWorld("file", {
    getMetadata: (path) => {
      return new Promise((resolve, reject) => {
        new jsmediatags.Reader(path).read({
          onSuccess: (tag) => {
            resolve(tag);
          },
          onError: (error) => {
            reject(`Error: ${error.type} ${error.info}`);
          },
        });
      });
    },

    read: (path) => {
      return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
          if (err) reject("ERR: No such file");
          resolve(data.toString());
        });
      });
    },
  });

  contextBridge.exposeInMainWorld("app", {
    minimize: () => {
      ipcRenderer.send("minimize");
    },
    maximize: () => {
      ipcRenderer.send("maximize");
    },
    close: () => {
      ipcRenderer.send("close");
    },
  });
});

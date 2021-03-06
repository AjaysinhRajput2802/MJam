const fs = require("fs")
const path = require("path")
const findit = require("findit")
const mm = require("music-metadata")

const constants = require("./constants")

const readJSON = (filePath) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err)
        }

        jsonObj = JSON.parse(data.toString())
        resolve(jsonObj)
      })
    } else {
      reject(`No such file or directory: ${filePath}`)
    }
  })
}

const saveCache = () => {
  fs.mkdir(path.dirname(constants.CACHED_FILE_SRC), {
    recursive: true
  }, () => {
    fs.writeFile(
      constants.CACHED_FILE_SRC,
      JSON.stringify(state.songsMap),
      (err) => {
        if (err) {
          console.log(err)
        }
      })
  })
}

const saveRecentSongs = () => {
  fs.mkdir(path.dirname(constants.RECENT_SONGS_FILE_SRC), {
    recursive: true
  }, () => {
    fs.writeFile(
      constants.RECENT_SONGS_FILE_SRC,
      JSON.stringify(state.recentSongSources),
      (err) => {
        if (err) {
          console.log(err)
        }
      })
  })
}

const saveSettings = async () => {
  fs.mkdir(path.dirname(constants.SETTINGS_FILE_SRC), {
    recursive: true
  }, () => {
    fs.writeFile(
      constants.SETTINGS_FILE_SRC,
      JSON.stringify(state.settings),
      (err) => {
        if (err) {
          console.log(err)
        }
      })
  })
}

const savePlaylists = async () => {
  fs.mkdir(path.dirname(constants.PLAYLISTS_FILE_SRC), {
    recursive: true
  }, () => {
    fs.writeFile(
      constants.PLAYLISTS_FILE_SRC,
      JSON.stringify(state.playlists),
      (err) => {
        if (err) {
          console.log(err)
        }
      })
  })
}
const extractAndStoreMetaTags = async () => {
  for (var i in state.allFiles) {
    let mp3File = state.allFiles[i]
    let metadata = await mm.parseFile(mp3File)
    let commonMetadata = metadata.common
    let tags = {
      src: mp3File,
      title: commonMetadata.title ? commonMetadata.title : path.basename(mp3File),
      album: commonMetadata.album,
      artists: commonMetadata.artists ? commonMetadata.artists : ["Unknown"],
      genre: commonMetadata.genre
    }

    if (commonMetadata.picture) {
      tags.picture = `data:${commonMetadata.picture[0].format};base64,${commonMetadata.picture[0].data.toString('base64')}`
    } else {
      tags.picture = 'assets/mjam-default.png'
    }

    Vue.set(state.songsMap, tags.src, tags)
    if(i == 0){
      state.nowplaying.song = tags
    }
  }
}

const reScanDirectory = async () => {
  let finder = findit(state.settings.lookupLocation)

  finder.on('file', (file) => {
    if(path.extname(file) == ".mp3"){
      state.allFiles.push(file)
    }
  })

  finder.on('end', async () => {
    await extractAndStoreMetaTags()
    saveCache()
  })

  fs.mkdir(path.dirname(constants.SETTINGS_FILE_SRC), {
    recursive: true
  }, () => {
    fs.writeFile(
      constants.SETTINGS_FILE_SRC,
      JSON.stringify(state.settings),
      (err) => {
        if (err) {
          console.log(err)
        }
      })
  })
}

module.exports = {
  extractAndStoreMetaTags,
  saveRecentSongs,
  reScanDirectory,
  savePlaylists,
  saveSettings,
  saveCache,
  readJSON
}

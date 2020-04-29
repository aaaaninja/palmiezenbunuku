const m3u8Parser = require('m3u8-parser');
const url = require('url');
const axios = require('axios');

const parser = new m3u8Parser.Parser();
const master_m3u8 = process.argv[2]

(async () => {
  const manifest = (await axios.get(master_m3u8))
                     .data
                     .trim()

  parser.push(manifest)
  parser.end()

  const parsed_manifest = parser.manifest

  const highest_resolution = parsed_manifest.playlists.reduce((a,b)=> a.attributes.BANDWIDTH > b.attributes.BANDWIDTH ? a : b )
  const video_m3u8 = url.resolve(master_m3u8, highest_resolution.uri)
  const audio_of_that = parsed_manifest.mediaGroups.AUDIO[highest_resolution.attributes.AUDIO]
  const audio_m3u8 = url.resolve(master_m3u8, audio_of_that.audio.uri)

  console.log(video_m3u8)
  console.log(audio_m3u8)

  debugger;
  console.log('asdf')
})()
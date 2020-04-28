const m3u8Parser = require('m3u8-parser');
const url = require('url');
const axios = require('axios');

const parser = new m3u8Parser.Parser();

(async () => {
const manifest =
  (await axios.get('https://skyfire.vimeocdn.com/1588087802-0x721ded24d5c3e8492f41845626dea70906739aed/d0dfbcc5-7389-4fc5-a981-10a7e94c7e0a/sep/video/2671bd23,2f72e2ca,529b19c5,dd3c23da,e7b67bcf/master.m3u8'))
  .data
  .trim()

parser.push(manifest)
parser.end()

const parsed_manifest = parser.manifest

const pathto = 'https://141vod-adaptive.akamaized.net/exp=1588105166~acl=%2F4728f8ec-eb0b-4829-8bc9-af6d529fba64%2F%2A~hmac=d32d28871c29b5238b7df1c8e5a5bcdb159a622f28fdadfe8f500160d2ff2b5e/4728f8ec-eb0b-4829-8bc9-af6d529fba64/sep/video/f7dd75fe,307e9c98,3f066d0c,d0e01c31,d899ec07/master.m3u8'

const highest_resolution = parsed_manifest.playlists.reduce((a,b)=> a.attributes.BANDWIDTH > b.attributes.BANDWIDTH ? a : b )
const video_m3u8 = url.resolve(pathto, highest_resolution.uri)
const audio_of_that = parsed_manifest.mediaGroups.AUDIO[highest_resolution.attributes.AUDIO]
const audio_m3u8 = url.resolve(pathto, audio_of_that.audio.uri)

console.log(video_m3u8)
console.log(audio_m3u8)

debugger;
console.log('asdf')
})()
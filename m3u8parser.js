const m3u8Parser = require('m3u8-parser');
const url = require('url');
const axios = require('axios');

const parser = new m3u8Parser.Parser();
const master_m3u8 = "https://10vod-adaptive.akamaized.net/exp=1588092525~acl=%2F6ae95f6b-dc5f-461b-b8df-3febba05fb31%2F%2A~hmac=2de72e3c720cade26769ccdbd6d3be2340f6816a2f51ee6527d05fc8d8a3b8d2/6ae95f6b-dc5f-461b-b8df-3febba05fb31/sep/video/df0f3245,e563653a,e5cafbd7,53d14378,562cb850/master.m3u8";

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
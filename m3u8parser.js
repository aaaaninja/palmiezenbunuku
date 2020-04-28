const m3u8Parser = require('m3u8-parser');
const url = require('url');

const parser = new m3u8Parser.Parser();

const manifest = `
#EXTM3U
#EXT-X-INDEPENDENT-SEGMENTS
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="audio-medium",NAME="audio",AUTOSELECT=YES,DEFAULT=YES,CHANNELS="2",URI="../../audio/f7dd75fe/playlist.m3u8"

#EXT-X-STREAM-INF:CLOSED-CAPTIONS=NONE,BANDWIDTH=6153099,AVERAGE-BANDWIDTH=3931000,RESOLUTION=1920x1080,FRAME-RATE=29.970,CODECS="avc1.640828,mp4a.40.2",AUDIO="audio-medium"
../f7dd75fe/playlist.m3u8
#EXT-X-STREAM-INF:CLOSED-CAPTIONS=NONE,BANDWIDTH=2693762,AVERAGE-BANDWIDTH=1472000,RESOLUTION=1280x720,FRAME-RATE=29.970,CODECS="avc1.640820,mp4a.40.2",AUDIO="audio-medium"
../307e9c98/playlist.m3u8
#EXT-X-STREAM-INF:CLOSED-CAPTIONS=NONE,BANDWIDTH=1681664,AVERAGE-BANDWIDTH=931000,RESOLUTION=960x540,FRAME-RATE=29.970,CODECS="avc1.64081F,mp4a.40.2",AUDIO="audio-medium"
../3f066d0c/playlist.m3u8
#EXT-X-STREAM-INF:CLOSED-CAPTIONS=NONE,BANDWIDTH=481123,AVERAGE-BANDWIDTH=319000,RESOLUTION=426x240,FRAME-RATE=29.970,CODECS="avc1.640815,mp4a.40.2",AUDIO="audio-medium"
../d0e01c31/playlist.m3u8
#EXT-X-STREAM-INF:CLOSED-CAPTIONS=NONE,BANDWIDTH=698532,AVERAGE-BANDWIDTH=506000,RESOLUTION=640x360,FRAME-RATE=29.970,CODECS="avc1.64081E,mp4a.40.2",AUDIO="audio-medium"
../d899ec07/playlist.m3u8
`.trim()

parser.push(manifest)
parser.end()

const parsed_manifest = parser.manifest

const pathto = 'https://141vod-adaptive.akamaized.net/exp=1588105166~acl=%2F4728f8ec-eb0b-4829-8bc9-af6d529fba64%2F%2A~hmac=d32d28871c29b5238b7df1c8e5a5bcdb159a622f28fdadfe8f500160d2ff2b5e/4728f8ec-eb0b-4829-8bc9-af6d529fba64/sep/video/f7dd75fe,307e9c98,3f066d0c,d0e01c31,d899ec07/master.m3u8'

const highest_resolution = parsed_manifest.playlists.reduce((a,b)=> a.attributes.BANDWIDTH > b.attributes.BANDWIDTH ? a : b )
const video_m3u8 = url.resolve(pathto, highest_resolution.uri)
const audio_of_that = parsed_manifest.mediaGroups.AUDIO[highest_resolution.attributes.AUDIO]
const audio_m3u8 = url.resolve(pathto, audio_of_that.audio.uri)

debugger;

console.log('asdf')
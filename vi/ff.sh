ffmpeg -i 'https://skyfire.vimeocdn.com/1588253379-0xe7b136d79fb2e876f63885e81b80e85680af0b0a/247926400/sep/video/1259135044,1259135043/master.m3u8' \
  -map p:1 \
  -movflags faststart \
  -acodec copy \
  -bsf:a aac_adtstoasc \
  -c copy jk.mp4

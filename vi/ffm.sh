ffmpeg -i 'https://31vod-adaptive.akamaized.net/exp=1588067766~acl=%2Fd229e0bb-a182-47e9-af79-272875aee13e%2F%2A~hmac=ca92e68c6a3d0f44a2f52d61dc4d3813cbac401b88fe9ef4422ce3340aa603b2/d229e0bb-a182-47e9-af79-272875aee13e/sep/video/ee8d9152/playlist.m3u8' \
  -map p:1 \
  -movflags faststart \
  -acodec copy \
  -bsf:a aac_adtstoasc \
  -c copy reccc.mp4

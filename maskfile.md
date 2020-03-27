section
----------------------------------------

### section guide
```bash
node section_guideURLs.js | xargs -P4 --replace npx vanilla-clipper '{}'
```

### section movie
```bash
node section_movieURLs.js | xargs -P4 --replace ffmpeg -i '{}' -movflags faststart -c copy rec.mp4 
```

lesson
----------------------------------------
```bash
node lessonURLs.js | xargs -P4 --replace ffmpeg -i '{}' -movflags faststart -c copy rec.mp4 
```

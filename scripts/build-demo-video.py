"""Build a captioned walkthrough from actual browser captures. Requires FFmpeg."""
import json
import shutil
import subprocess
import tempfile
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DEMO = ROOT / 'docs' / 'demo'
SCREENS = ROOT / 'docs' / 'report' / 'screens'


def stamp(seconds):
    hours, seconds = divmod(seconds, 3600)
    minutes, seconds = divmod(seconds, 60)
    return f'{int(hours)}:{int(minutes):02d}:{seconds:05.2f}'


def main():
    encoder = shutil.which('ffmpeg')
    if not encoder:
        raise SystemExit('FFmpeg is required to rebuild the supplied MP4.')
    scenes = json.loads((DEMO / 'scenes.json').read_text(encoding='utf8'))['scenes']
    lines = ['ffconcat version 1.0']
    ass = ['[Script Info]', 'PlayResX: 1280', 'PlayResY: 720', 'WrapStyle: 2',
           '[V4+ Styles]',
           'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
           'Style: Default,Arial,22,&H00FFFFFF,&H00FFFFFF,&H00111A2A,&H00111A2A,0,0,0,0,100,100,0,0,3,1,0,5,16,16,16,1',
           '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text']
    elapsed = 0
    for index, scene in enumerate(scenes, 1):
        frame = SCREENS / scene['file']
        if not frame.is_file():
            raise SystemExit(f'Missing screen capture: {frame}')
        lines += ["file '" + frame.as_posix().replace("'", "'\\''") + "'", f"duration {scene['duration']}"]
        title = r'\N'.join(textwrap.wrap(f'{index:02d}. {scene["title"]}', 29))
        caption = r'\N'.join(textwrap.wrap(scene['caption'], 31))
        content = r'{\pos(1060,350)\b1}' + title + r'{\b0}\N\N' + caption + r'\N\N{\fs15}SC4025 | REAL APP CAPTURES'
        end = elapsed + scene['duration']
        ass.append(f'Dialogue: 0,{stamp(elapsed)},{stamp(end)},Default,,0,0,0,,{content}')
        elapsed = end
    lines.append("file '" + (SCREENS / scenes[-1]['file']).as_posix() + "'")
    output = DEMO / 'sc4025-walkthrough.mp4'
    with tempfile.TemporaryDirectory(prefix='sc4025-video-') as work:
        work = Path(work)
        (work / 'frames.ffconcat').write_text('\n'.join(lines) + '\n', encoding='utf8')
        (work / 'scene-captions.ass').write_text('\n'.join(ass) + '\n', encoding='utf8')
        print(f'Encoding {len(scenes)} actual screen captures into {elapsed:.0f} seconds...', flush=True)
        result = subprocess.run([encoder, '-hide_banner', '-y', '-f', 'concat', '-safe', '0',
                                 '-i', 'frames.ffconcat', '-t', str(elapsed), '-r', '15',
                                 '-vf', 'subtitles=scene-captions.ass', '-c:v', 'libx264',
                                 '-preset', 'veryfast', '-crf', '24', '-pix_fmt', 'yuv420p',
                                 '-movflags', '+faststart', '-an', str(output)],
                                cwd=work, capture_output=True)
        if result.returncode:
            raise SystemExit(result.stderr.decode('utf8', errors='replace')[-5000:])
    print(f'Created {output} ({output.stat().st_size / 1024 / 1024:.2f} MB)', flush=True)


if __name__ == '__main__':
    main()

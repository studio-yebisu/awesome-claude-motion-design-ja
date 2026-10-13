"""Prepare local assets and export the Opus-authored promotional composition."""
from pathlib import Path
import argparse
import shutil
import subprocess
import json

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / 'examples' / 'remotion'

def prepare_assets():
    public = PROJECT / 'public' / 'promo'
    for kind, ext in [('clips', '.mp4'), ('posters', '.webp')]:
        (public / kind).mkdir(parents=True, exist_ok=True)
        for source in (ROOT / 'assets' / 'previews').glob('*' + ext):
            if source.stem.endswith('-native'):
                continue
            target = public / kind / source.name
            if not target.exists():
                shutil.copy2(source, target)
    return public

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--music', type=Path, help='Optional user-owned 40-second WAV soundtrack')
    parser.add_argument('--output', type=Path, default=ROOT / 'renders' / 'promo-20261013' / 'motion-guide-promo.mp4')
    parser.add_argument('--still', type=int, help='Export a frame number instead of the MP4')
    parser.add_argument('--scale', type=float, default=1.0)
    args = parser.parse_args()
    args.output = args.output.resolve()
    public = prepare_assets()
    if args.music:
        if not args.music.is_file():
            parser.error('Soundtrack file does not exist')
        if args.music.resolve() != (public / 'music.wav').resolve():
            shutil.copy2(args.music, public / 'music.wav')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    entry = PROJECT / 'src' / 'index.ts'
    cli = PROJECT / 'node_modules' / '@remotion' / 'cli' / 'remotion-cli.js'
    if not cli.is_file():
        parser.error('Install the pinned examples/remotion dependencies with npm ci first')
    command = ['node', str(cli), 'still' if args.still is not None else 'render', str(entry), 'PromoFilm', str(args.output), '--scale', str(args.scale), '--props', json.dumps({'withMusic':bool(args.music)})]
    if args.still is not None:
        command += ['--frame', str(args.still), '--image-format', 'png']
    else:
        command += ['--codec', 'h264', '--crf', '18', '--pixel-format', 'yuv420p', '--audio-codec', 'aac', '--audio-bitrate', '192K', '--concurrency', '4']
    subprocess.run(command, cwd=PROJECT, check=True)
    if args.still is None:
        probe = json.loads(subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=pix_fmt,color_range','-of','json',str(args.output)],capture_output=True,text=True,check=True).stdout)
        stream = probe['streams'][0]
        if stream.get('color_range') == 'pc' or stream['pix_fmt'] == 'yuvj420p':
            native = args.output.with_name(args.output.stem + '-render.mp4')
            assert native.parent.resolve() == args.output.parent.resolve()
            args.output.replace(native)
            subprocess.run(['ffmpeg','-hide_banner','-y','-i',str(native),'-map','0:v:0','-map','0:a:0?',
                '-vf','scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p',
                '-c:v','libx264','-preset','medium','-crf','18','-color_range','tv','-colorspace','bt709',
                '-color_primaries','bt709','-color_trc','bt709','-c:a','copy','-map_metadata','-1',
                '-movflags','+faststart',str(args.output)],check=True)

if __name__ == '__main__':
    main()

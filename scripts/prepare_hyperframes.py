from pathlib import Path
import shutil
root=Path(__file__).resolve().parents[1];out=root/'examples/hyperframes/fonts';out.mkdir(parents=True,exist_ok=True)
for pkg,font,name in [('inter-tight','inter-tight-latin-800-normal.woff2','inter.woff2'),('jetbrains-mono','jetbrains-mono-latin-400-normal.woff2','mono.woff2')]:
    base=root/'examples/runtime/node_modules/@fontsource'/pkg
    shutil.copyfile(base/'files'/font,out/name)
    shutil.copyfile(base/'LICENSE',out/(pkg+'-LICENSE.txt'))
print('Local font assets prepared with licenses')

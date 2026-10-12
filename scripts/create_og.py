"""Draw an original social cover from vector primitives and local system fonts."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT = Path("C:/Windows/Fonts/meiryo.ttc")
BOLD = Path("C:/Windows/Fonts/meiryob.ttc")
if not FONT.exists():
    raise SystemExit("Set FONT and BOLD to Japanese fonts installed on your OS.")

SCALE = 2
im = Image.new("RGB", (1200*SCALE,630*SCALE), "#f5f2ec")
d = ImageDraw.Draw(im)

def f(size,bold=False):
    return ImageFont.truetype(str(BOLD if bold and BOLD.exists() else FONT), int(size*SCALE))

def text(x,y,value,size=16,color="#20252b",bold=False):
    d.text((x*SCALE,y*SCALE),value,font=f(size,bold),fill=color)

def rect(box,fill,outline=None,r=0):
    scaled=tuple(v*SCALE for v in box)
    if r: d.rounded_rectangle(scaled,r*SCALE,fill=fill,outline=outline,width=SCALE)
    else: d.rectangle(scaled,fill=fill,outline=outline,width=SCALE)

rect((48,40,95,87),"#20252b",r=10)
text(58,40,"m",29,"#f5f2ec",True)
text(111,45,"StudioYebisu / 日本語ガイド",16)
text(51,128,"CLAUDE OPUS 5.5  /  MOTION DESIGN",16,"#697078")
text(48,165,"Claudeでつくる、",43,bold=True)
text(48,225,"モーショングラフィック。",43,bold=True)
text(51,304,"制作スキルとツールを、つくりたいものから選ぶ。",21,"#697078")
text(928,148,"31",88,bold=True)
text(936,272,"6カテゴリ",22)
text(936,310,"スキル・ツール・資料",14,"#697078")

labels=[("制作スキル","#cbe681"),("動画書き出し","#f2c078"),("UI・文字","#c8b7f0"),("3D","#99d6d5"),("2D・ベクター","#eba9ad"),("データ・図解","#aebee8")]
for i,(label,color) in enumerate(labels):
    x=51+i*184
    rect((x,382,x+170,540),"#1c2329",r=9)
    if i==0:
        for j in range(3): rect((x+29,406+j*16,x+132-j*16,412+j*16),color,r=2)
    elif i==1:
        rect((x+36,405,x+131,464),color,r=5)
        text(x+51,420,"→ MP4",15,"#252c25",True)
    elif i==2:
        text(x+26,410,"MOVE.",28,color,True)
    elif i==3:
        d.polygon([(v*SCALE,w*SCALE) for v,w in [(x+42,422),(x+79,404),(x+119,419),(x+79,437)]],fill="#c4e5e1")
        d.polygon([(v*SCALE,w*SCALE) for v,w in [(x+42,422),(x+79,437),(x+79,474),(x+42,457)]],fill=color)
        d.polygon([(v*SCALE,w*SCALE) for v,w in [(x+79,437),(x+119,419),(x+119,456),(x+79,474)]],fill="#588d8a")
    elif i==4:
        for dx,dy in [(0,-15),(15,0),(0,15),(-15,0)]:
            d.ellipse(((x+63+dx)*SCALE,(426+dy)*SCALE,(x+103+dx)*SCALE,(466+dy)*SCALE),fill=color)
        d.ellipse(((x+74)*SCALE,437*SCALE,(x+92)*SCALE,455*SCALE),fill="#1c2329")
    else:
        for j,h in enumerate([32,45,37,65]): rect((x+31+j*27,470-h,x+49+j*27,470),color,r=3)
    text(x+15,498,label,16,"#f5f2ec",True)

text(52,579,"元ポスト10件 ＋ 追加調査21件   ·   出典・導入条件・ライセンス付き",16,"#697078")
im=im.resize((1200,630),Image.Resampling.LANCZOS)
out=ROOT/"assets/og-card.png"
out.parent.mkdir(parents=True,exist_ok=True)
im.save(out,optimize=True)
print(f"Saved {out.name}: 1200×630, {out.stat().st_size} bytes")

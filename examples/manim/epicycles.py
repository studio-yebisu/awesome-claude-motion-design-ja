"""Original Fourier epicycle drawing, rendered by Manim Community."""
from manim import *
import numpy as np

config.pixel_width = 960
config.pixel_height = 600
config.frame_rate = 30
config.frame_width = 12.8
config.frame_height = 8
config.background_color = '#0e0f12'

class EpicyclePlate(Scene):
    def construct(self):
        paper = '#f2efe8'
        accent = '#d4ed71'
        title = Text('A line, made of circles.', font='Arial', color=paper, weight=BOLD).scale(.65).to_edge(UP, buff=.55)
        tag = Text('MANIM / FOURIER EPICYCLES',font='Consolas',color=paper).scale(.22).to_edge(DOWN,buff=.3).to_edge(LEFT,buff=.5)
        center=np.array([-.7,-.15,0])
        terms=[(1,1.75),(3,.65),(-5,.32),(7,.18)]
        clock=ValueTracker(0)
        def chain(t):
            pts=[center]
            for n,r in terms:
                pts.append(pts[-1]+np.array([r*np.cos(n*t),r*np.sin(n*t),0]))
            return pts
        def epicycles():
            pts=chain(clock.get_value())
            return VGroup(*[VGroup(Circle(radius=r,color='#565d6b',stroke_width=1).move_to(pts[i]),Line(pts[i],pts[i+1],color=paper,stroke_width=2)) for i,(_,r) in enumerate(terms)],Dot(pts[-1],radius=.055,color=accent))
        def curve():
            t=clock.get_value()
            points=[chain(s)[-1] for s in np.linspace(0,max(.0001,t),max(2,int(t/TAU*420)))]
            return VMobject(color=accent,stroke_width=4).set_points_as_corners(points)
        graph=always_redraw(epicycles)
        trace=always_redraw(curve)
        side=VGroup(Text('1 + 3 − 5 + 7',font='Consolas',color=accent).scale(.28),Text('Four frequencies.\nOne continuous shape.',font='Arial',color=paper).scale(.28)).arrange(DOWN,aligned_edge=LEFT,buff=.35).move_to([4,0,0])
        self.add(title,tag,side,graph,trace)
        self.play(clock.animate.set_value(TAU),run_time=6,rate_func=linear)
        self.wait(.8)
        self.play(FadeOut(trace),run_time=.7)
        clock.set_value(0)
        self.wait(.5)

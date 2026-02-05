import matplotlib.pyplot as plt
import matplotlib as mpl
from feynman import Diagram
from feynman import Line

class Theme:
    theme = "light"
    @staticmethod
    def set(_theme):
        Theme.theme = _theme
        if(Theme.theme == "dark"):
            plt.style.use('dark_background')
        else:
            plt.style.use('default')
        plt.rcParams['font.family'] = 'serif'
        plt.rcParams['font.serif'] = ['cmr10']  # Основной шрифт для текста
        plt.rcParams['mathtext.fontset'] = 'cm'
    @staticmethod
    def color():
        if(Theme.theme == "light"):
            return "black"
        else:
            return "white"
    @staticmethod
    def back():
        if(Theme.theme == "light"):
            return "white"
        else:
            return "black"
    @staticmethod
    def suff():
        if(Theme.theme == "light"):
            return "l"
        else:
            return "d"
        
Theme.set("light")
#Theme.set("dark")

gluon_in = 1
gluon_out =1

main_color = Theme.color()
style_params = {"color": main_color}
arrow_params = {"color": main_color,"width":0.02,"length":0.05}

fig = plt.figure(figsize=(3.6,2.4))
ax = fig.add_axes([0,0,1,1 ], frameon=False)
diagram = Diagram(ax)

ax.set_xlim(0, 0.6)
ax.set_ylim(0, 0.4)

H = 0.4


in1 = diagram.vertex(xy=(0.1, 0.04), marker='', **style_params)
in2 = diagram.vertex(xy=(0.1, H-0.04), marker='', **style_params)

center2 = diagram.vertex(xy=(0.3, 0.2), **style_params,markersize=4)
out1 = diagram.vertex(xy=(0.5, 0.04), marker='', **style_params)
out2 = diagram.vertex(xy=(0.5, H-0.04), marker='', **style_params)


if(gluon_in == 1):
    p_gluon_in = diagram.vertex(xy=(in1.xy+center2.xy)/2, **style_params,markersize=4)
else:
    p_gluon_in = diagram.vertex(xy=(in2.xy+center2.xy)/2, **style_params,markersize=4)

if(gluon_out == 1):
    p_gluon_out = diagram.vertex(xy=(out1.xy+center2.xy)/2, **style_params,markersize=4)
else:
    p_gluon_out = diagram.vertex(xy=(out2.xy+center2.xy)/2, **style_params,markersize=4)

if(gluon_in == 1):
    diagram.line(p_gluon_in,in1, **style_params,linewidth=2,arrow_param=arrow_params)
    diagram.line(center2,p_gluon_in, **style_params,linewidth=2,arrow_param=arrow_params)
    diagram.line(in2,center2, **style_params,linewidth=2,arrow_param=arrow_params)
else:
    diagram.line(p_gluon_in,in2, **style_params,linewidth=2,arrow_param=arrow_params)
    diagram.line(center2,p_gluon_in, **style_params,linewidth=2,arrow_param=arrow_params)
    diagram.line(in1,center2, **style_params,linewidth=2,arrow_param=arrow_params)

if(gluon_out == 1):
    diagram.line(center2,p_gluon_out, **style_params,linewidth=2,arrow_param=arrow_params)
    diagram.line(p_gluon_out,out1, **style_params,linewidth=2,arrow_param=arrow_params)
    diagram.line( out2,center2, **style_params,linewidth=2,arrow_param=arrow_params)
else:
    diagram.line(center2,p_gluon_out, **style_params,linewidth=2,arrow_param=arrow_params)
    diagram.line(p_gluon_out,out2, **style_params,linewidth=2,arrow_param=arrow_params)
    diagram.line( out1,center2, **style_params,linewidth=2,arrow_param=arrow_params)

if(gluon_in == gluon_out):
    Gluon = Line(
        p_gluon_in, p_gluon_out, **style_params,
        style='loopy', linewidth=2, nloops=5,
        phase=0.,xamp=0.02,yamp=-0.02,
        arrow_param=arrow_params)
    Gluon.scale_amplitudes(0.5) 
    diagram.add_line(Gluon)


diagram.text(out1.xy[0]+0.04, out1.xy[1]+0.01, r"$\bar{q}_1$", fontsize=36)
diagram.text(out2.xy[0]+0.04, out2.xy[1]-0.01, r"$q_2$", fontsize=36)
diagram.text(in1.xy[0]-0.04, out1.xy[1]+0.01, r"$\bar{q}_3$", fontsize=36)
diagram.text(in2.xy[0]-0.04, out2.xy[1]-0.01, r"$q_4$", fontsize=36)


diagram.plot()
plt.show()
#fig.savefig(f'../docs/KaonDecay/FCNC/images/L4suud-{gluon_in}{gluon_out}-{Theme.suff()}.svg',transparent=True)
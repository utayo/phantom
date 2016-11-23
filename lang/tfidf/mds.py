import numpy as np
from sklearn import manifold
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties

fname = "syllabus2vec500.csv"

datum = np.loadtxt(fname, delimiter=",", usecols=range(1, 500))
mds = manifold.MDS(n_components=2, dissimilarity="euclidean")
pos = mds.fit_transform(datum)
print len(pos)

labels = np.genfromtxt(fname, delimiter=",", usecols=0, dtype=str)

plt.scatter(pos[:, 0], pos[:, 1], marker = 'o')
 

for label, x, y in zip(labels, pos[:, 0], pos[:, 1]):
    """
    plt.annotate(
        label,
        xy = (x, y), xytext = (10, -10),
        textcoords = 'offset points', ha = 'right', va = 'bottom',
        bbox = dict(boxstyle = 'round,pad=0.5', fc = 'yellow', alpha = 0.5),
        arrowprops = dict(arrowstyle = '->', connectionstyle = 'arc3,rad=0'),
				fontproperties=FontProperties(size=8)
    )
    """
plt.show()

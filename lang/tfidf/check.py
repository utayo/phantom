import MeCab
import os
import glob
import codecs
import sys	
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from gensim.models import word2vec
import scipy.spatial.distance as dis


mn = "myModel200.word2vec"

model = word2vec.Word2Vec.load(mn)
vo = word2vec.Vocab()

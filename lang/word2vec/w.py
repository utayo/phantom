#coding:utf-8
from gensim.models import word2vec

data = word2vec.Text8Corpus('data.text')
model = word2vec.Word2Vec(data, size=200)

out = model.most_similar(positive=[u'プログラミング'])

for o in model[u'プログラミング']:
	print o

print model[u'プログラミング'][0]

#coding:utf-8

from gensim import corpora
from gensim import models
import MeCab
import os
import codecs
'''
documents = [
	['John', 'likes', 'to', 'watch', 'movies', 'Mary', 'likes' 'movies', 'too'],
	['John', 'also', 'likes', 'to', 'watch', 'football', 'games'],
]
'''

def tokenize(text):
	""" MeCab で分かち書きした結果をトークンとして返す """
	wakati = MeCab.Tagger("-Owakati")
	return wakati.parse(text.encode('utf-8'))

def extract(arr, n):
	return [a[n] for a in arr]

def save_file(fname, string):
    out = codecs.open(fname, 'w', 'utf-8')
    out.write(string)

data = {}
names = []
documents = []

addr = [path for path in os.listdir('docs')]
for l in addr:
	id = l.split('.')[0]
	print(id)
	names.append(id)
	f = codecs.open('docs/'+l, 'r', 'utf-8')
	text = f.read()
	wakati = tokenize(text)

	data[id] = {
		"wakati": wakati,
		"doc": wakati.split(' ')
	}
	documents.append(wakati.split(' '))



dic = corpora.Dictionary(documents)
dic.filter_extremes(no_above=0.5)

bow_corpus = [dic.doc2bow(d) for d in documents]

tfidf_model = models.TfidfModel(bow_corpus)
tfidf_corpus = tfidf_model[bow_corpus]

# LSIによる次元削減
lsi_model = models.LsiModel(tfidf_corpus, id2word=dic, num_topics=300)
lsi_corpus = lsi_model[tfidf_corpus]

for i in range(len(names)):
	id = names[i]
	vec = extract(lsi_corpus[i], 1)
	buf = id
	print id, len(vec)
	for n in range(len(vec)):
		buf += ','
		buf += str(vec[n])
	print buf
	save_file('bow_vec/'+id+'.csv', buf)

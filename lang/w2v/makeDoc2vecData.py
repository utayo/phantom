#coding:utf-8

import os
import glob
import MeCab
import codecs


def tokenize(t):
	w = MeCab.Tagger("-Owakati")
	return w.parse(t.encode('utf-8'))

wList = []

files = [path for path in os.listdir('docs')]


str = ""
for f in files:
	print f
	buf = codecs.open('docs/'+f, 'r', 'utf-8')
	raw_text = buf.read()
	wakati = tokenize(raw_text.replace('\n', ''))

	#print wakati
	try:
		wList.index(wakati)
	except ValueError as e:
		wList.append(wakati)
		str += wakati
	
out = codecs.open('wakati_doc2vec.txt', 'w', 'utf-8')
out.write(str)


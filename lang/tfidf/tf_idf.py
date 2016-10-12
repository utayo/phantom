#!/bin/env python
#coding:utf-8

import MeCab
import os
import glob
import codecs
import sys
from sklearn.feature_extraction.text import TfidfVectorizer


def tokenize(text):
    """ MeCab で分かち書きした結果をトークンとして返す """
    wakati = MeCab.Tagger("-Owakati")
    return wakati.parse(text.encode('utf-8'))


token_dict = {}

flist = glob.glob('docs/*.ttl')

for faddr in flist:
	f = codecs.open(faddr, 'r', 'UTF-8')
	if(f):
		text = f.read()
		encode_text = text.encode('utf-8')
		token_dict[faddr] = encode_text
	else:
		print faddr, ' Fale'
		

# 引数として、CountVectorizerとTfidfTransformerで使った双方の引数が指定できるようになっている
tfidf_vectorizer = TfidfVectorizer(tokenizer=tokenize,input='filename', max_df=0.5, min_df=1, max_features=3000, norm='l2')

# 全ファイルパスを入れた変数でfit_transform
files = ['docs/' + path for path in os.listdir('docs')]
tfidf = tfidf_vectorizer.fit_transform(files)

# feature_name一覧
feature_names = tfidf_vectorizer.get_feature_names()

#for t in token_dict:
#	print token_dict[t].encode('utf-8')


print(tfidf.toarray())
for i in tfidf.toarray():
	print i



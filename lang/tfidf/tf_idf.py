#!/bin/env python
#coding:utf-8

import MeCab
import os
import glob
import codecs
import sys	
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer


def tokenize(text):
    """ MeCab で分かち書きした結果をトークンとして返す """
    wakati = MeCab.Tagger("-Owakati")
    return wakati.parse(text.encode('utf-8'))

def extract_feature_words(terms, tfidfs, i, n):
    tfidf_array = tfidfs[i]
    top_n_idx = tfidf_array.argsort()[-n:][::-1]
    words = [terms[idx] for idx in top_n_idx]
    return words


token_dict = {}
docs = np.array([

])


flist = glob.glob('docs/*')


for faddr in flist:
	f = codecs.open(faddr, 'r', 'UTF-8')
	if(f):
		text = f.read()
		encode_text = text
		token_dict[faddr] = encode_text
	else:
		print faddr, ' Fale'


# 引数として、CountVectorizerとTfidfTransformerで使った双方の引数が指定できるようになっている
#tfidf_vectorizer = TfidfVectorizer(tokenizer=tokenize,input='context', max_features=3000, token_pattern=u'(?u)\\b\\w+\\b')
tfidf_vectorizer = TfidfVectorizer(
    use_idf=True,
    lowercase=False,
	max_df=0.1,
	max_features=10000,
	norm='l1'
)

# 全ファイルパスを入れた変数でfit_transform
files = ['ttl/' + path for path in os.listdir('ttl')]
i = 0
for file in files:
	f = codecs.open(file, 'r', 'utf-8')
	text = f.read()
	wakati = tokenize(text)
	docs = np.append(docs, wakati)
	i=i+1
	if(i>100):
		break



print files
for ff in docs:
	print ff

tfidf = tfidf_vectorizer.fit_transform(docs)
# feature_name一覧
feature_names = tfidf_vectorizer.get_feature_names()



print(tfidf.toarray())


for k,v in sorted(tfidf_vectorizer.vocabulary_.items(), key=lambda x:x[1]):
    print k,v

arr = tfidf.toarray()[10]
top_idx = arr.argsort()[-50:][::-1]
words = [feature_names[idx] for idx in top_idx]
print feature_names[top_idx[0]]

i = 0
for i in range(50):
	print i, words[i], arr[top_idx[i]]

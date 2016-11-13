#!/bin/env python
#coding:utf-8

import MeCab
import os
import glob
import codecs
import sys	
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from gensim.models import word2vec
import scipy.spatial.distance as dis

def tokenize(text):
    """ MeCab で分かち書きした結果をトークンとして返す """
    wakati = MeCab.Tagger("-Owakati")
    return wakati.parse(text.encode('utf-8'))

data = word2vec.Text8Corpus('data.txt')
model = word2vec.Word2Vec(data, size=200)


token_dict = {}
docs = np.array([

])
name_list = []

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
files = [path for path in os.listdir('ttl')]

ttl_length = 0
for file_name in files:
	name_list.append(file_name.split('.')[0])
	f = codecs.open('ttl/'+file_name, 'r', 'utf-8')
	text = f.read()
	wakati = tokenize(text)
	docs = np.append(docs, wakati)
	ttl_length=ttl_length+1
	#if(ttl_length>100):
	#	break

tfidf = tfidf_vectorizer.fit_transform(docs)
tarray = tfidf.toarray()
# feature_name一覧
feature_names = tfidf_vectorizer.get_feature_names()
#for k,v in sorted(tfidf_vectorizer.vocabulary_.items(), key=lambda x:x[1]):
#    print k,v



def make_syllabus2vec(num):
    arr = tarray[num]
    top_idx = arr.argsort()[-50:][:-1]

    words = [feature_names[idx] for idx in top_idx]
    syllabus2vec = np.array([0.0 for i in range(200)])
    print 'make syllabus'
    for k in range(len(top_idx)):
        tfidf_value = arr[top_idx[k]]
        try:
            a = [tfidf_value * v for v in model[words[k]]]
            syllabus2vec += a
            #print words[k]
        except KeyError as e:
            print e

    return syllabus2vec

def compare_syllabus(s1, s2):
    vec1 = make_syllabus2vec(s1)
    vec2 = make_syllabus2vec(s2)

    print files[s1].split('.')[0], '--', files[s2].split('.')[0]
    distance = dis.cosine(vec1, vec2)
    print distance
    return distance

def find_similar_syllabus(sNum):
    sy_list = {}
    for i in range(len(tarray)):
        f = files[i].split('.')[0]
        distance = compare_syllabus(sNum, i)
        sy_list[f] = distance
    return  sorted(sy_list.items(), reverse=True, key=lambda x:x[1])

print 'the number of syllabus:', ttl_length
print 'tarray:', len(tarray)


syList = find_similar_syllabus(100)
for k, v in syList:
    print k, ':', v


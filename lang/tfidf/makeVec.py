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

w2v_dimension = 500

data = word2vec.Text8Corpus('data.txt')
model = word2vec.Word2Vec(data, size=w2v_dimension)


token_dict = {}
docs = np.array([

])
name_list = []

# 引数として、CountVectorizerとTfidfTransformerで使った双方の引数が指定できるようになっている
#tfidf_vectorizer = TfidfVectorizer(tokenizer=tokenize,input='context', max_features=3000, token_pattern=u'(?u)\\b\\w+\\b')
tfidf_vectorizer = TfidfVectorizer(
    use_idf=True,
    lowercase=False,
	max_df=0.2,
	max_features=10000,
	norm='l2'
)



def make_syllabus2vec(num, id):
    arr = tarray[num]
    top_idx = arr.argsort()[-50:][:-1]

    words = [feature_names[idx] for idx in top_idx]
    syllabus2vec = np.array([0.0 for i in range(w2v_dimension)])
    print 'make syllabus'
    for k in range(len(top_idx)):
        tfidf_value = arr[top_idx[k]]
        try:
            a = [tfidf_value * v for v in model[words[k]]]
            syllabus2vec += a
            lec_data_list[id]["vec"][words[k]] = tfidf_value
        except KeyError as e:
            print e

    return syllabus2vec

def make_all_syllabus2vec():
    for i in range(len(tarray)):
        id = files[i].split('.')[0]
        s2v = make_syllabus2vec(i, id)
        if len(lec_data_list[id]["s2v"])==0:
            lec_data_list[id]["s2v"] = s2v
            print id, lec_data_list[id]["s2v"]


def compare_syllabus(s1, s2):
    vec1 = lec_data_list[files[s1].split('.')[0]]["s2v"]
    vec2 = lec_data_list[files[s2].split('.')[0]]["s2v"]

    #print files[s1].split('.')[0], '--', files[s2].split('.')[0]
    distance = dis.cosine(vec1, vec2)
    #print distance
    return distance

def find_similar_syllabus(sNum):
    sy_list = {}
    for i in range(len(tarray)):
        f = files[i].split('.')[0]
        distance = compare_syllabus(sNum, i)
        sy_list[f] = distance
    return  sorted(sy_list.items(), reverse=False, key=lambda x:x[1])

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

lec_data_list = {}
lec_addr_list = [path for path in os.listdir('sylb')]

for l_name in lec_addr_list:
    lec_id = l_name.split('.')[0]
    f = codecs.open('sylb/'+l_name, 'r', 'utf-8')
    d = f.readlines()
    lec_data_list[lec_id] = {
        "name": d[0].replace('\n', '').replace(',', ' '),
        "link": d[2],
        "vec": {},
        "s2v": []
    }

make_all_syllabus2vec()


print 'the number of syllabus:', ttl_length
print 'tarray:', len(tarray)



similarity_list = ""

for i in range(len(tarray)):
    syList = find_similar_syllabus(i)
    n = 0
    print '\n'
    id = files[i].split('.')[0]
    print lec_data_list[id]["name"]
    similarity_list += lec_data_list[id]["name"] + '\n'
    for k, v in syList:
        print lec_data_list[k]["name"], ':', str(v)
        hoge = lec_data_list[k]["name"]+ ':'+ str(v) + '\n'
        similarity_list += hoge
        n = n+1
        if(n>10):
            break

out = codecs.open('similarity_list500.txt', 'w', 'utf-8')
out.write(similarity_list)

def make_syllabus_string(num):
    result = ""
    id = files[num].split('.')[0]
    result += lec_data_list[id]["name"]

    for s in make_syllabus2vec(num, id):
        d = "{0:f}".format(s)
        result += ',' + str(d)

    #print lec_data_list[id]["name"]
    #for k, v in sorted(lec_data_list[id]["vec"].items(), key=lambda x:x[1]):
    #    print k, v

    return result

"""
string_syllabus2vec = ""
for i in range(len(tarray)):
    string_syllabus2vec += make_syllabus_string(i) + "\n"
"""


#out = codecs.open('syllabus2vec500.csv', 'w', 'utf-8')
#out.write(string_syllabus2vec)

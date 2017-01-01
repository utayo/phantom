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

w2v_dimension = 200


if len(sys.argv)==1:
	myModelName = "myModel"+str(w2v_dimension)+".word2vec"
	#myModelName = "wikiModel.word2vec"
else:
	myModelName = sys.argv[1]
print myModelName
if os.path.exists(myModelName):
    print 'load w2v'
    model = word2vec.Word2Vec.load(myModelName)
else:
    print 'make myModel.word2vec'
    data = word2vec.Text8Corpus('data.txt')
    model = word2vec.Word2Vec(data, size=w2v_dimension)
    model.save(myModelName)

token_dict = {}
docs = np.array([

])
name_list = []



tfidf_vectorizer = TfidfVectorizer(use_idf=True,lowercase=False,max_df=0.2,max_features=10000,norm='l2')

def c(str):
    return str.split('.')[0]

def sid(n):
    return sorted(lec_data_list.keys())[n]

def make_syllabus2vec(num, id):
    arr = tarray[num]
    top_idx = arr.argsort()[-100:][:-1]
    words = [feature_names[idx] for idx in top_idx]
    syllabus2vec = np.array([0.0 for i in range(w2v_dimension)])
    l = {}
    #print 'make syllabus'
    for k in range(len(top_idx)):
        tfidf_value = arr[top_idx[k]]
        try:
            a = [tfidf_value * v for v in model[words[k]]]
            syllabus2vec += a
            if tfidf_value > 0.001:
                l[words[k]] = tfidf_value
        except KeyError as e:
            0
            #print e
    
    lec_data_list[id]["vec"] = sorted(l.items(), reverse=True, key=lambda x:x[1])[:20]

    return syllabus2vec

def make_all_syllabus2vec():
    for i in range(len(tarray)):
        id = files[i].split('.')[0]
        s2v = make_syllabus2vec(i, id)
        if len(lec_data_list[id]["s2v"])==0:
            lec_data_list[id]["s2v"] = s2v
            #print id, lec_data_list[id]["s2v"]


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
        #distance = compare_syllabus(sNum, i)
        distance = cal_hd_syllabus(files[sNum], files[i])
        sy_list[f] = distance
    #キーでソートして返すようにしてみるお
    #sy_list = sorted(sy_list.items(), reverse=False, key=lambda x:x[1])
    sy_list = sorted(sy_list.items(), reverse=False)

    return  sy_list

def find_similar_syllabus_by_vec(vec):
    sy_list = {}
    for i in range(len(tarray)):
        f = files[i].split('.')[0]
        cVec = lec_data_list[f]["s2v"]
        distance = cal_cosDistance(vec, cVec)
        sy_list[f] = distance
    return  sorted(sy_list.items(), reverse=False, key=lambda x:x[1])


def cal_cosDistance(vec1, vec2):
    if len(vec1)!=len(vec2):
        return -1
    l = len(vec1)
    distance = dis.cosine(vec1, vec2)
    return distance

#ハウスドルフ距離を求める
#ベクトルの集合において一番遠い要素同士の距離を求める
def cal_housdorff_distance(wList1, wList2):
    result = 0
    sim_word = -1
    if len(wList1)>20:
        wList1 = wList1[:20]
    if len(wList2)>20:
        wList2 = wList2[:20]
    for v1 in range(len(wList1)):
        if v1 > 21:
            break
        '''
        min_distance = 10000
        for v2 in range(len(wList2)):
            if v2 > 20:
                break
            #d = np.linalg.norm(model[wList1[v1]]-model[wList2[v2]])
            d = model.similarity(wList1[v1], wList2[v2])
            if d<min_distance:
                min_distance = d
                sim_word = v2
        result += min_distance
        '''
        max_similarity = 0
        for v2 in range(len(wList2)):
            if v2 > 21:
                break
            #d = np.linalg.norm(model[wList1[v1]]-model[wList2[v2]])
            d = model.similarity(wList1[v1], wList2[v2])
            if d>max_similarity:
                max_similarity = d
                sim_word = v2
        result += max_similarity
    
    #print d
    return result

def cal_hd_syllabus(id1, id2):
    s1vec = lec_data_list[c(id1)]["vec"]
    v1 = [w[0] for w in s1vec]
    s2vec = lec_data_list[c(id2)]["vec"]
    v2 = [w[0] for w in s2vec]
    
    #return min(cal_housdorff_distance(v1, v2),cal_housdorff_distance(v2, v1))
    return cal_housdorff_distance(v1, v2) + cal_housdorff_distance(v2, v1)

def print_similar_word(id1, id2):
    s1vec = lec_data_list[c(id1)]["vec"]
    w1 = [w[0] for w in s1vec]
    s2vec = lec_data_list[c(id2)]["vec"]
    w2 = [w[0] for w in s2vec]

    print lec_data_list[c(id1)]["name"], '--', lec_data_list[c(id2)]["name"]

    for v1 in range(len(w1)):
        if v1 > 20:
            break
        min_distance = 10000
        sim_word = -1
        for v2 in range(len(w2)):
            if v2 > 20:
                break
            d = np.linalg.norm(model[w1[v1]]-model[w2[v2]])
            if d < min_distance:
                min_distance = d
                sim_word = v2
        print w1[v1], w2[sim_word], min_distance


def compare_vec(v1, v2):
    if len(v1)>len(v2):
        bv = v1
        sv = v2
    else:
        bv = v2
        sv = v1
    result = 0
    for i in range(len(bv)):
        if i>20:
            break
        min_distance = 10000
        v = bv[i]
        for j in range(len(sv)):
            if j>20:
                break
            _v = sv[j]
            d = np.linalg.norm(v-_v)
            if d < min_distance:
                min_distance = d
        result += min_distance
    return min_distance


def listup(sn):
    l = lec_data_list[sid(sn)]
    slist = find_similar_syllabus(sn)
    sslist = sorted(slist, reverse=True, key=lambda x:x[1])
    print l["name"]
    i = 0
    for k, v in sslist:
        print lec_data_list[k]["name"], v
        print_similar_word(sid(sn), k)
        i=i+1
        if i>10:
            break

            
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

def save_file(fname, string):
    out = codecs.open(fname, 'w', 'utf-8')
    out.write(string)


#hoge

def make_simFile():
    distance_array = []
    similarity_list = ""

    for i in range(len(tarray)):
        arr = []
        if i>10000:
            break
        else:
            print i
        string = ""
        syList = find_similar_syllabus(i)
        #二次元配列になっているので、距離だけを抜き出してdis_arrayに格納
        distance_array.append([ar[1] for ar in syList])
        id = files[i].split('.')[0]
        name = lec_data_list[id]["name"]
        #string += lec_data_list[id]["name"] + '\n'
        print i, lec_data_list[id]["name"]
        n = 0
        for k, v in syList:
            #if n>5:
                #print '\n'
                #break
                
            if v!=0:
                #string += id+","+k+","+ str(v)+"\n"
                string += name + "," + lec_data_list[k]["id"] + ","+ str(v)+"\n"
                #print_similar_word(id, k)
                n = n+1
            
        similarity_list += string
        
    save_file('distance_list.csv', similarity_list)
    return distance_array

#csvファイルを読み込んで、二次元配列に落とし込む
def import_csv(fname):
    f = codecs.open(fname, 'r', 'utf-8')
    result_array = []
    for row in f:
        result_array.append([str(el) for el in row.split(',')])
    return result_array

#二次元配列をcsvファイルに出力する
def output_csv(arr, fname):
    output = ""
    for a in arr:
        buf = ""
        for b in a:
            buf += str(b) + ','
        string = buf.rstrip(',')
        output += string + '\n'
    out = codecs.open(fname, 'w', 'utf-8')
    out.write(output.rstrip('\n'))

        

"""
        for w in range(len(lec_data_list[id]["vec"])):
            if w == 20:
                break
            d = lec_data_list[id]["vec"][w]
            print d[0], d[1]
        
    
    n = 0
    for k, v in syList:
        print lec_data_list[k]["name"], ':', str(v)
        hoge = lec_data_list[k]["name"]+ ':'+ str(v) + '\n'
        print hoge
        similarity_list += hoge
        n = n+1
        if(n>6):
            break
    #out = codecs.open('similarity_list500.txt', 'w', 'utf-8')
    #out.write(similarity_list)
"""

#make_simFile()



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

def ss():
    string_syllabus2vec = ""
    for i in range(len(tarray)):
        string_syllabus2vec += make_syllabus_string(i) + "\n"

    out = codecs.open('syllabus2vec500.csv', 'w', 'utf-8')
    out.write(string_syllabus2vec)


print 'Finish. Please run make_simFile to make distances between syllabuses.'

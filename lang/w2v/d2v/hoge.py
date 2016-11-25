#!/bin/env python
#coding:utf-8

from gensim import models

article = open("shortDoc2vec.txt")
 
articles = []
for x in article:
    articles.append(x)
    print x
     
article_list = []
for item in articles:
    itemlist = item.split(' ')
    article_list.append(itemlist)
 
class LabeledLineSentence(object):
    def __init__(self, filename):
        self.filename = filename
    def __iter__(self):
        for uid, line in enumerate(open(filename)):
            yield LabeledSentence(words=line.split(), labels=['sent_%s' % uid])
 
article_tag = []
count = 0
for item in article_list:
    print item
    model = models.doc2vec.LabeledSentence(words=item, tags=['sent_%s' % count])
    article_tag.append(model)
    count += 1
 
model = models.Doc2Vec(alpha=.025, min_alpha=.025, min_count=1)
model.build_vocab(article_tag[0:999])
  
for epoch in range(10):
    print epoch
    model.train(article_tag[0:999])
    model.alpha -= 0.002
    model.min_alpha = model.alpha  
  
model.save("my_model.doc2vec")
model_loaded = models.Doc2Vec.load('my_model.doc2vec')
 
print(model.docvecs.most_similar(['sent_46']))

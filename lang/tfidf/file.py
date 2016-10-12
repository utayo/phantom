#coding:utf-8

import os
import glob
import MeCab

def tokenize(text):
    """ MeCab で分かち書きした結果をトークンとして返す """
    wakati = MeCab.Tagger("-O wakati")
    return wakati.parse(text)

addr = './docs/14_C1145.ttl'
f = open(addr, 'r')
text = f.read()
print tokenize(text)

token_dict = {}

token_dict['14_C1145.ttl'] = text
print token_dict['14_C1145.ttl'].encode('utf-8')

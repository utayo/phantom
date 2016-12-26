#coding:utf-8

import codecs
import os
import random as ran

def check(arr, c):
	for a in arr:
		if sorted(a)==sorted(c):
			return False
	return True

def save_file(fname, string):
    out = codecs.open(fname, 'w', 'utf-8')
    out.write(string)

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

files = [path for path in os.listdir('sylb')]

data = {}
for f in files:
	buf = codecs.open('sylb/'+f, 'r', 'utf-8')
	lines = buf.readlines()
	s = {}
	s["name"] = lines[0].split('\n')[0]
	s["address"] = lines[2].split('\n')[0]
	sid = lines[1].split('\n')[0]
	data[sid] = s

keylist = sorted(data.keys())
le = len(keylist)
#print keylist
print 'If you want break, please insert \'quit\''
while(raw_input()!='quit'):
	i = ran.randint(0, le)
	key = keylist[i]
	name = data[key]["name"]
	print i
	print ':', key+','+ name


problem_list = []
string = ""
'''
for i in range(50):
	print 'Q:', i+1
	
	while(True):
		hoge = range(len(keylist))
		random.shuffle(hoge)
		q = hoge[:3]
		if(check(problem_list, q)):
			l = [data[keylist[n]]["name"] for n in q]
			problem_list.append(q)
			for j in range(len(l)):
				print l[j],keylist[q[j]]
				string += keylist[q[j]] + ',' +l[j] +'\n'
			print 
			string += '\n'
			break
		else:
			print 'exsist same data'
'''

print problem_list
#output_csv(problem_list, 'enquete.csv')
#save_file('hoge.txt', string)

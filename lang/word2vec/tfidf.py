#coding;utf-8

import codecs
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
vectorizer = CountVectorizer(min_df=1)


#file = codecs.open('data.txt', 'r', 'UTF-8')
#data = file.read()
#file.close()

data = ["Any time I need to see your face, I just close my eyes And I am taken to a place where your crystal mind andMagenta feelings take up shelter in the base of my spine Sweet like a chic-a-cherry cola I don't need to try and explain I just hold on tight And if it happenes again, I might move so slightly To the arms and the lips and the face of the human cannonball","That I need to, I want to Come stand a little bit closer Breathe in and get a bit higher You\'ll never know what hit you When I get to you Ooh, I want you I 't know if I need you But, ooh, I'd die to find out Ooh, I want you I don't know if I need you But, ooh, I'd die to find out I\'m the kind of person who endorses a deep commitment"]

tfidf = vectorizer.fit_transform(data)
tfidf_vectorizer = TfidfVectorizer(
    use_idf=True,
    lowercase=False,
	max_df=0.1,
	max_features=10000,
	norm='l1'
)

print(tfidf.toarray())
tfidf = tfidf_vectorizer.fit_transform(docs)

for k,v in sorted(tfidf_vectorizer.vocabulary_.items(), key=lambda x:x[1]):
    print k,v

arr = tfidf.toarray()[0]
top_idx = arr.argsort()[-5:][::-1]
words = [feature_names[idx] for idx in top_idx]
print feature_names[top_idx[0]]

i = 0
for i in range(5):
	print i, words[i], arr[top_idx[i]]

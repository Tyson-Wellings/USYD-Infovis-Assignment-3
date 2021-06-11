import csv, collections
from typing import OrderedDict
all_tokens = []
trump_tokens = []
with open("blue_tweets.csv", encoding="utf-8") as f:
    reader = csv.reader(f)
    reader.__next__() #discard header row
    for row in reader:
        for i in range(4,len(row)):
            if (row[i] != ""):
                trump_tokens.append(row[i])
                all_tokens.append(row[i])
trump_count = collections.Counter(trump_tokens)
vocab_dict = {}
all_count = collections.Counter(all_tokens)
for id,word in enumerate(all_count):
    # print(word, all_count[word])
    count = all_count[word]
    word_dict = {
        "word": word,
        "total_count": count,
        "total_frequency": float(count)/len(all_tokens)
    }
    try:
        word_dict["trump_count"] = trump_count[word]
        word_dict["trump_frequency"] = float(trump_count[word])/len(trump_tokens)
    except:
        word_dict["trump_count"] = 0
        word_dict["trump_frequency"] = 0
    vocab_dict[id] = word_dict
with open("blue_vocab.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f, delimiter=',', lineterminator='\n')
    writer.writerow(["id","word","total_count","total_frequency","trump_count","trump_frequency"])
    for id,word in vocab_dict.items():
        writer.writerow([id,
                         word["word"],
                         word["total_count"],
                         word["total_frequency"],
                         word["trump_count"],
                         word["trump_frequency"],
                        ])
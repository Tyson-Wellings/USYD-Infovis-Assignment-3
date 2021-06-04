import csv
from sklearn.manifold import TSNE
from sklearn.cluster import KMeans

with open('Trump_Tweets_from_2020_2021_vectors.csv') as vector_data:
    vector_data_reader = csv.reader(vector_data)
    next(vector_data_reader, None) #skip headers

    vectors = [list(row) for row in vector_data_reader]
    tweet_ids = [int(row[0]) for row in vectors] #read out the tweet ids
    training_data = [list(map(float, row[1:])) for row in vectors] #prepare training data

    embedded = TSNE(n_components=2).fit_transform(training_data) #run tsne
    x_output = [float(row[0]) for row in embedded]
    y_output = [float(row[1]) for row in embedded]

    clusters = KMeans(n_clusters=10).fit_predict(training_data) #run kmeans


    with open('tsne_trump_data_2020_2021.csv', mode='w') as output_file:
        output_writer = csv.writer(output_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        output_writer.writerow(["id", "x", "y", "cluster_id"]) #write headers
        output_writer.writerows(zip(tweet_ids, x_output, y_output, clusters)) #combine data

        
import tensorflow.python.platform

import json
import numpy as np
import tensorflow as tf

# Original from https://github.com/jasonbaldridge/try-tf/

# Global variables.
BATCH_SIZE = 20  # The number of training examples to use per training step.
PERCENT_TRAINING = 0.75;
DROPOUT_KEEP_RATE = 0.85;

# Define the flags useable from the command line.
tf.app.flags.DEFINE_string('data','./server/exports/mlData.json', 'File containing the data, labels, features.')
tf.app.flags.DEFINE_integer('num_epochs', 1, 'Number of examples to separate from the training data for the validation set.')
tf.app.flags.DEFINE_boolean('verbose', False, 'Produce verbose output.')
tf.app.flags.DEFINE_integer('num_hidden', 182, 'Number of nodes in the hidden layer.')
FLAGS = tf.app.flags.FLAGS

# Extract numpy representations of the labels and features given rows consisting of:
def extract_data(filename):

    # Arrays to hold the labels and inputVectors.
    trainLabels = []
    trainVecs = []

    testLabels = []
    testVecs = []

    with open(filename) as data_file:
        fileData = json.load(data_file)

    labels_map = fileData["labelMap"]

    totalRows = len(fileData["data"])
    maxTrainingIndex = int(round(totalRows * PERCENT_TRAINING, 0))

    for fileDataEntryIndex in range(0, maxTrainingIndex):
        fileDataEntry = fileData["data"][fileDataEntryIndex]
        trainLabels.append(int(fileDataEntry["label"]))
        trainVecs.append([float(x) for x in fileDataEntry["oneHotValue"]])

    for fileDataEntryIndex in range(maxTrainingIndex + 1, totalRows):
        fileDataEntry = fileData["data"][fileDataEntryIndex]
        testLabels.append(int(fileDataEntry["label"]))
        testVecs.append([float(x) for x in fileDataEntry["oneHotValue"]])


    # Convert the array of float arrays into a numpy float matrix.
    trainVecs_np = np.matrix(trainVecs).astype(np.float32)
    # Convert the array of int labels into a numpy array.
    trainLabels_np = np.array(trainLabels).astype(dtype=np.uint8)
    # Convert the int numpy array into a one-hot matrix.
    trainLabels_onehot = (np.arange(len(labels_map)) == trainLabels_np[:, None]).astype(np.float32)

    # Convert the array of float arrays into a numpy float matrix.
    testVecs_np = np.matrix(testVecs).astype(np.float32)
    # Convert the array of int labels into a numpy array.
    testLabels_np = np.array(testLabels).astype(dtype=np.uint8)
    # Convert the int numpy array into a one-hot matrix.
    testLabels_onehot = (np.arange(len(labels_map)) == testLabels_np[:, None]).astype(np.float32)


    # Return a pair of the feature matrix and the one-hot label matrix.
    return trainVecs_np, trainLabels_onehot, testVecs_np, testLabels_onehot, labels_map

# Init weights method. (Lifted from Delip Rao: http://deliprao.com/archives/100)
def init_weights(namespace, shape, init_method='xavier', xavier_params = (None, None)):
    if init_method == 'zeros':
        return tf.Variable(tf.zeros(shape, dtype=tf.float32), name=namespace + '_hidden_W')
    elif init_method == 'uniform':
        return tf.Variable(tf.random_normal(shape, stddev=0.01, dtype=tf.float32), name=namespace + '_hidden_W')
    else: #xavier
        (fan_in, fan_out) = xavier_params
        low = -4*np.sqrt(6.0/(fan_in + fan_out)) # {sigmoid:4, tanh:1}
        high = 4*np.sqrt(6.0/(fan_in + fan_out))
        return tf.Variable(tf.random_uniform(shape, minval=low, maxval=high, dtype=tf.float32), name=namespace + '_hidden_W')


def main(argv=None):
    # Be verbose?
    verbose = FLAGS.verbose

    # Get the data.
    data_filename = FLAGS.data

    # Extract it into numpy arrays.
    data, labels, trainData, trainLabels, labels_map = extract_data(data_filename)

    # Get the shape of the training data. (used to be train_size)
    data_size, num_features = data.shape

    num_labels = len(labels_map)

    print "data shape: " + str(num_features)
    print "data rows: " + str(data_size)
    print "total labels: " + str(num_labels)

    # Get the number of epochs for training.
    num_epochs = FLAGS.num_epochs

    # Get the size of layer one.
    num_hidden = FLAGS.num_hidden

    # This is where training samples and labels are fed to the graph.
    # These placeholder nodes will be fed a batch of training data at each
    # training step using the {feed_dict} argument to the Run() call below.
    x = tf.placeholder("float", shape=[None, num_features], name="x")
    y_ = tf.placeholder("float", shape=[None, num_labels], name="y")

    # For the test data, hold the entire dataset in one constant node.
    data_node = tf.constant(data)

    # Define and initialize the network.

    # The first hidden layer.
    w_hidden1 = init_weights(
        'w_hidden1',
        [num_features, num_hidden],
        'xavier',
        xavier_params=(num_features, num_hidden))

    b_hidden1 = init_weights('b_hidden1', [1, num_hidden], 'zeros')
    hidden1 = tf.nn.tanh(tf.matmul(x,w_hidden1) + b_hidden1)
    dropout1 = tf.nn.dropout(hidden1, DROPOUT_KEEP_RATE, name="dropout1")

    # The second hidden layer.
    w_hidden2 = init_weights(
        'w_hidden2',
        [num_features, num_hidden],
        'xavier',
        xavier_params=(num_features, num_hidden))

    b_hidden2 = init_weights('b_hidden2', [1, num_hidden], 'zeros')
    hidden2 = tf.nn.tanh(tf.matmul(dropout1, w_hidden2) + b_hidden2)
    dropout2 = tf.nn.dropout(hidden2, DROPOUT_KEEP_RATE, name="dropout2")

    # Final SOFTMAX LAYER
    w_out = init_weights(
        'w_out',
        [num_hidden, num_labels],
        'xavier',
        xavier_params=(num_hidden, num_labels))

    b_out = init_weights('b_out', [1, num_labels], 'zeros')

    # The output layer.
    y = tf.nn.softmax(tf.matmul(dropout2, w_out) + b_out)

    # Optimization.
    cross_entropy = -tf.reduce_sum(y_*tf.log(y))
    train_step = tf.train.GradientDescentOptimizer(0.01).minimize(cross_entropy)

    # Evaluation.
    correct_prediction = tf.equal(tf.argmax(y,1), tf.argmax(y_,1))
    accuracy = tf.reduce_mean(tf.cast(correct_prediction, "float"))

    #summary
    summary_op = tf.merge_all_summaries()

    # Create a local session to run this computation.
    with tf.Session() as s:
        # Run all the initializers to prepare the trainable parameters.
        tf.initialize_all_variables().run()

        writer = tf.train.SummaryWriter('./logs', s.graph)

        # Iterate and train.
        for step in xrange(num_epochs * data_size // BATCH_SIZE):
            if verbose:
                print step,

            offset = (step * BATCH_SIZE) % data_size
            batch_data = data[offset:(offset + BATCH_SIZE), :]
            batch_labels = labels[offset:(offset + BATCH_SIZE)]
            train_step.run(feed_dict={x: batch_data, y_: batch_labels})

        print "Accuracy:", accuracy.eval(feed_dict={x: data, y_: labels})
        print "Test Accuracy:", accuracy.eval(feed_dict={x: trainData, y_: trainLabels})

if __name__ == '__main__':
    tf.app.run()
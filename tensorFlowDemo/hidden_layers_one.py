import tensorflow.python.platform

import json
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt

# Original from https://github.com/jasonbaldridge/try-tf/

# Global variables.
BATCH_SIZE = 1  # The number of training examples to use per training step.
PERCENT_TESTING = 0.5;

# Define the flags useable from the command line.
tf.app.flags.DEFINE_string('data','./server/exports/mlData.json', 'File containing the data, labels, features.')
tf.app.flags.DEFINE_integer('num_epochs', 1, 'Number of examples to separate from the training data for the validation set.')
tf.app.flags.DEFINE_boolean('verbose', False, 'Produce verbose output.')
tf.app.flags.DEFINE_integer('num_hidden', 182, 'Number of nodes in the hidden layer.')

FLAGS = tf.app.flags.FLAGS


# Extract numpy representations of the labels and features given rows consisting of:
def extract_data(filename):

    trainLabels = []
    trainVecs = []

    testLabels = []
    testVecs = []

    with open(filename) as data_file:
        fileData = json.load(data_file)

    labels_map = fileData["labelMap"]

    totalRows = len(fileData["data"])
    maxTrainingIndex = int(round(totalRows * PERCENT_TESTING, 0))

    for fileDataEntryIndex in range(0, maxTrainingIndex):
        fileDataEntry = fileData["data"][fileDataEntryIndex]
        trainLabels.append(int(fileDataEntry["label"]))
        trainVecs.append([float(x) for x in fileDataEntry["oneHotValue"]])

    for fileDataEntryIndex in range(maxTrainingIndex, totalRows):
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
    data, labels, testData, testLabels, labels_map = extract_data(data_filename)

    data_size, num_features = data.shape
    testData_size, num_testData_features = testData.shape

    num_labels = len(labels_map)

    print "data shape: " + str(num_features)
    print "train data rows: " + str(data_size)
    print "test data rows: " + str(testData_size)
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

    # Initialize the hidden weights and biases.
    w_hidden = init_weights(
        'w_hidden',
        [num_features, num_labels],
        'uniform')

    b_hidden = init_weights('b_hidden', [1, num_labels], 'zeros')

    # The hidden layer.
    hidden = tf.matmul(x,w_hidden) + b_hidden;

    # The output layer.
    y = tf.nn.softmax(hidden);

    # Optimization.
    cross_entropy = -tf.reduce_sum(y_*tf.log(y))
    train_step = tf.train.GradientDescentOptimizer(0.03).minimize(cross_entropy)

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

        print "Train Accuracy:", accuracy.eval(feed_dict={x: data, y_: labels})
        print "Test Accuracy:", accuracy.eval(feed_dict={x: testData, y_: testLabels})

        xTicks = [0.5,1.5,2.5,3.5,4.5,5.5,6.5,7.5,8.5,9.5,10.5,11.5,12.5,13.5,14.5,15.5,16.5,17.5,18.5,19.5,20.5,21.5,22.5,23.5,24.5,25.5]
        xLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

        yTicks = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5]
        yLabels = [1,2,3,4,5,6,7]

        fig, plots = plt.subplots(2)

        plt.setp(plots, xticks=xTicks, xticklabels=xLabels, yticks=yTicks, yticklabels=yLabels)

        plots[0].set_title("Schema A")
        plots[1].set_title("Schema B")

        plt.subplots_adjust(hspace=0.5)

        for i in range(2):
            # NOTE [:,i] is all rows in column i
            # This would be getting all weights from hidden layer to the ith label
            plots[i].invert_yaxis()
            plots[i].pcolor(s.run(w_hidden)[:,i].reshape(7,26))

        fig.savefig('weights.png')


if __name__ == '__main__':
    tf.app.run()
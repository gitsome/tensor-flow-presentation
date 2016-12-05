import tensorflow.python.platform

import json
import numpy as np
import tensorflow as tf

import random

# Original from https://github.com/jasonbaldridge/try-tf/

# set seed if required
random.seed(15)
tf.set_random_seed(15)

# Global variables.
BATCH_SIZE = 1  # The number of training examples to use per training step.
PERCENT_TRAINING = 0.5;
LEARNING_RATE = 0.02;

# Define the flags useable from the command line.
tf.app.flags.DEFINE_string('data','./server/exports/mlData.json', 'File containing the data, labels, features.')
tf.app.flags.DEFINE_integer('num_epochs', 1, 'Number of examples to separate from the training data for the validation set.')
tf.app.flags.DEFINE_boolean('verbose', False, 'Produce verbose output.')
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

    # Get the shape of the training data.
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
    hidden_layer_size_1 = num_features
    hidden_layer_size_2 = num_features

    # This is where training samples and labels are fed to the graph.
    # These placeholder nodes will be fed a batch of training data at each
    # training step using the {feed_dict} argument to the Run() call below.
    x = tf.placeholder("float", shape=[None, num_features], name="x")
    y_ = tf.placeholder("float", shape=[None, num_labels], name="y")

    # For the test data, hold the entire dataset in one constant node.
    data_node = tf.constant(data)

    # Define and initialize the network.

    # tf Graph input
    x = tf.placeholder("float", [None, num_features])
    y = tf.placeholder("float", [None, num_labels])


    # Create model
    def multilayer_perceptron(x, weights, biases):
        # Hidden layer with RELU activation
        layer_1 = tf.add(tf.matmul(x, weights['h1']), biases['b1'])
        layer_1 = tf.nn.relu(layer_1)
        # Hidden layer with RELU activation
        layer_2 = tf.add(tf.matmul(layer_1, weights['h2']), biases['b2'])
        layer_2 = tf.nn.relu(layer_2)
        # Output layer with linear activation
        out_layer = tf.matmul(layer_2, weights['out']) + biases['out']
        return out_layer

    # Store layers weight & bias
    weights = {
        'h1': init_weights('w1', [num_features, hidden_layer_size_1], 'uniform'),
        'h2': init_weights('w2', [hidden_layer_size_1, hidden_layer_size_2], 'uniform'),
        'out': init_weights('wOut', [hidden_layer_size_2, num_labels], 'uniform')
    }
    biases = {
        'b1': init_weights('b1', [1, hidden_layer_size_1], 'zeros'),
        'b2': init_weights('b2', [1, hidden_layer_size_2], 'zeros'),
        'out': init_weights('bOut', [1, num_labels], 'zeros')
    }

    # Construct model
    pred = multilayer_perceptron(x, weights, biases)

    # Define loss and optimizer
    cost = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(pred, y))
    optimizer = tf.train.AdamOptimizer(learning_rate=LEARNING_RATE).minimize(cost)

    # Test model
    correct_prediction = tf.equal(tf.argmax(pred, 1), tf.argmax(y, 1))
    # Calculate accuracy
    accuracy = tf.reduce_mean(tf.cast(correct_prediction, "float"))

    #summary
    tf.summary.scalar('accurarcy', accuracy)
    summary_op = tf.summary.merge_all()

    # Create a local session to run this computation.
    with tf.Session() as sess:
        # Run all the initializers to prepare the trainable parameters.
        tf.global_variables_initializer().run()

        writer = tf.train.SummaryWriter('./logs', sess.graph)

        # Iterate and train.
        for step in xrange(num_epochs * data_size // BATCH_SIZE):
            if verbose:
                print step,

            offset = (step * BATCH_SIZE) % data_size
            batch_data = data[offset:(offset + BATCH_SIZE), :]
            batch_labels = labels[offset:(offset + BATCH_SIZE)]

            sess.run([optimizer, cost], feed_dict={x: batch_data, y: batch_labels})

            summary = sess.run(summary_op, feed_dict={x: testData, y: testLabels})
            writer.add_summary(summary, step)

        print "Accuracy:", accuracy.eval({x: testData, y: testLabels})


if __name__ == '__main__':
    tf.app.run()
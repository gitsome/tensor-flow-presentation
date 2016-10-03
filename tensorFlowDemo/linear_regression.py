import tensorflow as tf
import numpy as np

x_data = np.random.rand(100).astype(np.float32)
y_data = x_data * 0.1 + 0.3

W = tf.Variable(tf.random_uniform([1], -1.0, 1.0), name='W')
b = tf.Variable(tf.zeros([1]), name='b')

y = W * x_data + b

cost = tf.reduce_mean(tf.square(y-y_data))

optimizer = tf.train.GradientDescentOptimizer(0.5)

train = optimizer.minimize(cost)

init = tf.initialize_all_variables()

tf.histogram_summary("weights", W)
tf.histogram_summary("bias", b)

summary_op = tf.merge_all_summaries()

with tf.Session() as session:

    writer = tf.train.SummaryWriter('./logs', session.graph)

    session.run(init)

    for step in range(201):

        session.run(train)

        summary_results = session.run(summary_op)
        writer.add_summary(summary_results, step)

        if step % 20 == 0:
            print(step, session.run(W), session.run(b))


# Curriculum Learning

Authors: Yoshua Bengio, Jérôme Louradour, Ronan Collobert, Jason Weston. http://www.machinelearning.org/archive/icml2009/papers/119.pdf

![image](http://i.imgur.com/B4nAxz3.png)

## Short Version

Showing neural networks easier examples of problems before moving onto more difficult ones can lead to faster train times and qualitatively different local minima with better generalization.

## Problem Setting

Training complex models with lots of parameters and many local minima can be difficult for a number of reasons. Training can be slowed down by the vast number of parameters trying to simultaneously model complex features, or the model can get stuck in a minimum that doesn't generalize well outside of the training set. A number of additional problems plague deep models, which are of particular interest to this paper.

Admittedly, since this paper was published (2009) there has been a great deal of work to alleviate these problems including better optimizers ([adagrad](http://www.magicbroom.info/Papers/DuchiHaSi10.pdf), [adam](http://arxiv.org/abs/1412.6980)), regularizers ([contractive](http://www.icml-2011.org/papers/455_icmlpaper.pdf) and [denoising](http://www.jmlr.org/papers/volume11/vincent10a/vincent10a.pdf) autoencoders, [batchnorm](http://arxiv.org/abs/1502.03167), [this recent RNN regularizer](http://arxiv.org/abs/1511.08400)), and using different activation functions ([relu](http://www.jmlr.org/proceedings/papers/v15/glorot11a/glorot11a.pdf)).

Despite all of these developments, curriculum learning remains a useful tool especially in problem domains which lend themselves to structured training, such as learning algorithmic tasks like in [Neural GPUs Learn Algorithms](1511.08228.md) and [Neural Random Access Machines](1511.06392.md), both of which take inspiration from the curriculum in [Reinforcement Learning Neural Turing Machines](http://arxiv.org/abs/1505.00521).

## Curriculum as Continuation Method

You don't need this to see what example curricula look like in the papers referenced above, but work in nonconvex optimization provides intuition about how we might think about curriculum learning.

The inspiration arises from continuation methods (which I hadn't seen before), which are described as a global optimization technique for nonconvex problems (not guaranteed to find the global, mind) where the problem is initially stated as a smoother version and gradually brought into crisper resolution. The idea here is that working in the domain of the smooth version of the problem allows for more global exploration, and as the smoothing factor decreases we converge upon a local extremum which we hope to be relatively good compared to others in the space. (This notion reminded me of [simulated annealing](https://en.wikipedia.org/wiki/Simulated_annealing), in which a temperature driving the size of jumps around the search space is gradually lowered.)

By analogy, a curriculum is a sequence of distributions over the training data that move from a "smooth" problem, focusing on easy or simple examples, to the actual problem featuring the full training set. Mathematically, the constraint is formalized in the paper as the sequence of distributions over training data must have monotonically increasing entropy (curricula therefore end with a uniform distribution over all training examples which is the desired distribution, P(z) in the paper). There's additionally a constraint on weights, but I believe this can be recast as "once an example has a nonzero chance of being drawn, it cannot go back to 0".

I think it's worth wondering if these constraints are necessary, and empirically testing what happens when we try to break them.

## Experiments

There were a number of experiments -- I suggest reading 4.1 and 4.2 as examples that are easy benchmarks for testing such strategies. Section 5 caught my eye, where the dataset is 32x32 images of shapes (triangle, oval, rectangle) and the curriculum of first only showing equilateral triangles, circles, and squares, followed by all shapes, which achieved better results than just training on the set of all the shapes. It suggests that curriculum training on natural images could be a feasible strategy.

The graph shown at the beginning of this summary is from a language modeling experiment and I thought the curve was particularly interesting re: the "qualitatively different minima" remark.

## Notes

### Uncertainty Criterion

A misconception I had, that the example about which one is the most uncertain will give the most information (and hence you should design your curriculum to pick things most unlike what have been seen before), was addressed explicitly in the paper: "In principle one could argue that difficult examples can be more informative than easy examples. Here the difficult examples are probably not that useful because they confuse the learner rather than help it establish the right location of the decision surface." This is an interesting point and particularly true in the case of noisy data.

They later make a point that "It would be advantageous for a learner to focus on 'interesting' examples, which would be standing near the frontier of the learner's knowledge and abilities, neither too easy nor too hard." Perhaps there's an optimal distribution to sample over the uncertainty criterion (which could remain fixed, and provide a **purely model-centric curriculum**).

### Curriculum Learning as Transfer Learning

This point in the very end of the paper stuck out to me--that "curriculum learning can be seen as a special form of transfer learning where the initial tasks are used to guide the learner so that it will perform better on the final task." This to me stands out as an indicator of how the representations learned via a curriculum might be seen as more general in some sense, and lead to qualitatively different local minima.

Using unsupervised feature representation and then fine-tuning for a classification problem (eg autoencoder which eventually gets a final softmax layer) seems analogous, where the fine-grained features that become useful for recognizing a class after finetuning aren't baked into the initial architecture just as more fine-grained training examples aren't included in the initial step of the curriculum. (Said unsupervised representations are notably often good for transfer learning to range of alternate tasks.)
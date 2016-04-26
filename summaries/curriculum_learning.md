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
# Flexible shaping: How learning in small steps helps

Authors: Kai A. Krueger, Peter Dayan. [PDF of paper](http://www.gatsby.ucl.ac.uk/~dayan/papers/kruegerdayan09.pdf)

## Short Version

A vanilla LSTM is trained on a context-sensitive task with a curriculum designed to cause it to encode short- and long-term context sensitivity. The curriculum is shown to reduce train time by a large factor.

## Contributions

### Shaping

This seems to be one of the earliest papers on curriculum learning for artificial neural nets, referring to it as Shaping (borrowing the term from behavioral psychology). Curriculum training of an LSTM is evaluated on the setting of the 12-AX task (details below) by defining a set of stages for the LSTM to be trained on which explicitly encode the different time-scale dependencies of the data.

These stages, unlike future literature on curriculum learning, are fundamentally different problems than the final task (e.g. responding with L for all entries between 1 and 2, and R for others--see Curriculum Stages below for more detail). Because the dynamics of the problem are explicitly known beforehand, a reasonable curriculum of this nature can be designed (and performs well).

### Resource Allocation

After the network learns to solve one of the subtasks, it is augmented with additional memory and the previous memory weights become fixed. They call this resource allocation, and use it to address the "stability-plasticity dilemma" in shaping which is concerned with the ability to converge on solutions while not ruling out further adaptive behavior.

This resource allocation can be done both by hand or automatically (both achieve better results than without a curriculum). Automatic allocation is triggered by a sudden increase in error rate (calculated as a sudden--which isn't defined--10% drop in a smooth, exponentially decaying running average of successes), after which a new memory block is initialized with random weights and the highest learning rate, while other blocks decay their learning rates. Mechanisms such as this could provide interesting possibilities for dynamically growing a network over time.

Notably without resource allocation, the curriculum trained network takes much longer than without a curriculum. Hence the curriculum alone (in this setting) is not a gain. The coupling of these dynamics (along with the additional complexity of resource allocation) make the approach less appealing to me.

## Notes

### 12-AX Task

A sequence of characters in the set \{1, 2, A, B, C, X, Y, Z\} is given, and an output sequence of characters in \{L, R\} is the target. R should be outputted for an X that follows an A, where the previous numeric value was a 1, and similarly for a Y following a B where the previous number was a 2. For all other characters an L should be outputted (hence the length of the output is the same as that of the input, with R's aligned at target locations). There are some additional requirements for the training data:
 - characters are grouped by pairs in \{A, B, C\} x \{X, Y, Z\} so e.g. AA and XX aren't allowed,
 - at least 50% of all chunks between numbers must contain an AX or BY
 - chunks between numbers have between 1 and 4 pairs

 ## Curriculum Stages

 These are each given various numbers of stages which aren't elaborated on in detail.
 i) Learn to memorize 1 and 2 for long periods (L at 1 and after, R at 2 and after).
 ii) Memorize A or B for one-step AX/BY blocks (which each give LR, everything else gives L) -- note this isn't dependent on 1's and 2's
 iii) Full 12-AX task

 An additional note: for step i the letters used are outside of the target set so as to not confuse the network, and for step ii the letters C,X,Y,Z aren't used (replaced by  random other letters). This decision was peculiar to me and I'm curious how well the curriculum performs without it (using the full symbol set, but altered targets).
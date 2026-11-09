---
layout: post
title: "Bottleneck Theory of Post-training"
date: 2026-11-10 00:00:00 +0100
---

*This is the inaugural post of my blog, which I wanted to kick off for some time. and it is a great start, on a topic I like. I wrote this together with great [Fabio Valerio Massoli](https://scholar.google.com/citations?user=b5kxczMAAAAJ&hl=it), following our upcoming paper at NeurIPS'26 on using information bottleneck methods for neural  reasoning.*

In modern reasoning-model training, we hear of methods like RL with verifiable rewards (RLVR) [[5]](#ref-5), reinforcement learning from AI feedback (RLAIF) [[6]](#ref-6), on-policy distillation (OPD) [[8]](#ref-8), on-policy self-distillation [[7]](#ref-7), and many other variants. They differ in where their training signal comes from, whether the signal is scalar or token-level, and whether the training data are on-policy or offline.
Despite the differences, they optimize remarkably similar objectives.


This is the main message of this post, and what we have explained in our paper *Reasoning as Compression* [[1]](#ref-1):

> **Reasoning models learn a stochastic reasoning channel that simulates the path going from question to answer, with the reasoning structure emerging from the constraints on the reasoning path. Post-training methods are special cases of this view, formalized under the conditional information bottleneck framework.**

In particular, budget-forcing variants [[9]](#ref-9), that is, methods compressing reasoning tokens, are a special case of the bottleneck view: reasoning traces should preserve task-relevant information while discarding information that is unnecessary, costly, or already available from the prompt.

We introduced the Conditional Information Bottleneck (CIB) in our paper *Reasoning as Compression: Unifying Budget Forcing via the Conditional Information Bottleneck* [[1]](#ref-1) to formalize this view.

## Reasoning, information bottleneck and emergence of structure

What is reasoning? There are many accounts of what reasoning is, but let's start with this version for now: "Theoretical reasoning is a mental process that takes you from premises that you believe to a conclusion that you come to believe as a result of the process." (Broome, 2021 [[10]](#ref-10)).

We want to look at neural reasoning in a similar way: a process, a **path** that goes from the premise (the prompt, the query) to a conclusion, our final answer. And the differences between post-training methods can be organized by a single information-theoretic picture:

> **Reasoning is about learning to simulate a stochastic channel that takes the prompt to the final answer**.

Of course, reasoning as we know it, indeed anthropomorphically, comes with additional normative features: following inference rules, logical consistency, evidence accumulation and attribution. The hope of post-training is to learn these structures holistically, not necessarily by imbuing these rules within the model, but by making them emerge as a result of our learning process.

Structure emerging under constraint has been a recurring theme in physics, information theory, complexity theory and biology. We are going to pick the information bottleneck framework (Tishby, Pereira, and Bialek, 1999 [[2]](#ref-2)), which has also been used to study deep learning (Shwartz-Ziv and Tishby, 2017 [[11]](#ref-11)), to continue. In information bottleneck, given a joint distribution between an input variable $$X$$ (the data) and a relevant target variable $$Y$$ (what needs to be predicted), we want to find a compressed representation $$T$$ that retains as much information about $$Y$$ as possible. The constraint is on $$T$$: the mutual information $$I(X; T)$$ needs to be constrained. In this case, optimizing the Lagrangian $$\mathcal{L} = I(T; Y) - \beta I(X; T)$$ forces the system to perform a non-linear quantization. The irrelevancies and noise of $$X$$ are stripped away. What remains is a parsimonious, maximally informative sufficient statistic ($$T$$) that captures the structure needed to solve the problem.

To apply the information bottleneck to reasoning, there is a catch.

## Conditional information bottleneck

Consider a reasoning problem with


$$

X \sim P_{\mathcal D}(X),
\qquad
Y \sim P_{\mathcal D}(Y\mid X),

$$

where $$X$$ is the user/problem prompt and $$Y$$ is the desired answer.

A reasoning model samples an intermediate trace


$$

Z=(z_1,\ldots,z_T)\sim \pi_\theta(\,\cdot\mid X),

$$

and then produces an answer according to


$$

\pi_\theta(Y\mid X,Z).

$$

The usual intuition is that $$Z$$ is a *computational bridge*: it contains information that helps transform $$X$$ into $$Y$$. A good reasoning trace should satisfy two apparently opposing requirements:

- **Sufficiency:** $$Z$$ should contain the information about $$Y$$ that is useful beyond what is already available from $$X$$. This is captured by $$I(Z;Y\mid X)$$.
- **Minimality:** $$Z$$ should not contain unnecessary information. This is captured by $$I(X;Z)$$.

The corresponding conditional information bottleneck (CIB) is


$$

\boxed
{
\max_{\pi_\theta}
I(Z;Y\mid X)-\beta I(X;Z)
}
\tag{1}

$$

where $$\beta\ge 0$$ controls the accuracy/compression trade-off.

This formulation was introduced specifically to repair a problem with applying the classical Information Bottleneck directly to chain-of-thought [[4]](#ref-4). In a transformer, the answer decoder sees both $$X$$ and $$Z$$; therefore the Markov assumption underlying the ordinary IB,


$$

Y\leftrightarrow X\leftrightarrow Z,

$$

is not the right structural model. CIB instead asks for information about $$Y$$ that is **conditional on $$X$$**.

There are other differences from the classical literature on channel simulation and information bottleneck:
* In information theoretic setups, the distribution $$P(Y\mid X)$$ is known, and the goal is to find a stochastic encoder $$P(Z\mid X)$$ and a decoder $$P(Y\mid Z)$$. However, in reasoning, we only have access to $$P(Y\mid X)$$ through samples $$(X_i,Y_i)$$.
* In classical information bottleneck, the optimization is over $$P(Z\mid X)$$ and $$P(Y\mid Z)$$. In the case of neural reasoning, the optimization is over parameters $$\theta$$ of a model $$\pi_\theta$$.

These differences impact how we optimize and approximate the objective.

## Simulating the reasoning channel

For every prompt $$x$$, let $$\pi_\theta(z\mid x)$$ be the reasoning policy we want to learn. Let's study each one of the two terms.


**Minimality:** The term $$I(X;Z)$$ aims at compressing $$Z$$. It is given as follows:

$$

I(X;Z) =\mathbb E \big(\log\frac{\pi_{\theta}(Z|X)}{P(Z)}\big)

$$

Expectation is computed empirically using samples of $$(X,Z)$$, but it still requires knowledge of $$P(Z)$$. What is $$P(Z)$$ and why does it pop up in the expression? **The distribution $$P(Z)$$ is a prior over the space of reasoning traces.** Intuitively, the term $$P(Z)$$ is pushing the generated trace $$Z$$ toward the space of reasoning traces. In other words, **$$\log P(Z)$$ in the CIB bound rewards the use of *natural reasoning traces***. $$P(Z)$$ is unknown in general, but we can use any other approximate prior $$Q$$ (as in Alemi et al., 2017 [[3]](#ref-3)) and use this relation:

$$

\mathbb E_X
D_{\mathrm{KL}}
\big(
\pi_\theta(z\mid X)\|Q(z)
\big)
=
I(X;Z)
+
D_{\mathrm{KL}}(P_Z\|Q).
\tag{2}

$$

Hence:

$$

I(X;Z)
\le
\mathbb E_X
D_{\mathrm{KL}}
\big(
\pi_\theta(z\mid X)\|Q(z)
\big).
\tag{3}

$$

Therefore minimizing the minimality term is done by minimizing the KL-to-prior upper bound.

**Sufficiency:** We can write $$I(Z;Y\mid X)=H(Y\mid X) - H(Y\mid X,Z)$$. The first term $$H(Y\mid X)$$ is independent of $$Z$$, so we just need to maximize $$-H(Y\mid X,Z)$$. A similar variational bound as above can be used to find a lower bound using any variational decoder $$q_\theta(y\mid x,z)$$:

$$

\mathbb E_P[\log q_\theta(y|x,z)] = -H(Y|X,Z) - \mathbb E\,\mathrm{KL}\big(p(\cdot|x,z)\,\|\,q_\theta\big)\le -H(Y|X,Z).

$$

$$q_\theta$$ can be chosen such that $$\log q_\theta(y\mid x,z)$$ is $$S(x,z)$$, any scalar sufficiency signal assigned to a trajectory. It can be a binary verifier reward, a learned reward model, an AI-generated preference score, a teacher's token-level log probability, a self-teacher's log probability, a supervised likelihood, or a filtered/weighted version of a supervised target.

Then, we are ready to optimize the objective using any chosen sufficiency signal $$S(x,z)$$ and any prior $$Q(z)$$:

$$

\mathcal J(\theta)
=
\mathbb E_{x,z\sim\pi_\theta}
\left[
S(x,z)
+
\beta\log Q(z)
+
\beta H(\pi_\theta(\cdot\mid x))
\right].
\tag{4}

$$

This is a typical entropy-regularized post-training objective with a particular $$S(x,z)$$, however, with an additional term $$\log Q(z)$$, which compresses the traces leveraging prior $$Q$$.

## Obtaining LLM post-training methods from CIB

We introduce a small change in our bound, and use a conditional prior $$Q(z\mid x)$$ instead:

$$

\mathcal J(\theta)
=
\mathbb E_{x,z\sim\pi_\theta}
\left[
S(x,z)
+
\beta\log Q(z\mid x)
+
\beta H(\pi_\theta(\cdot\mid x))
\right].
\tag{5}

$$

We can now obtain many familiar methods from this bound.

**RLVR [[5]](#ref-5):** We can select $$S(x,z)$$ equal to the verifier reward $$r_{\mathrm{VR}}(x,z)=\mathbf 1\{\widehat y(x,z)=y\}$$. $$\beta$$ controls whether we add budget forcing [[9]](#ref-9) or not. We typically sample on-policy from the model we optimize on.

**RLAIF [[6]](#ref-6):** We can select $$S(x,z)$$ equal to the AI critic: $$r_{\mathrm{AI}}(x,z)$$. We typically sample on-policy from the model we optimize on.

**OPD [[8]](#ref-8):** In OPD, the states are generated by the student, on-policy: $$z\sim\pi_\theta(\cdot\mid x).$$ A teacher provides a distribution $$q_T(z_t\mid x,z_{<t}).$$ A canonical token-level OPD objective is:


$$

\min_\theta
\mathbb E_{x,z\sim\pi_\theta}
\left[
\sum_{t=1}^{T}
D_{\mathrm{KL}}
\left(
q_T(\cdot\mid x,z_{<t})
\|
\pi_\theta(\cdot\mid x,z_{<t})
\right)
\right].

$$

Ignoring terms independent of $$\theta$$, the forward KL is


$$

D_{\mathrm{KL}}(q_T\|\pi_\theta)
=
-\mathbb E_{u\sim q_T}
\log \pi_\theta(u\mid x,z_{<t})
+
\text{const}.

$$

Hence OPD can be interpreted as maximizing a teacher-defined sufficiency functional:


$$

S_T(x,z)
=
\sum_t
\mathbb E_{u\sim q_T}
\log \pi_\theta(u\mid x,z_{<t}).

$$

In the reverse-KL representation, the optimization problem is as follows:


$$

{
\max_\theta
\mathbb E_{x,z\sim\pi_\theta}
\left[
\log Q_T(z\mid x)
\right],
}

$$

where $$Q_T(z\mid x)=\prod_t q_T(z_t\mid x,z_{<t}).$$ This is precisely the cross-entropy-rate term that appears in the variational CIB construction.


**SFT:** Suppose the dataset contains demonstrations $$(x,z^*).$$ Ordinary SFT minimizes


$$

\mathcal L_{\mathrm{SFT}}
=
-\mathbb E_{(x,z^*)\sim\mathcal D}
\log \pi_\theta(z^*\mid x).

$$

Equivalently,


$$

\max_\theta
\mathbb E_{(x,z^*)\sim\mathcal D}
\log\pi_\theta(z^*\mid x).

$$

If we introduce the empirical demonstration distribution $$Q_{\mathcal D}(z\mid x)$$, then:


$$

\mathbb E_{x,z\sim Q_{\mathcal D}}
\log\pi_\theta(z\mid x)
=
-H(Q_{\mathcal D})
-
\mathbb E_x
D_{\mathrm{KL}}
(Q_{\mathcal D}(\cdot\mid x)
\|
\pi_\theta(\cdot\mid x)).

$$

Thus SFT is the **offline analogue** of distillation: the data distribution plays the role of the teacher.

## Final words

The conditional information bottleneck framework provides a general way of thinking about post-training of reasoning models. It is flexible to the choice of the sampling distribution, which can change from one case to another, and it provides a playground for selecting prior $$Q$$ for controlling the minimality, and the term $$S(x,z)$$ for sufficiency. The choice of $$\beta$$ controls the compression rate, and we have shown in our experiments that the compression rate can be controlled smoothly with $$\beta$$ [[1]](#ref-1).

RLVR, RLAIF, SFT, OPD, and indeed self-distillation [[7]](#ref-7) can all be represented within a generalized variational CIB framework, in which post-training specifies a sufficiency functional and an information reference, while on-policy versus offline training specifies the trajectory distribution on which the functional is evaluated.

## References

1. <a id="ref-1"></a>**Massoli, F. V., Kuzmin, A., & Behboodi, A.**  
   *Reasoning as Compression: Unifying Budget Forcing via the Conditional Information Bottleneck.* NeurIPS 2026.  
   arXiv:2603.08462, 2026.  
   https://arxiv.org/abs/2603.08462

2. <a id="ref-2"></a>**Tishby, N., Pereira, F. C., & Bialek, W.**  
   *The Information Bottleneck Method.* 1999.  
   https://arxiv.org/abs/physics/0004057

3. <a id="ref-3"></a>**Alemi, A. A., Fischer, I., Dillon, J. V., & Murphy, K.**  
   *Deep Variational Information Bottleneck.* ICLR 2017.  
   https://arxiv.org/abs/1612.00410

4. <a id="ref-4"></a>**Wei, J. et al.**  
   *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models.* NeurIPS 2022.  
   https://arxiv.org/abs/2201.11903

5. <a id="ref-5"></a>**Shao, Z. et al.**  
   *DeepSeekMath: Pushing the Limits of Mathematical Reasoning in Open Language Models.* 2024.  
   https://arxiv.org/abs/2402.03300

6. <a id="ref-6"></a>**Lee, H. et al.**  
   *RLAIF: Scaling Reinforcement Learning from Human Feedback with AI Feedback.* 2023.  
   https://arxiv.org/abs/2309.00267

7. <a id="ref-7"></a>**Zhao, S. et al.**  
   *Self-Distilled Reasoner: On-Policy Self-Distillation for Large Language Models.* ICML 2026.  
   https://arxiv.org/abs/2601.18734

8. <a id="ref-8"></a>**Song, M. & Zheng, M.**  
   *A Survey of On-Policy Distillation for Large Language Models.* 2026.  
   https://arxiv.org/abs/2604.00626

9. <a id="ref-9"></a>**Aggarwal, P. & Welleck, S.**  
   *L1: Controlling How Long a Reasoning Model Thinks With Reinforcement Learning.* 2025.  
   https://arxiv.org/abs/2503.04697

10. <a id="ref-10"></a>**Broome, J.**  
    *Normativity, Rationality, and Reasoning: Selected Essays.* Oxford University Press, 2021.

11. <a id="ref-11"></a>**Shwartz-Ziv, R. & Tishby, N.**  
    *Opening the Black Box of Deep Neural Networks via Information.* 2017.  
    https://arxiv.org/abs/1703.00810


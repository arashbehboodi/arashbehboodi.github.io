---
layout: post
title: "First one!"
date: 2025-08-08
image: /src/Fundamentals.jpg
---
Da da

Search
Write
Sign up

Sign in



notonlymaths
notonlymaths
Ένα blog για τους μαθηματικούς και όσα τους απασχολούν…

Follow publication

Using LaTeX on Medium
Nice and clear scientific typesetting made simple
Bill Markos
Bill Markos

Follow
8 min read
·
Oct 19, 2020
363


8



Press enter or click to view image in full size
LaTeX is everywhere… Well, it should be!
LaTeX is everywhere…Well, it should, at least.
Prelude
As a mathematician, writer and blogger, as soon as I join a new platform that may require some typesetting of maths symbols — even simple ones such as exponents, indices etc — a google search of the form “how to use latex on X” appears on my browsing history. As a result, it was inevitable that right after joining Medium I would look for ways to use LaTeX in my stories so that it doesn’t look awkward and out of context.

On desktop
While on desktop, there are several options should you wish to include some LaTeX in your stories, from copy-pasting screenshots of latex equations and/or shapes created on your preferred latex editor to using fancy browser add-ons.

The old-fashioned way
Evidently, if you are accustomed to typesetting with LaTeX, you will be probably using some LaTeX editor — e.g. TeXstudio or Overleaf or even Notepad+terminal. So, a straightforward solution could be to open a new file in your editor, write anything you wish to, either typeset it in an image format (explained below) or typeset it in a .pdf and then take a screenshot of the resulting equation/shape and paste it on your story as an image. However, there are several drawbacks in this approach:

you need to leave your browser window and start a new document elsewhere;
you need to transform the output to some appropriate format other than .pdf — e.g. .png or .jpeg.
Even so, this method is probably the most useful when it comes to including shapes typeset with LaTeX on a story. Let’s say, for instance, that we would like to include the following shape in our story:

Press enter or click to view image in full size
A simple .png image
A nice .png image
The shape’s source code is shown below:

\documentclass{standalone}
\usepackage{euler}
\usepackage{tikz}
\begin{document}
 \begin{tikzpicture}
 \node[circle, inner sep=1.5pt, draw=black, fill=black, label={below}:{$O$}](o) at (0,0){};
 \draw[thick] (x) -- (4,0)node[pos=1,below]{$x$};
 \draw[thick] (y) -- (-2,2)node[pos=1,left]{$y$};
 \end{tikzpicture}
\end{document}
You can ignore the tikz code — since it is quite simple — as well as the euler package — euler just takes care of the nice font we are using. However, you should pay attention at the document class. We used standalone so as to get rid of any not necessary white space other document classes may introduce — e.g. declaring our document as an article would by default assume an A4 page layout, resulting in a lot of unneeded white space. In case you don’t like the white space left automatically around your shape by the standalone class, you can always consult the class’s documentation to find out how to alter it.

If you try to typeset the above code, you will end up with a nice .pdf file. But, unfortunately, uploading a .pdf file on medium as an image is not an option, so we should somehow convert it to one of the usual Medium image formats — i.e. .png, .jpeg or .gif. The most naive way of all would be to take a screenshot of our shape from the .pdf we have just generated. Nevertheless, it takes usually a lot of effort to properly crop an image so as to satisfy the most demanding pairs of eyes — well, personally I’m quite obsessive with such things so I would not accept screenshots as an option.

Instead of taking screenshots, we can directly convert our .pdf to a .png file. To do so we can either use an online converter — a google search yields tons of such websites — or convert our file locally. The advantage of using an online service for such a conversion is that it is pretty much a simple process: you upload your .pdf file, hit some convert/download button — at this point some advertisements may pop up — and then your .png file is ready to use. However, most of these online services limit the output’s quality — i.e. your image will be of inferior resolution when compared to the originally created .pdf. If you are fine with this compromise, then there’s no need to seek for another alternative.

Even so, there are some cases in which we would like to preserve our image’s resolution — after all, quality is one of the major reasons to use LaTeX. A tool that gives us full control over the output’s quality is ImageMagick. ImageMagick is a free tool which can, among others, convert our .pdf shapes/formulas/whatever to nice .png images as the one above without any compromise in quality. So, at first, we have to download ImageMagick and install it — the wizard is easy to follow. Then, we also have to download Ghostscript, which is essential for several of ImageMafick’s functions — image conversion included. You can download Ghostscript from ghostscript’s official site and then install it. Now, we are fully equipped to convert our .pdf files to usual image file formats without losing any quality.

To begin with, open a terminal/cmd window and navigate to the folder where the target .pdf is located. Then, run:

magick -density 300 pdf_name.pdf -quality 90 image_name.png
The above command will place in your current a nice high resolution .png version of your shape/equation. Let us explain a little more the above command:

“magick” is the command that conduct the conversion — in older version “convert of “magick convert” were used instead;
the -density parameter — set to 300 in this case — defines the number of pixels per inch (ppi) the final image will have;
the -quality parameter — set to 90 here — defines compression rate and several other attributes.
So, using ImageMagick you can convert any .pdf you have to high quality images in all formats allowed on Medium.

Online solutions
While the above old-fashioned way is optimal for shapes or other complex LaTeX constructions, it would be an overkill to use it in order to import simple equations/symbols. Luckily enough, there are easier ways to import a well-shaped LaTeX equation, like the one below, on Medium:

A nice .png
A well known formula
Googling “latex to png/jpeg/gif” will yield several results. Of these, my long-time favourite has been https://latex2png.com/ mostly due to its straightforward design. You simply have to write your LaTeX code, pick your desired resolution — avoid choosing resolutions higher than 600 since it usually throws an error message — and hit “Generate”. That’s all! What you now have to do is copy-paste or download and import your freshly created image in your story.

Get Bill Markos’s stories in your inbox
Join Medium for free to get updates from this writer.

Enter your email
Subscribe
Note that you can add latex2png to your browser’s bookmarks toolbar or add a button so as to access it easily.

Browser add-ons
If you’re not satisfied with having to switch tabs so as to generate your equation and then copy-paste it to your story, there’s an even faster and possibly more convenient solution: browser add-ons. There are several add-ons for most widely used browsers — such as Firefox, Chrome etc — that allow for importing latex equations in your documents as images. One of the simplest yet fully functional ones is TeX Math Here, which is available on both Firefox and Chrome. Once you install it, you will be overwhelmed by how simple and effective it is. You simply click on the add-ons icon — a red pin with “TeX” written inside — type your LaTeX equation, specify font and font size — you can pick among Latin Modern, Verdana, Comic Sans (please, don’t), Computer Modern and Helvetica — and then hit “Convert”. The resulting equation shows up and it automatically copied to your clipboard.

So, with TeX Math Here we can typeset the following equation:

Press enter or click to view image in full size
Latin Modern
A well known inequality
We can also make it larger and in Comic Sans — again, please, don’t:

Comic Sans
You see why you shouldn’t use Comic Sans, right?
We can also keep it that large, but use Helvetica:

Helvetica
Well, pretty nice output!
Anyway, you get the point: there are several ways to import LaTeX content on Medium from your desktop. How about from your smartphone?

On mobile devices
Many Medium users tend to create their stories on their smartphones, using the Medium app. As a result, it would be useful if one could have some options to include LaTeX formulas in a story without having to load and edit their story from their desktop. Fortunately, there exist a couple of them.

VerbTeX
VerbTeX is a LaTeX editor that provides access to a full TeXLive distribution as well as pdfTex and XeTeX engines to typeset your LaTeX code. It also offers syntax highlighting as well as integration with your dropbox account in it’s free version — under no other conditions or limitations. While it is a nice solution to create and edit LaTeX projects from any of your android devices, it still is a LaTeX editor, which means that, once you have typeset your equation/shape, you have to convert it to a Medium-compatible image format (.png/.jpeg/.gif).

So, apart from VerbTeX, you also need a screenshot app with a nice cropping functionality. While there is a bunch of options out there, my personal pick is Selection which is quite intuitive as well as light and functional. You simply select the area you want — a grid is displayed so as to help you coordinate your efforts (pun intended) — and then you crop it. Simple as that, you can combine it with VerbTeX and work from your smartphone or tablet as if you were on your desktop.

QuickTeX
I’m a fan of simplicity and all-in-one solutions tend to be the simplest ones — well, not always, but most of the times this seems to hold. So, how about an all-in-one solution our problem — i.e. a mobile app that allows us to typeset LaTeX equations as well as share them on several social media and platforms? Well, QuickTeX is a good candidate for such a task. You can create any LaTeX equation you want and then share it on any popular social medium or messaging app. Moreover, you can also send it directly to your Google Drive from where you can easily import it as an image to your Medium stories.

Also, the application is incredibly lightweight and minimalistic — there is just an editor, a send/share button and a tab of some examples of LaTeX equations. So, you open QuickTeX, write your LaTeX source code and then share it with the world!

Epilogue
The above are just a brief and, of course, incomplete list of methods that one may utilise so as to import LaTeX equations/shapes to their stories. Nevertheless, as far as my experience is concerned, they are among the easiest and most comfortable ones.

See you soon!

If you enjoy notonlymaths, consider visiting my mathematics and education blog.

Latex
English
Guides And Tutorials
How To
363


8


notonlymaths
Published in notonlymaths
5 followers
·
Last published Feb 22, 2021
Ένα blog για τους μαθηματικούς και όσα τους απασχολούν…


Follow
Bill Markos
Written by Bill Markos
189 followers
·
40 following
Mathematician.


Follow
Responses (8)

Write a response

What are your thoughts?

Cancel
Respond
Yongyi Mao
Yongyi Mao

Mar 20, 2023


The extension works nicely! Thank you
2


1 reply

Reply

Haseeba
Haseeba

Dec 12, 2022


thank you so much, it is really helpful.
1


1 reply

Reply

PhiWhyyy!?!
PhiWhyyy!?!

Apr 22, 2022


Thank You so much, this was the information i was searching for a long time as always taking snaps of mathematical jargon was quite tedious and thanks to this im able to typeset the equations without taking snaps everytime.
23


1 reply

Reply

See all responses
More from Bill Markos and notonlymaths
Self-Studying Mathematics
Math Simplified
In

Math Simplified

by

Bill Markos

Self-Studying Mathematics
Some tips about studying one of the oldest knowledge corpora out there
Oct 7, 2021
466
4
Κινητά στην τάξη
notonlymaths
In

notonlymaths

by

Bill Markos

Κινητά στην τάξη
Ο καλύτερος φίλος την ώρα του μαθήματος
Feb 19, 2021
Pen and pencil
notonlymaths
In

notonlymaths

by

Bill Markos

Από πάνω προς τα κάτω…
Λίγα λόγια για το πώς η αναδιάρθρωση της εκπαίδευσης δεν ξεκινά με τις πανελλαδικές…
Feb 17, 2021
“Feminism” written with purple spray on a walk, over two chairs.
Bill Markos
Bill Markos

A Long Way to Walk
A review of Nam-Joo Cho’s “Kim Jiyoung, Born 1982”
May 3, 2022
100
2
See all from Bill Markos
See all from notonlymaths
Recommended from Medium
This new IDE from Google is an absolute game changer
Coding Beauty
In

Coding Beauty

by

Tari Ibaba

This new IDE from Google is an absolute game changer
This new IDE from Google is seriously revolutionary.

Mar 11
6.1K
366
I’ll Instantly Know You Used Chat Gpt If I See This
Long. Sweet. Valuable.
In

Long. Sweet. Valuable.

by

Ossai Chinedum

I’ll Instantly Know You Used Chat Gpt If I See This
Trust me you’re not as slick as you think

May 16
19.2K
1164
Understanding Modern Space Images
Science Spectrum
In

Science Spectrum

by

Anshul Sanghi

Understanding Modern Space Images
And Why False Color Doesn’t Mean Fake Image

3d ago
205
3
Dual Image Super Resolution for High Resolution Optical Satellite Imagery(Model building)
draco_malfoy
draco_malfoy

Dual Image Super Resolution for High Resolution Optical Satellite Imagery(Model building)
This is the second part of the of this project where we are building a super resolution image from two low resolution image , the…
Jul 6
1
Best Python Libraries for Automating Your Life in 2025
The Pythonworld
In

The Pythonworld

by

Aashish Kumar

Best Python Libraries for Automating Your Life in 2025
Automate the boring stuff, the smart way — with these modern Python libraries.

4d ago
14
ChatGPT is poisoning your brain
Jordan Gibbs
Jordan Gibbs

ChatGPT Is Poisoning Your Brain…
Here‘s How to Stop It Before It’s Too Late.

Apr 30
24K
1188
See more recommendations
Help

Status

About

Careers

Press

Blog

Privacy

Rules

Terms

Text to speech
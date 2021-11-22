# Project 3 - Experimental Sound Interactions
## Process Log
### Week 1: November 9 - 15
I didn't do any development on the project this week (as planned) but I did write one banger of a project proposal and grading contract... check it out at the bottom of this document!

### Week 2: November 16 - 22
This week I got to revisit my old code from a year ago, and it wasn't actually as bad as I remembered it. But I still felt like it was in need of a rewrite, especially as I was goind to need a potentially entirely different structure to my code. To figure out that entirely different structure, I decided to start with a pencil and paper. At the start I was just writing down requirements I had in mind, but then I moved on to drawing out a flow chart with boxes and arrows trying to predict what classes I'd need to complete the whole task, Magenta and THREE.js together, as well as what data would be flowing between classes. I didn't get very far until I got impatient and wanted to move straight into coding, because I felt like I was already building up enough of a mental model of the program in my head and at some point paper just starts to slow you down compared to coding. And besides... the structure of a program is never set in stone, it can always be flexible and change to what the development process needs. But for now, the structure is as follows:

I have a `GameManager` class that I'm expecting to house a lot of the overarching game logic as well as pretty much all the other classes in this project. I'm not really using the `GameManager` class very heavily yet, because I've only started working with Magenta this week, and not THREE.js yet at all. But the `GameManager` class turned out to be a really good way to start out organizing my last THREE.js game project, and so I'm starting my structure there for this project too in anticipation of heavy THREE.js usage coming up just next week in the development of this game.

The next most important piece of my structure is the `Settings` class. Last THREE.js game that I made I created a static export `SETTINGS` object that had to be changed before each compile to change aspects of the game. This was perfect for that project because I never intendid on exposing any of the settings to the user. But for Beat Greenhouse, I anticipate having the user control a lot of settings over the generation process, so they can fine tune how their own genetic algorithm works and have more control over their selective breeding process. Perhaps pretty far down the line I would abstract those settings to concepts like the temperature and humidity of the greenhouse, but I think that's super far out of scope with what I could achieve in this project right now. Currently the plan is that even at the end of this project, Beat Greenhouse still will be in prototyping/development phase of what could potentially be a much much grander project in the future. For now I plan on just exposing many of the settings about the genetic algorithm and perhaps even the plant procedural generation algorithm directly to the user. I plan on organizing that into a fully reactive `Settings` that has control and access to the settings ui presented to the user, as well as static singleton instance access available to all classes in the code that could want to access it in order to read the data. Currently that UI isn't set up yet, so it might as well be the static exported object that had to be changed before compiling that I used in last project, but as is the theme for the entire structure right now, it's much more built out than it currently needs to be in anticipation of this project *actually* becoming large and complex in the future.

The `Generator` class will eventually handle both generating children note sequences out of parent note sequences as well as the procedural generation of plants out of such note sequences, but since I haven't incorporated THREE.js into this project at all yet this week, it currently only does the former. But as far as the former is concerned: I have revived my old Magenta related code into something so so much cleaner and simpler, and it works wonderfully; I'm almost a bit proud of it. Currently to test the generator out, if you build the project with the current code (find whatever commit hash this process log was added in and clone it, then run `npm run build`, then `npm run serve`, then navigate to `localhost:8080` in your browser), you'll find that it starts out playing twinkle twinkle little star, and then generates a child of the first and second halves of the song and plays that child, then it assigns the child to one of the parents and repeats the process for ever. But that test will be the first thing I remove next week as I start working on actually generating plants, and perhaps generating them out of the songs that are being generated.

## Project Proposal
### Project Overview
Beat Greenhouse is a project that I actually started ideating a whole year ago as my final project for Creative Code, an ATLAS class that I was taking at the time. I knew however that it involved learning a lot of technologies that I didn't know yet, and the overall scope of the project was way too big to be acomplished in the amount of time that I had. So I scoped the project down, way way down, into learning just the few hardest things I needed to learn at the time.

Beat Greenhouse is a game, or maybe just a game-like interaction (but I might as well call it a game) that ties together the two copletely separate concepts of plant cultivation and music creation. Almost every single plant that we eat as food today has been cultivated to some degree, its genes and gene expression have been morphed by selective breeding from humans to give us the foods we eat today. One fascinating example of cultivation is the species *Brassica oleracea*. That one single species has been cultivated, or morphed, into what are culinarily thought of as dozens of distinct vegetables, many of which can be easily found at a normal grocery store: broccoli, kale, cabbage, cauliflower, brocolini, brusselsprouts, bok choi, gai lan, and collard greens. With the same starting products, but vastly different desired outcomes during the selective breeding process, humans can cultivate endlessly new desirable outcomes.

I see cultivation (of computer generated output of course) to be a similarly great way to create art, including auditory art. Generally when people think about cultivation in a generative art sense, they are actually thinking of curation. In curation, the artist might recieve dozens or hundreds or thousands of art pieces generated by their program, and they select their favorite few to create a gallery out of, or maybe even their favorite single one. Curation might be a simple process, but it certainly creates quite a unique relationship between the computer and the artist. But curation is also not what I'm talking about when I say cultivation. I certainly think that curation is an important step in cultivation, but just like cultivation in the world of horticulture, cultivation in the world of generative art requires repetetive curation combined with some sort of genetic and mutationic iteration to ultimately create selective breeding.

I started ideating this project a year ago, when I came across the music focused machine learning research (and public libraries) from Google's Magenta project. Now I'd like to generally call myself a skeptic of machine learning; I think that there's still not enough work being done to address issues such as racial discrimination, and uses of machine learning such as facial recognition to enforce a police state are problematic at best and absolutely horrendous at worst; *buuuuuuuut* I am a fan of interesting new and unexplored tools to create art and play. And I recognize Magenta as one of these tools, so despite my ethical reservations, I dove right on in. Magenta provides several of their machine learning for music algorithms as both a JavaScript package and a Python package. Unsurprisingly, I'm using their JavaScript package, magenta-js, with TypeScript bindings (of course) to access their MusicVAE model. Magenta's MusicVAE allows for (among other awesome things) interpolation between two MIDI sequences in tensor space. This smooth interpolation in tensor space, when combine with a little bit of randomness, is the perfect candidate for a genetic algorithm for selectively breeding music.

Last year I set up that genetic algorithm, as well as a little interface to allow the user to draw their own MIDI sequences to start out the cultivation process to begin with. I feel like I've grown as a developer a lot since then however, and I kind of cringe at the thought of reusing that old code, I don't really like it anymore. So I honestly plan on rewriting it from scratch. But I'm a lot smarter now, and I expect it to take a fraction of the time it did the first time, so I'm not really too worried about that taking up too much of the schedule. I also don't think I'll include the interface to draw MIDI sequences in the MVP, but I'll talk about that in the next section.

The goal of *this* project in particular is to make use of that selective breeding/genetic algorithm that I started to develop last year, in order to actually create a garden or a greenhouse out of 3D generative plants that are linked to, and playing, their MIDI loop. So even though it's not necessarily directly sound design related, a big portion of the work for this project is going to go into creating the generative algorithm to create plants in 3D space, because that's the next integral part of the Beat Greenhouse experience that I have to develop.

### Minimum Viable Product
I think it's reasonable to ask that by the end of the semester I have developed a unique algorithm to create generative plants. And that I have tied the generation of said plants to characteristics of a MIDI sequence. And that then this system is integrated in some sort of user interface with the musical genetic algorithm that I developed last year so that users can selectively breed their plants and their songs at the same time, because the plant *is* the song! Ideally in my mind that interface is actually a first person player in a 3D world surrounded by plants in the greenhouse around them, but I think trying to include that in the game by the end of the semester might be overscoping the project a little bit too much. So the interface will likely be much simpler than a first person game, but expanding it into becoming a first person game is certainly an *extra* on top of the MVP that I'd like to try and achieve. And if I can get that included, then maybe I will have time to include spatial aduio too, who knows? At this point I'm just day-dreaming of all the ways I would go past the MVP though. Also to keep the interface simple, I might not even bother with letting the user draw their own MIDI sequences on the website at all, it might just be a lot easier for me to let the user create the MIDI sequences in the DAW of their choice and then upload it to the website instead.

TL;DR: All the MVP really is is a way to do selective breeding on combined plant-songs, nothing more, and nothing less.

### Grading Contract
- **A**:
  - Project effortlessly meets MVP, it possibly even goes beyond MVP (though that's not required).
  - Process is well documented in easily readable weekly process log.
  - Process shows project generall sticks to the plan, not too much cramming at the end.
- **B**:
  - Project just barely meets MVP, but it's also a bit buggy or otherwise falls just slightly short in some way.
  - Process log is lacking in detail and shows not much care or thought was put into it.
- **C**:
  - Project clearly fall short of the MVP, but the idea (soul?) of the project is still evident.
  - Process log is missing a week or two.
  - Process log shows evidence of no work done at the beginning and too much crunch time at the end.
- **D** or **F**:
  - Just like the last project, I'm honestly not gonna let this happen to myself, but I would deserve a grade so low if I for no good reason quit the project early, or somehow fall *so* far short of the MVP that my project is clearly a failure.

### Estimated Timeline
- **Week 1**: November 9 - 15
  - Mostly just ideation this week, I'm still busy with the last of my midterm projects in other classes now.
  - I'm writing this project proposal this week.
- **Week 2**: November 16 - 22
  - Week 2 is when I will actually get a start on developing this project.
  - Step 1 of development will be to start transfering over and/or rewriting code from my original beat greenhouse prototype from a year ago.
- **Week 3**: November 23 - 29
  - Thanksgiving break will give me the opportunity to focus on making a lot of progress on the bulk of development without having to worry about smaller deadlines for other classes getting in the way.
  - Step 2 of development will be designing and developing a 3D plant generating algorithm, keeping in mind that MIDI data will be the input to the algorithm.
- **Week 4**: November 30 - December 6
  - The week after Thanksgiving I anticipate I wont be able to dedicate as much time to this project as other weeks, because similar to Week 1, I will be worrying about other deadlines at this point. But that's why I voted to extend the final week of development all the way to the 12th, so that I could afford to worry about those deadlines this week, and then I can wait to worry about that deadline next week.
  - Step 3 of development, which I hope to acomplish during week 4, is to combine the song generation from step one with the 3D generative plants of step 2. After this step I will basically be at a working MVP of the project.
- **Week 5**: December 7 - 12
  - Hopefully I will be at the (probably buggy) MVP at this point, and all I have to do during the final week of development is to do some final refinements and bug fixes, and maybe I can start adding in some etxras on top of the MVP to make the game even more fun and fancy!
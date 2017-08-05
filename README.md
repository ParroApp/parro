# Parro

A technical interviewing platform capable of asking both behavioral and technical questions and analyzing a candidate's performance intelligently.

## Table of Contents

- [Project Overview](#project-overview)
- [Demo](#demo)
- [Contributing](#contributing)

## Project Overview

This was an idea that resulted from a number of pivots before we ultimately zeroed in on exactly the problem we wanted
to solve: a technical interview process that's automated from start to finish. We've even added support for a Q&A session at the end of the interview, where candidates can ask Parro about the company for which they're interviewing and receive answers. There are platforms that handle the technical side like HackerRank, Codility, and others, but none of them provide support for automating the behavioral side of the hiring process, which really matters to certain startups and companies. That's what Parro was built to do.

**Behavioral Implementation**

For the behavioral interview, we used IBM Watson to perform speech to text translation, tone analysis, and personality insights. In order to get Parro to return an audio response, we used [SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) from the Web Speech API. Through Watson's speech to text translation, we were able to write algorithms to pull metrics out of a candidate's responses like their most frequently used words, use of hesitation words (use of "like", "um", and "uh", for example), speech clarity and coherence, and speaking speed. This, in fact, was our biggest challenge here - trying to figure out what kind of insights can we obtain from the translation data.

Another challenge that we encountered was using IBM Watson's text to speech API itself. Initially, we were making curl requests through the terminal to try the API out:

```bash
curl -X POST -u {username}:{password}
--header "Content-Type: audio/flac"
--header "Transfer-Encoding: chunked"
--data-binary audio-file.flac
"https://stream.watsonplatform.net/speech-to-text/api/v1/recognize"
```

We realized that omitting the at symbol (@) prefix from the data-binary flag will post data exactly as specified, i.e. the string "audio-file.flac", and not the contents of the file.

We then used the [node-sdk](https://github.com/watson-developer-cloud/node-sdk) package provided by IBM in our backend server to make API calls to IBM Watson. In order to prevent rate limiting while writing algorithms to pull metrics out of the same data, we cached the result of our first API call by writing the response to a JSON file so that we could reference it at a later time.

Throughout the entire debugging process, we learned that JSON.stringify() accepts multiple parameters. For example, doing JSON.stringify(obj, null, 4) will format the object with a standard pretty-print appearance (4 tabs and new lines).

**Technical Implementation**

For the technical interview, we used the [React version](https://github.com/JedWatson/react-codemirror) of CodeMirror to embed a Text Editor into a webpage. Since there's no way to run code inside of that editor, we had to pull the code out of the text editor and make a request to the backend. From there, we made an API call to [glot.io](http://glot.io/) to actually run the candidate's code using test inputs. Depending on whether their output was correct, incorrect, or errored, we sent a response back to the frontend that rendered a message with the result.

The biggest challenge here was having to make multiple asynchronous API calls to glot.io to run each of the inputs we wanted to run for a given interview question. We used Axios to make each of the calls and pushed the results onto an array, where we were able to rely on Promise.all() to proceed smoothly and check the actual outputs against the expected outputs. This control flow involved requests and responses between the front and backends, multiple asynchronous API calls which we needed to keep ordered, and output validation, all of which made it really difficult to debug. Additionally, running code in whitespace sensitive languages like Python proved to be a bit of a challenge and requires special parsing and formatting to ensure that the code gets run exactly the way the candidate typed it in the text editor, which was a non-issue in languages like JavaScript, Java, and C++.

**Q&A Implementation**

The Q&A portion was implemented with api.ai, so that candidates could ask any of the typical questions about a company and get a smart response back. This does require that companies provide some information about themselves. When the candidate is satisfied, they can say something that sounds like the end of a conversation and the interview will be terminated.

**Frontend**

Our frontend was built using [React](https://facebook.github.io/react/) and [Bulma](http://bulma.io/), a responsive, flex-box based CSS framework. Parro's seamless user interface required little to no user effort, as in the entire experience was guided by us. Therefore, managing state as well as event handling got complicated. For example, rendering different components based off user inputs, or the same component with different props, at the same route meant clearly tracking the state. Another difficulty we overcame was dealing with video and audio recording. We used [RecordRTC](https://github.com/muaz-khan/RecordRTC/) to send audio and video snippets to our server. The frontend dealt with timeslicing our video blobs and capturing audio at the appropriate intervals to only process what was necessary.

**Backend**

Our backend was built using [Express](https://expressjs.com/). One difficulty we encountered was receiving audio and video blobs in an encoded form. To overcome that, we implemented [multer](https://github.com/expressjs/multer), an express middleware to parse incoming files encoded as "multipart/form-data" and store them in a predefined folder on disk.

## Demo

Click on this image to be taken to a video demo of Parro:

[![IMAGE ALT TEXT HERE](parro-vid.png)](https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID_HERE)

## Contributing

Interested in contributing to this project? Feel free! Create a branch, add commits, and [open a pull request](https://github.com/benhubsch/Parro/compare/).

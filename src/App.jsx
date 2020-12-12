import React, { useState, useEffect } from 'react';
import './App.css';

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({ log: true });

function App() {
  const [ready, setReady] = useState(false);
  const [vid, setVid] = useState();
  const [gif, setGif] = useState();

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    load();
  }, []);

  const convertToGif = async () => {
    //Write the file to memory
    ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(vid));

    //Run the FFMpeg command
    await ffmpeg.run(
      '-i',
      'test.mp4',
      '-t',
      '2.5',
      '-ss',
      '2.0',
      '-f',
      'gif',
      'out.gif',
    );

    //Read the result
    const data = ffmpeg.FS('readFile', 'out.gif');

    //Create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: 'image/gif' }),
    );
    setGif(url);
  };

  return ready ? (
    <div className="App">
      <h1 className="Title">Gif Maker</h1>
      {vid && (
        <video src={URL.createObjectURL(vid)} controls width="250"></video>
      )}

      <input type="file" onChange={(e) => setVid(e.target.files?.item(0))} />

      <h1 style={{ margin: '2rem' }}>Result</h1>
      <button className="btn" onClick={convertToGif}>
        Convert
      </button>

      {gif && <img src={gif} width="250" />}
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default App;

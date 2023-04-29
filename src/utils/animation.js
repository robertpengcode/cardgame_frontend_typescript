const playAudio = (clip) => {
  const audio = new Audio();
  audio.src = clip;

  return audio.play();
};

export default playAudio;

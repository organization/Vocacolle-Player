export const formatTime = (time: number, showHours = false) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  const hh = hours.toString().padStart(2, '0');
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');

  if (hours > 0 || showHours) return `${hh}:${mm}:${ss}`;
  return `${mm}:${ss}`
};

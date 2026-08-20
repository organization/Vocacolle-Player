export const injectStyle = () => {
  const style = document.createElement('style');
  style.textContent = `
    body:not(.enable-control) .f1tzxqq7, body:not(.enable-control) .f1uocas, body:not(.enable-control) .f1qw37h7 {
      opacity: 0 !important;
    }

    body:not(.enable-control) .f1pw04al {
      opacity: 0 !important;  
    }
  `;
  document.head.appendChild(style);
};

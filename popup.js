// Popup script
console.log('Popup script loaded');

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('action-btn');
  
  if (button) {
    button.addEventListener('click', () => {
      console.log('Button clicked!');
      alert('Hello from your extension!');
    });
  }
});

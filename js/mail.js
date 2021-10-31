(() => {
  emailjs.init('user_BfsZayL5sw9ONiSC7aWyh');

  const sendButton = document.querySelector('#send-button');
  const sendForm = document.querySelector('#send-form');

  sendForm.addEventListener('submit', (event) => {
    event.preventDefault();

    sendButton.value = 'Sending...';

    const serviceID = 'service_nnn37lh';
    const templateID = 'template_qj1rn6t';

    const templateParams = {
      to_name: 'Yunkuk Park',
      message: document.querySelector('#message').value,
      from_name: document.querySelector('#from_name').value,
    };

    console.log(templateParams);
    emailjs.send(serviceID, templateID, templateParams).then(
      function (response) {
        sendButton.value = 'Send Email';
        alert('메일이 성공적으로 보내졌습니다.');
        console.log('SUCCESS!', response.status, response.text);
      },
      function (error) {
        sendButton.value = 'Send Email';
        alert(JSON.stringify(error));
        console.log('FAILED...', error);
      }
    );
  });
})();

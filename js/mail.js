(() => {
  emailjs.init('user_BfsZayL5sw9ONiSC7aWyh');

  const sendButton = document.querySelector('#send-button');
  const sendForm = document.querySelector('#send-form');
  const inputs = {
    fromName: document.querySelector('#from_name'),
    message: document.querySelector('#message'),
  };

  sendForm.addEventListener('submit', (event) => {
    event.preventDefault();

    sendButton.value = 'Sending...';

    const serviceID = 'service_nnn37lh';
    const templateID = 'template_qj1rn6t';

    const templateParams = {
      to_name: 'Yunkuk Park',
      message: inputs.message.value,
      from_name: inputs.fromName.value,
    };

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

  sendForm.addEventListener('keydown', buttonHandler);

  function buttonHandler() {
    // TODO: 0이 되었음에도 한번 더 키 입력이 되야지 disabled 되는 이슈가 있음.
    let buttonSwitch = false;
    if (inputs.fromName.value.length !== 0 && inputs.message.value.length !== 0) {
      buttonSwitch = true;
    } else if (inputs.fromName.value.length !== 0 && inputs.message.value.length !== 0) {
      buttonSwitch = false;
    }

    if (buttonSwitch) {
      sendButton.disabled = false;
    } else {
      sendButton.disabled = true;
    }
  }
})();

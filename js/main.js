(() => {
  let yOffset = 0; // window page Y offset

  const sceneInfo = [
    {
      // 0 - Landing Section
      type: 'sticky',
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section'),
      },
    },
  ];

  function setLayout() {
    // 섹션 높이 셋팅
    sceneInfo.forEach((scene) => {
      scene.scrollHeight = scene.heightNum * window.innerHeight;

      scene.objs.container.style.height = `${scene.scrollHeight}px`;
    });
  }

  function scrollLoop() {
    console.log(yOffset);
  }

  // 세로 창이 변화되면 Layout 재설정
  window.addEventListener('resize', setLayout);
  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });

  setLayout();
})();

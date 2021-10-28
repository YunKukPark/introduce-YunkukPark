(() => {
  let yOffset = 0; // window page Y offset
  let prevScrollHeight = 0; // 현재 스크롤위치보다 이전에 위치한 스크롤 섹션들의 스크롤 높이 합
  let currentScene = 0; // 현재 활성화된 씬
  let enterNewScene = false; // New Scene 시작되는 순간 True

  const sceneInfo = [
    {
      // 0 - Landing Section
      idx: 0,
      type: 'sticky',
      heightNum: 15, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .landing-message.a'),
        messageB: document.querySelector('#scroll-section-0 .landing-message.b'),
        messageC: document.querySelector('#scroll-section-0 .desc-message.c'),
        messageD: document.querySelector('#scroll-section-0 .landing-message.d'),
        messageE: document.querySelector('#scroll-section-0 .landing-message.e'),
        messageF: document.querySelector('#scroll-section-0 .desc-message.f'),
      },
      values: {
        messageA_opacity: [0, 1],
      },
    },
    {
      // 1 - Linked In Section
      idx: 1,
      type: 'normal',
      heightNum: 1, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-1'),
      },
    },
    {
      // 2 - form Section
      idx: 2,
      type: 'normal',
      heightNum: 1, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-2'),
      },
    },
  ];

  function setLayout() {
    // 섹션 높이 셋팅
    sceneInfo.forEach((scene) => {
      scene.scrollHeight = scene.heightNum * window.innerHeight;
      scene.objs.container.style.height = `${scene.scrollHeight}px`;
    });

    // reload(새로고침) 시 현재 활성화 Scene 파악하기
    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;
      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }
  }

  function calcValues(values, currentYOffset) {
    let rv;
    let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
    rv = scrollRatio * (values[1] - values[0]) + values[0];
    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;

    console.log(currentScene);

    switch (currentScene) {
      case 0:
        let messageA_opacity_in = calcValues(values.messageA_opacity, currentYOffset);
        objs.messageA.style.opacity = messageA_opacity_in;
        console.log(messageA_opacity_in);
        break;
      case 1:
        break;
      case 2:
        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;
    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
    }

    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return;
      currentScene--;
    }
    document.body.setAttribute('id', `show-scene-${currentScene}`);

    if (enterNewScene) return; // 새로운 씬에 들어왔을 때 음수값 나오는 버그 수정
    playAnimation();
  }

  // 세로 창이 변화되면 Layout 재설정
  window.addEventListener('resize', setLayout);
  window.addEventListener('load', setLayout);
  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });

  setLayout();
})();

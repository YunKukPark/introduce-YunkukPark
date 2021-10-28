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
        messageG: document.querySelector('#scroll-section-0 .landing-message.g'),
        canvas: document.querySelector('#video-canvas-0'),
        context: document.querySelector('#video-canvas-0').getContext('2d'),
        videoImages: [],
      },
      values: {
        //MESSAGE
        messageA_opacity_in: [0, 1, { start: 0.05, end: 0.1 }],
        messageA_translateY_in: [20, 0, { start: 0.05, end: 0.1 }],

        messageA_opacity_out: [1, 0, { start: 0.12, end: 0.2 }],
        messageA_translateY_out: [0, -20, { start: 0.12, end: 0.2 }],

        messageB_opacity_in: [0, 1, { start: 0.22, end: 0.27 }],
        messageB_translateY_in: [20, 0, { start: 0.22, end: 0.27 }],

        messageB_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
        messageB_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],

        messageC_opacity_in: [0, 1, { start: 0.37, end: 0.42 }],
        messageC_translateY_in: [50, 0, { start: 0.37, end: 0.42 }],

        messageC_opacity_out: [1, 0, { start: 0.44, end: 0.47 }],
        messageC_translateY_out: [0, -50, { start: 0.44, end: 0.47 }],

        messageD_opacity_in: [0, 1, { start: 0.5, end: 0.57 }],
        messageD_translateY_in: [20, 0, { start: 0.5, end: 0.57 }],

        messageD_opacity_out: [1, 0, { start: 0.59, end: 0.64 }],
        messageD_translateY_out: [0, -20, { start: 0.59, end: 0.64 }],

        messageE_opacity_in: [0, 1, { start: 0.65, end: 0.7 }],
        messageE_translateY_in: [20, 0, { start: 0.65, end: 0.7 }],

        messageE_opacity_out: [1, 0, { start: 0.72, end: 0.75 }],
        messageE_translateY_out: [0, -20, { start: 0.72, end: 0.75 }],

        messageF_opacity_in: [0, 1, { start: 0.8, end: 0.85 }],
        messageF_translateY_in: [50, 0, { start: 0.8, end: 0.85 }],

        messageF_opacity_out: [1, 0, { start: 0.87, end: 0.92 }],
        messageF_translateY_out: [0, -50, { start: 0.87, end: 0.92 }],

        messageG_opacity_in: [0, 1, { start: 0.92, end: 0.95 }],
        messageG_translateY_in: [50, 0, { start: 0.92, end: 0.95 }],

        messageG_opacity_out: [1, 0, { start: 0.97, end: 1 }],
        messageG_translateY_out: [0, -50, { start: 0.97, end: 1 }],

        //IMAGE
        videoImageCount: 300,
        imageSequence: [0, 299],

        // Canvas
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
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

  function setCanvasImages() {
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem = new Image();
      imgElem.src = `./assets/video/001/IMG_${6726 + i}.JPG`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }
  }

  function setLayout() {
    // 섹션 높이 셋팅
    sceneInfo.forEach((scene) => {
      if (scene.type === 'sticky') {
        scene.scrollHeight = scene.heightNum * window.innerHeight;
      } else if (scene.type === 'normal') {
        scene.scrollHeight = scene.objs.container.offsetHeight;
      }

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
    document.body.setAttribute('id', `show-scene-${currentScene}`);

    const heightRatio = window.innerHeight / 1080;

    // Canvas 크기 조절
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%,-50%,0) scale(${heightRatio})`;
  }

  function calcValues(values, currentYOffset) {
    let rv;
    // 현재 씬에서 스크롤 된 범위를 비율로 구함
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;
      const partScrollRaito = (currentYOffset - partScrollStart) / partScrollHeight;

      if (currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
        rv = partScrollRaito * (values[1] - values[0]) + values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
        objs.context.drawImage(objs.videoImages[sequence], 0, 0);
        objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

        //TODO: 같은 동작을 하는게 여러개니까 argument를 받아 뱉어주는 함수 만들기
        // argument 는 A,B,C 어떤것인지 & scrollRation 값
        //A
        if (scrollRatio <= 0.11) {
          // in
          const messageA_opacity_in = calcValues(values.messageA_opacity_in, currentYOffset);
          const messageA_translateY_in = calcValues(values.messageA_translateY_in, currentYOffset);

          objs.messageA.style.opacity = messageA_opacity_in;
          objs.messageA.style.transform = `translateY(${messageA_translateY_in}%)`;
        } else {
          // out
          const messageA_opacity_out = calcValues(values.messageA_opacity_out, currentYOffset);
          const messageA_translateY_out = calcValues(values.messageA_translateY_out, currentYOffset);

          objs.messageA.style.opacity = messageA_opacity_out;
          objs.messageA.style.transform = `translateY(${messageA_translateY_out}%)`;
        }

        //B
        if (scrollRatio <= 0.28) {
          // in
          const messageB_opacity_in = calcValues(values.messageB_opacity_in, currentYOffset);
          const messageB_translateY_in = calcValues(values.messageB_translateY_in, currentYOffset);

          objs.messageB.style.opacity = messageB_opacity_in;
          objs.messageB.style.transform = `translateY(${messageB_translateY_in}%)`;
        } else {
          // out
          const messageB_opacity_out = calcValues(values.messageB_opacity_out, currentYOffset);
          const messageB_translateY_out = calcValues(values.messageB_translateY_out, currentYOffset);

          objs.messageB.style.opacity = messageB_opacity_out;
          objs.messageB.style.transform = `translateY(${messageB_translateY_out}%)`;
        }

        //C
        if (scrollRatio <= 0.43) {
          // in
          const messageC_opacity_in = calcValues(values.messageC_opacity_in, currentYOffset);
          const messageC_translateY_in = calcValues(values.messageC_translateY_in, currentYOffset);

          objs.messageC.style.opacity = messageC_opacity_in;
          objs.messageC.style.transform = `translateY(${messageC_translateY_in}%)`;
        } else {
          // out
          const messageC_opacity_out = calcValues(values.messageC_opacity_out, currentYOffset);
          const messageC_translateY_out = calcValues(values.messageC_translateY_out, currentYOffset);

          objs.messageC.style.opacity = messageC_opacity_out;
          objs.messageC.style.transform = `translateY(${messageC_translateY_out}%)`;
        }

        //D
        if (scrollRatio <= 0.58) {
          // in
          const messageD_opacity_in = calcValues(values.messageD_opacity_in, currentYOffset);
          const messageD_translateY_in = calcValues(values.messageD_translateY_in, currentYOffset);

          objs.messageD.style.opacity = messageD_opacity_in;
          objs.messageD.style.transform = `translateY(${messageD_translateY_in}%)`;
        } else {
          // out
          const messageD_opacity_out = calcValues(values.messageD_opacity_out, currentYOffset);
          const messageD_translateY_out = calcValues(values.messageD_translateY_out, currentYOffset);

          objs.messageD.style.opacity = messageD_opacity_out;
          objs.messageD.style.transform = `translateY(${messageD_translateY_out}%)`;
        }

        //E
        if (scrollRatio <= 0.71) {
          // in
          const messageE_opacity_in = calcValues(values.messageE_opacity_in, currentYOffset);
          const messageE_translateY_in = calcValues(values.messageE_translateY_in, currentYOffset);

          objs.messageE.style.opacity = messageE_opacity_in;
          objs.messageE.style.transform = `translateY(${messageE_translateY_in}%)`;
        } else {
          // out
          const messageE_opacity_out = calcValues(values.messageE_opacity_out, currentYOffset);
          const messageE_translateY_out = calcValues(values.messageE_translateY_out, currentYOffset);

          objs.messageE.style.opacity = messageE_opacity_out;
          objs.messageE.style.transform = `translateY(${messageE_translateY_out}%)`;
        }

        //F
        if (scrollRatio <= 0.86) {
          // in
          const messageF_opacity_in = calcValues(values.messageF_opacity_in, currentYOffset);
          const messageF_translateY_in = calcValues(values.messageF_translateY_in, currentYOffset);

          objs.messageF.style.opacity = messageF_opacity_in;
          objs.messageF.style.transform = `translateY(${messageF_translateY_in}%)`;
        } else {
          // out
          const messageF_opacity_out = calcValues(values.messageF_opacity_out, currentYOffset);
          const messageF_translateY_out = calcValues(values.messageF_translateY_out, currentYOffset);

          objs.messageF.style.opacity = messageF_opacity_out;
          objs.messageF.style.transform = `translateY(${messageF_translateY_out}%)`;
        }

        //G
        if (scrollRatio <= 0.96) {
          // in
          const messageG_opacity_in = calcValues(values.messageG_opacity_in, currentYOffset);
          const messageG_translateY_in = calcValues(values.messageG_translateY_in, currentYOffset);

          objs.messageG.style.opacity = messageG_opacity_in;
          objs.messageG.style.transform = `translateY(${messageG_translateY_in}%)`;
        } else {
          // out
          const messageG_opacity_out = calcValues(values.messageG_opacity_out, currentYOffset);
          const messageG_translateY_out = calcValues(values.messageG_translateY_out, currentYOffset);

          objs.messageG.style.opacity = messageG_opacity_out;
          objs.messageG.style.transform = `translateY(${messageG_translateY_out}%)`;
        }
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
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return;
      currentScene--;
      document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    if (enterNewScene) return; // 새로운 씬에 들어왔을 때 음수값 나오는 버그 수정

    playAnimation();
  }

  setCanvasImages();
  // 세로 창이 변화되면 Layout 재설정
  window.addEventListener('load', () => {
    setLayout();
    // TODO: 시작하자 마자 이미지가 올라와야 되는데 버그가 있음 고쳐야함. => setCanvasImages 가 먼저 선언되었어야함.
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
  });
  window.addEventListener('scroll', () => {
    yOffset = window.pageYOffset;
    scrollLoop();
  });
  window.addEventListener('resize', setLayout);

  setLayout();
})();

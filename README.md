> WeCode 사전스터디 개인페이지 만들기 PJ

# TOC

1. [HELLO, WORLD](#hello,-world)
2. [🎉 초안](#🎉-초안)
3. [🌁 배경](#🌁-배경)
4. [🛠 구현 컨셉](#🛠-구현-컨셉)
5. [🩹 TODOs](#🩹-TODOs)
6. [🔭 마치며](#🔭-마치며)

# HELLO, WORLD

https://yunkukpark.github.io/introduce-YunkukPark/

# 🎉 초안

<img width="486" alt="스크린샷 2021-11-03 오후 6 43 28" src="https://user-images.githubusercontent.com/53929065/140038361-52353c76-338b-44c1-959e-ae210457af49.png">

# 🌁 배경

WeCode 사전 스터디 과제로 자기소개 페이지 제출이 있었는데, 예전에 공부했던 1분코딩의 애플 클론코딩을 복습 할 겸, 인터랙티브 요소 개발에 평소 흥미도 있어서 자기소개 페이지를 다음과 같이 기획 했다.

# 🛠 구현 컨셉

## Ⅰ. Scroll Animation Section

### 1. 특정 타이밍 스크롤 애니메이션, Text in & out Controll

```javascript
const sceneInfo = [
    {
      // 0 - Landing Section
      idx: 0,
      type: 'sticky',
      heightNum: 15, // 브라우저 높이의 15배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector('#scroll-section-0'),
        messageA: document.querySelector('#scroll-section-0 .landing-message.a'),
        ......
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

        ......

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
```

`SceneInfo` 에 접근해야 하는 DOM 객체를 보관해놓았다.
`setting.json` 처럼 미리 여기에 사용될 변수들을 선언 해놓았다.

**`calcValues`**

```javascript
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
```

**스크롤 애니메이션에서 가장 핵심이 되는 함수**이다.  
현재 내가 보고 있는 Section 안에서 스크롤된 범위를 구하고,
SceneInfo의 values의 값을 scrollRatio와 연산하여 return 한다.

<img width="486" alt="스크린샷 2021-11-03 오후 6 44 56" src="https://user-images.githubusercontent.com/53929065/140038549-cfcfb8b5-49e3-42ed-870b-70131bf3945e.png">

### 2. Video Play

> Video 제어는 3가지 방법으로 가능 했다.

1. Video 로 제어
2. Image 로 제어
3. Canvas 에 Image를 넣어 제어

이중 애플에서 한 방식 3번 방식을 사용하였다.

```javascript
  const sceneInfo = [
    {
      // 0 - Landing Section
      idx: 0,
      type: 'sticky',
      heightNum: 15, // 브라우저 높이의 15배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        ......
        canvas: document.querySelector('#video-canvas-0'),
        context: document.querySelector('#video-canvas-0').getContext('2d'),
        videoImages: [],
      },
      values: {
        ......
        //IMAGE
        videoImageCount: 300,
        imageSequence: [0, 299],

        // Canvas
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
      },
    },
```

정보를 보관하고 있는 sceneInfo 배열에 videoImage 를 관리하는 공간을 만들고

```javascript
// sceneInfo.objs.videoImages 배열에 이미지를 push 해준다.
function setCanvasImages() {
  let imgElem;
  for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
    imgElem = new Image();
    imgElem.src = `./assets/video/002/IMG_7574${i}.png`;
    sceneInfo[0].objs.videoImages.push(imgElem);
  }
}
```

for문을 통해 이미지를 push 해준다.

> `calcValues` 에 대한 설명은 Ⅰ-1 에 있다.

```javascript
let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
objs.context.drawImage(objs.videoImages[sequence], 0, 0, 1920, 1080);
```

context.drawImage를 통해 배열에 있는 이미지들을 화면에 뿌려준다.

실제로는 나가는 모션 까지 380개 이미지가 있지만, 딱 300개만 했을 때 개발자 박윤국 텍스트와 싱크가 맞아 떨어져서 300개만 Counting 하였다.

## Ⅱ. Linked-In Section

일반 스크롤 섹션으로, 기본소개와 노션, 깃허브, 유튜브, 벨로그로 이동 할 수 있는 링크로 구성하였다.

## Ⅲ. Contact Section

a태그에 mailto를 사용해도 되었으나, outlook이나 mail앱을 열어 진행하는 것 보다 사용자에게 손쉽게 Contact할 수 있게끔 유도 하고 싶어서 emailjs API 를 사용하여 구현하였다.

```javascript
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
```

# 🩹 TODOs

## index.js

<<<<<<< HEAD

- [ ] scrollHeight > normal섹션 쪽에서 setLayout 함수가 잘 안먹히는 버그 수정 필요
- [ ] # `function playAnimation()` 같은 동작을 하는게 여러개니까 argument를 받아 뱉어주는 함수 만들기
- [ ] scrollHeight > normal섹션 쪽에서 setLayout 함수가 잘 안먹히는 버그 수정 필요
- [ ] `function playAnimation()` 같은 동작을 하는게 여러개니까 argument를 받아 뱉어주는 함수 만들기
  > > > > > > > 90bd2571774c3434203414c127e3a9cd8b6d9ecf
- [ ] `eventlinster(load, setLayout)` 시작하자 마자 이미지가 올라와야 되는데 가끔씩 스크롤해줘야만 이미지가 생성되는 버그 수정

## mail.js

<<<<<<< HEAD

- [ ] # 메일이 발송 되면 기존 내용 없애는 로직 추가하기
- [ ] 메일이 발송 되면 기존 내용 없애는 로직 추가하기
  > > > > > > > 90bd2571774c3434203414c127e3a9cd8b6d9ecf
- [ ] 값이 0이 되었음에도 한번 더 키 입력이 되야지 disabled 되는 이슈가 있음.

# 🔭 마치며

인터랙티브 웹개발은 생각보다 어려웠다.  
ScrollHeight 연산을 통해 비디오, 텍스트를 제어해줘야 했으며, 각 씬의 type / 씬안에서도 메세지텍스트 마다 설정값이 다르기에 예상치 못한 곳에서 레이아웃이 어긋나는 상황도 많았다.  
만약, 전에 하는 방법을 모르고 혼자 기획해서 만들어봤다면 어디까지 만들 수 있을까? 하는 생각도 들면서도, 이제 스크롤에 반응하는 인터랙티브 웹을 만드는 방법을 알았기에 더 잘만들고 싶다 라는 욕심도 생긴다.

이번 프로젝트는 모르는게 있으면 강의의 도움을 받았지만, 다음 인터랙티브 웹을 만들때에는 강의도움 없이 한번 만들어보고 싶다. 비록 코드가 엉망진창이 되더라도, 토이프로젝트는 자신감 아닌가..  
개발 또한 자신감 인 것 같다. 내가 한번 경험해 본 로직에 대해서는 확신은 안서더라도 자신감이 있기 때문에 레이아웃이 깨지던지, 에러가 나더라도 대처하는 방법을 알아 패닉하지 않을 수 있었다.

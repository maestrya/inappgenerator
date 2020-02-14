const htmlExample = {
    source: `
    <!DOCTYPE html>
    <html lang="pt-br">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>InApp</title>
        <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        :root {
          font-size: 16px;
        }

        html,
        body {
          height: 100%;
        }

        body {
          background-color: rgba(35, 29, 25, 0.8);
          display: grid;
          height: 100vh;
          place-items: center;
          overflow: hidden;
        }

        .inapp__close {
          position: absolute;
          top: 16px;
          right: 16px;
          display: inline-block;
          color: black;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.88);
          background-position: -25px;
          background-repeat: no-repeat;
          text-decoration: none;
          text-align: center;
          z-index: 999999999;
          align-self: center;
          padding: 8px;
        }

        .step {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: transparent;
          color: white;
          transform: translateX(100%);
          opacity: 0;
          transition: 0.4s cubic-bezier(0.12, 1.1, 0.74, 0.99);
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          border-radius: 0.25rem;
          margin: auto;
          top: 0;
          right: 0;
          bottom: 0;
          height: 100%;
        }

        .step img {
          height: 100%;
          width: 100%;
          object-fit: cover;
          border-radius: 4px;
        }

        .step.is-exceeded {
          transform: translateX(-100%);
        }

        .step.is-active {
          transform: translateX(0);
          opacity: 1;
        }
        .steps {
          position: relative;
          width: 288px;
          height: 400px;
        }

        .steps.is-back .step:not(.is-active) {
          transform: translateX(-100%);
          opacity: 0;
        }

        .steps.is-back .step.is-exceeded {
          transform: translateX(100%);
        }

        .step__container {
          width: 100%;
        }

        .step__bullet {
          margin: 8px auto 0 auto;
          display: block;
          font-size: 0;
        }

        .step__bullet-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 100%;
          margin: 0 2px;
          background-color: white;
        }

        .step__bullet-dot:not(.is-active) {
          opacity: 0.5;
        }

        .content {
          height: auto;
          width: 288px;
          position: relative;
          text-align: center;
        }

        .row {
          display: flex;
          position: absolute;
        }

        .col {
          position: relative;
          width: 100%;
        }

        .full-screen {
          width: 100%;
        }

        .btn {
          display: inline-block;
          font-weight: 400;
          color: #fff;
          background-color: #ec7000;
          text-align: center;
          vertical-align: middle;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          border: 1px solid transparent;
          padding: 0.6875rem;
          font-size: 1rem;
          line-height: 1.5;
          width: 140px;
          border-radius: 0.25rem;
          text-decoration: none;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          text-transform: lowercase;
        }

        .btn-light {
          color: #106eb0;
          background-color: white;
          border-color: #106eb0;
          border-width: 1px;
        }

        .btn-person {
          background-color: #D0A967;
          color: #231D19;
        }

        .one-btn .btn {
          width: 288px !important;
          max-width: 288px !important;
        }

        .one-btn .step__bullet {
          top: 408px;
        }

        .two-btn .btn {
          width: 288px !important;
          max-width: 288px !important;
        }

        .two-btn .btn.col {
          margin-bottom: 8px;
        }

        .without_steps .step__bullet {
          display: none;
        }

        .without_btn .footer {
          display: none;
        }

        .margin-right {
          margin-right: 1rem;
        }
        .margin-left {
          margin-left: 1rem;
        }
        .left {
          float: left !important;
        }
        .right {
          float: right !important;
        }
        .footer {
          top: 420px;
          display: block;
          width: 100%;
          clear: both;
          margin: 8px 0 0 0;
        }
        </style>
      </head>
      <body>
        <main class="content TWOBTN">
          <section class="steps">
            SECTIONS
          </section>
          <span class="step__bullet">
            STEPBULLET
          </span>
          <div class="footer">
            BUTTONS
          </div>
        </main>

        <script>
          (function() {
            const steps = document.querySelectorAll(".step");
            const stepWrapper = document.querySelector(".steps");
            const stepBullet = document.querySelector(".step__bullet");
            const stepBulletDot = document.querySelectorAll(".step__bullet-dot");
            const eventsTouchListener = [
              "touchstart",
              "touchend",
              "mousedown",
              "mouseup"
            ];
            let startAxis = 0;

            const getActiveStepIndex = () => {
              let activeIndex;

              steps.forEach((step, index) => {
                if (step.classList.contains("is-active")) activeIndex = index;
              });

              return activeIndex;
            };

            const isFirstStepIndex = () => getActiveStepIndex(steps) === 0;

            const isLastStepIndex = () =>
              getActiveStepIndex(steps) === steps.length - 1;

            const isNavToNext = event =>
              new Promise((resolve, reject) => {
                switch (event.type) {
                  case "mousedown":
                    startAxis = event.x;
                    break;
                  case "touchstart":
                    startAxis = event.changedTouches[0].clientX;
                    break;
                  case "mouseup":
                    resolve(startAxis > event.x);
                    break;
                  case "touchend":
                    resolve(startAxis > event.changedTouches[0].clientX);
                    break;
                }
              });

            const setActiveStep = (navToNext, currentStepIndex, nextStepIndex) => {
              stepWrapper.classList.toggle("is-back", !navToNext);

              steps.forEach(step => step.classList.remove("is-exceeded"));

              steps[currentStepIndex].classList.remove("is-active");
              stepBulletDot[currentStepIndex].classList.remove("is-active");

              steps[currentStepIndex].classList.add("is-exceeded");

              steps[nextStepIndex].classList.add("is-active");
              stepBulletDot[nextStepIndex].classList.add("is-active");
            };

            const stepNavTo = navToNext => {
              const activeStepIndex = getActiveStepIndex();

              if (isFirstStepIndex() && !navToNext) return;

              if (isLastStepIndex() && navToNext) return;

              if (navToNext) {
                setActiveStep(navToNext, activeStepIndex, activeStepIndex + 1);
                return;
              }

              setActiveStep(navToNext, activeStepIndex, activeStepIndex - 1);
            };

            const stepNavigation = async event => {
              const navToNext = await isNavToNext(event);

              stepNavTo(navToNext);
            };

            eventsTouchListener.map(event =>
              stepWrapper.addEventListener(event, eventElement =>
                stepNavigation(eventElement)
              )
            );
            function getUrl(){
              let url = window.location.href;
              url = url.split('#slide=');
              url = parseInt(url[1]);

              if(url > 0) {
                for (let index = 0; index < parseInt(url); index++) {
                  stepNavTo(true);
                }
              }
            }
            getUrl();
          })();
        </script>
      </body>
    </html>
    `,
  };

  export default htmlExample;

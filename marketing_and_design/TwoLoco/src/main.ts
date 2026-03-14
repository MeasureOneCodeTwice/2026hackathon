import './style.css'
import typescriptLogo from './assets/typescript.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<section id="center">
  <div class="hero">
    <img src="${heroImg}" class="base" width="170" height="179">
    <img src="${typescriptLogo}" class="framework" alt="TypeScript logo"/>
    <img src=${viteLogo} class="vite" alt="Vite logo" />
  </div>
  <div>
    <h1>We are Two Loco </h1>
    <p>We are the best programmers in the world</p>
  </div>
  <button id="counter" type="button" class="counter"></button>


<div class="ticks"></div>
<section id="spacer"></section>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

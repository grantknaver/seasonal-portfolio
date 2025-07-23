<script lang="ts" setup></script>

<template>
  <div class="container column items-center justify-center full-width">
    <div class="sub-container text-primary">
      <h2>About Me</h2>
      <hr />
      <p>
        Hi, I'm Grant Knaver — a full-stack JavaScript developer with 7+ years of professional
        experience, currently based in Eugene, Oregon. I specialize in modern frameworks like
        Angular and Vue, with a strong command of state management libraries (NgRx, Pinia), RESTful
        APIs, responsive UI, and building apps that solve real-world problems.
      </p>
      <p>Most recently, I led development on two major self-directed projects:</p>
      <ol>
        <li>
          DrainData – a surgery drain tracking tool aimed at improving patient recovery through
          better data.
        </li>
        <li>
          StorytAIm – an AI-powered narration toolkit designed for authors, complete with voice
          emotion control and audio stitching.
        </li>
      </ol>
      <p>
        These projects reflect my passion for innovation and blending tech with meaningful impact.
      </p>
      <p>
        Before that, I worked with teams at <b>Lockheed Martin, Labcorp, and Amtrak</b>, building
        high-performance web apps and streamlining complex systems. I’ve worked in environments
        ranging from government labs to startups, with recent experience converting legacy systems,
        integrating Epic OAuth for medical software, and building scalable monorepos.
      </p>
      <p>Tech I enjoy working with includes:</p>
      <ol>
        <li><b>Frontend:</b> Angular, Vue, Quasar, TailwindCSS, SCSS</li>
        <li><b>Backend:</b> Node.js, Express, MongoDB</li>
        <li><b>Tools:</b> NgRx, Pinia, Stripe, ElevenLabs, Figma, GSAP</li>
      </ol>
      <h3>Beyond Code</h3>
      <p>
        Before jumping into tech, I spent years in sales and marketing — selling everything from
        furnaces to phones. That background shaped my product mindset and empathy for users. I’ve
        also worked as a designer and creative, with deep experience in the Adobe Suite and
        branding.
      </p>
      <p>
        Off the clock, I’m a curious mix: I’ve lived abroad in Southeast Asia, ghost hunt with
        friends, and grew up hot air ballooning. Yes, really.
      </p>
      <p>
        In mid-2024, I took a medical leave to treat an autoimmune issue. I'm grateful to be fully
        recovered and back to building software with a new level of focus and energy.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../css/main.scss';

.container {
  background-image: url('../assets/road-surrounded-by-trees.jpg');
  background-size: cover;
  background-position: center;
  min-height: 100vh; /* or whatever size you want */
  border-bottom: 2px solid var(--q-primary);

  .sub-container {
    width: 90%;
    height: 90%;
    background-color: rgba($color: #521c0d, $alpha: 0.5);
  }
}
</style>

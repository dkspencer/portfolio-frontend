<template>
  <div class="h-screen flex flex-col">
    <header class="flex bg-bg">
      <div
        class="
          grid grid-cols-3
          w-full
          overflow-hidden
          max-w-screen-lg
          mx-auto
          pt-5 md:pt-0
          mt-5
          bg-fg
          text-center text-bg
          font-bold
          text-sm
          md:text-lg
        "
      >
        <div>{{ currentDate() }}</div>
        <div id="title">PORTFOLIO</div>
        <div>{{ timeNow }}</div>
      </div>
    </header>

    <div class="flex flex-1 bg-bg overflow-auto" id="terminal">
      <div
        class="w-full max-w-screen-lg mx-auto bg-bg"
        v-on:click="focusTerminal"
      >
        <vue-command
          :history.sync="history"
          :is-in-progress="isInProgress"
          :pointer="pointer"
          :commands="commands"
          prompt=">"
          :hide-bar="hideBar"
          :hide-title="hideTitle"
          :show-help="showHelp"
          :show-intro="showIntro"
          intro="SHELL VERSION 1.0.0, COPYRIGHT 2021 DANIELLE SPENCER"
          ref="terminal"
          class="overflow-hidden text-sm md:text-base"
        >
        </vue-command>
      </div>
    </div>

    <footer class="flex bg-bg">
      <div
        class="w-full overflow-hidden max-w-screen-lg mx-auto mt-5 bg-fg"
        id="footer"
      >
        <p class="text-bg text-sm md:text-xl ml-1 mr-6 px-1 invisible" id="placeholder">
          <button class="text-bg text-xl"></button>
          CLOSE
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import VueCommand, { createStdout, createDummyStdout } from "vue-command";
import moment from "moment";
import "./main.css";
import Education from "./components/Education.vue";
import Experience from "./components/Experience.vue";
import Skill from "./components/Skill.vue";
import User from "./components/User.vue";
import Help from "./components/Help.vue";

export default {
  name: "App",
  components: {
    VueCommand,
  },

  data: () => ({
    builtIn: undefined,
    executed: new Set(),
    history: [],
    isInProgress: false,
    pointer: 0,
    commands: {
      something: () => createStdout("Haha... very funny"),
      education: () => Education,
      experience: () => Experience,
      skills: () => Skill,
      users: () => User,
      help: () => Help,
    },
    hideBar: true,
    hideTitle: true,
    showHelp: true,
    showIntro: false,
    api: false,
    endpoint: process.env.VUE_APP_ENDPOINT,
    user: false,
    timeNow: "",
  }),
  methods: {
    focusTerminal() {
      this.$refs.terminal.focus();
    },
    currentDate() {
      return moment().format("D MMMM YYYY");
    },
    currentTime() {
      this.timeNow = moment().format("h:mm:ss a");
    },
  },
  mounted() {
    // this.$refs.terminal.focus();
    this.currentTime();
    setInterval(this.currentTime, 1000)

  },
  created() {
    var message =
      "PORTFOLIO version 1.0.0<br> ©" +
      new Date().getFullYear() +
      " Danielle Spencer<br> " +
      "<br> Welcome to my portfolio<br><br>" +
      "To get started, try typing in 'help'";

    this.history.push(createStdout(message));

    this.commands.clear = () => {
      this.history = [];
      return createDummyStdout();
    };
    this.commands.download = () => {
      window.open("/DanielleSpencer.pdf", "_blank");
      return createStdout("CV opened in new tab")
    };
    this.commands.documentation = () => {
      window.open(process.env.VUE_APP_ENDPOINT + "/documentation", "_blank");
      return createStdout("Documentation opened in new tab")
    };
  },
};
</script>
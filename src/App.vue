<template>
  <div class="h-screen flex flex-col">
    <header class="flex bg-bg">
      <div
        class="
          w-full
          overflow-hidden
          max-w-screen-lg
          mx-auto
          mt-5
          bg-fg
          text-center text-bg
          font-bold
          text-lg
        "
        id="title"
      >
        PORTFOLIO
      </div>
    </header>

    <div class="flex flex-1 bg-bg overflow-auto" id="terminal">
      <div
        class="w-full max-w-screen-lg mx-auto bg-bg"
        v-on:click="focusTerminal"
      >
        <vue-command
          :built-in="builtIn"
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
          class="overflow-hidden"
        >
        </vue-command>
      </div>
    </div>

    <footer class="flex bg-bg">
      <div
        class="w-full overflow-hidden max-w-screen-lg mx-auto mt-5 bg-fg"
        id="footer"
      >
        <p class="text-bg text-xl ml-1 mr-6 px-1 invisible" id="placeholder">
          <button class="text-bg3 text-xl"></button>
          CLOSE
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import VueCommand, { createStdout, createDummyStdout } from "vue-command";
import "./main.css";
import Education from "./components/Education.vue";
import Experience from "./components/Experience.vue";
import Skill from "./components/Skill.vue";
import User from "./components/User.vue";
import Help from "./components/Help.vue";
import axios from "axios";

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
      EDUCATION: () => Education,
      experience: () => Experience,
      EXPERIENCE: () => Experience,
      skills: () => Skill,
      SKILLS: () => Skill,
      users: () => User,
      USERS: () => User,
      help: () => Help,
      HELP: () => Help,
    },
    hideBar: true,
    hideTitle: true,
    showHelp: true,
    showIntro: false,
    api: false,
    endpoint: "http://localhost:8081",
    user: false,
    apikey: "8b0973a152c2b5a2caf146f34222d42c3955234d",
    data: [],
    answer: null,
  }),
  methods: {
    connect(question) {
      this.api = axios.create({
        baseURL: this.endpoint,
        headers: { Authorization: "Token " + this.apikey },
      });

      this.api
        .post("question", {
          question: question,
        })
        .then((response) => {
          this.data = response.data;
          console.log(this.data.answer);

          this.executed.delete(question);
          this.executed.add(question);
          this.pointer += 1;
          this.history.push(createStdout(this.data.answer));

          this.isInProgress = false;
        })
        .catch((error) => {
          if (error && error.response && error.response.status == 401) {
            alert("Your API Key seems invalid, please try a different one");
          } else {
            console.log(error);
            alert("There was an error while connecting to the API");
          }
        });
    },

    focusTerminal() {
      this.$refs.terminal.focus();
    },
  },
  mounted() {
    // this.$refs.terminal.focus();
  },
  created() {
    var message =
      "PORTFOLIO version 1.0.0<br> ©" +
      new Date().getFullYear() +
      " Danielle Spencer<br> Current date is " +
      new Date().toLocaleDateString() +
      "<br> Welcome to my portfolio<br><br>" +
      "To get started, try typing in 'help'";

    this.history.push(createStdout(message));

    this.builtIn = (stdin) => {
      this.isInProgress = true;

      if (stdin.toLowerCase() == "download") {
        this.history.push(createStdout("CV opened in new tab"));
        window.open("/DSpencer_CV.pdf", "_blank");
      } else {
        this.connect(stdin);
      }
    };

    this.commands.clear = () => {
      this.history = [];
      return createDummyStdout();
    };
  },
};
</script>
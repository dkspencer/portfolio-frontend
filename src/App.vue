<template>
  <div class="h-screen flex flex-col">
    
    <nav
      class="
        antialiased
        bg-fg
        flex
        flex-wrap
        pt-3
        grid grid-cols-3
        text-center
        text-bg
        font-bold
        text-sm
        md:text-lg
      "
    >
      <div>{{ currentDate() }}</div>
      <div>PORTFOLIO</div>
      <div>{{ timeNow }}</div>
    </nav>

    <div class="flex flex-1 bg-bg overflow-auto" id="terminal">
      <div
        class="w-full mx-auto bg-bg"
        v-on:click="focusTerminal"
      >
        <vue-command
          :autocompletion-resolver="autocompletionResolver"
          :built-in="builtIn"
          :commands="commands"
          :cursor.sync="cursor"
          :history.sync="history"
          :stdin.sync="stdin"
          :is-in-progress="isInProgress"
          :pointer="pointer"          
          prompt="~$"
          :hide-bar="hideBar"
          :hide-title="hideTitle"
          :show-help="showHelp"
          ref="terminal"
          class="overflow-hidden text-sm md:text-base"
        >
        </vue-command>
      </div>
    </div>

  </div>
</template>

<script>
import VueCommand, { createStdout, createDummyStdout } from "vue-command";
import moment from "moment";
import "./main.css";
import Education from "./components/Education.vue";
import Experience from "./components/Experience.vue";
import Skills from "./components/Skills.vue";
import User from "./components/User.vue";
import Help from "./components/Help.vue";

export default {
  name: "App",
  components: {
    VueCommand,
  },

  data: () => ({
    autocompletionResolver: () => undefined,
    cursor: 0,
    stdin: '',
    builtIn: undefined,
    executed: new Set(),
    history: [],
    isInProgress: false,
    pointer: 0,
    commands: {
      something: () => createStdout("Haha... very funny"),
      pwd: undefined,
      education: undefined,
      experience: undefined,
      skills: undefined,
      users: undefined,
      help: undefined,
      contact: undefined
    },
    hideBar: true,
    hideTitle: true,
    showHelp: true,
    api: false,
    endpoint: process.env.VUE_APP_ENDPOINT,
    user: false,
    timeNow: "",
    options: {
      long: {
        contact: ['url']
      },
    }
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
    }
  },
  mounted() {
    // this.$refs.terminal.focus();
    this.currentTime();
    setInterval(this.currentTime, 1000)
  },
  created() {
    var message =
      "PORTFOLIO version 1.1.0<br> ©" +
      new Date().getFullYear() +
      " Danielle Spencer<br> " +
      "<br> Welcome to my portfolio<br><br>" +
      "To get started, try typing in 'help'";

    this.history.push(createStdout(message));

    this.commands.clear = () => {
      this.history = [];
      return createDummyStdout();
    };
    this.commands.resume = () => {
      window.open("/DanielleSpencer.pdf", "_blank");
      return createStdout("CV opened in new tab")
    };
    this.commands.documentation = () => {
      window.open(process.env.VUE_APP_ENDPOINT + "/documentation", "_blank");
      return createStdout("Documentation opened in new tab")
    };
    this.commands.skills = () => {
      return Skills
    };
    this.commands.education = () => {
      return Education
    };
    this.commands.experience = () => {
      return Experience
    };
    this.commands.help = () => {
      return Help
    };
    this.commands.about = () => {
      return User
    };
    this.autocompletionResolver = () => {
      // Make sure only programs are autocompleted. See below for version with options
      const command = this.stdin.split(' ')
      if (command.length > 1) {
        return
      }

      const autocompleteableProgram = command[0]
      // Collect all autocompletion candidates
      let candidates = []
      const programs = [...Object.keys(this.commands)].sort()
      programs.forEach(program => {
        if (program.startsWith(autocompleteableProgram)) {
          candidates.push(program)
        }
      })

      // Autocompletion resolved into multiple results
      if (this.stdin !== '' && candidates.length > 1) {
        this.history.push({
          // Build table programmatically
          render: createElement => {
            const columns = candidates.length < 5 ? candidates.length : 4
            const rows = candidates.length < 5 ? 1 : Math.ceil(candidates.length / columns)

            let index = 0
            let table = []
            for (let i = 0; i < rows; i++) {
              let row = []
              for (let j = 0; j < columns; j++) {
                row.push(createElement('td', candidates[index]))
                index++
              }

              table.push(createElement('tr', [row]))
            }

            return createElement('table', { style: { width: '100%' } }, [table])
          }
        })
      }

      // Autocompletion resolved into one result
      if (candidates.length === 1) {
        this.stdin = candidates[0]
      }
    }
  }
};
</script>
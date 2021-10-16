<template>
  <div>
    <div class="flex h-screen antialiased text-gray-900 bg-gray-100">
      <!-- Sidebar -->
      <div
        v-if="isSidebarOpen"
        @click="isSidebarOpen = !isSidebarOpen"
        class="fixed inset-0 z-10 bg-bg"
        style="opacity: 0.5"
        aria-hidden="true"
      ></div>

      <aside
        v-if="isSidebarOpen"
        tabindex="-1"
        class="
          fixed
          inset-y-0
          z-10
          flex flex-shrink-0
          overflow-hidden
          border-r border-fg
          lg:static
          focus:outline-none
        "
        ref="sidebar"
        id="menu"
      >
        <!-- Sidebar links -->
        <nav
          aria-label="Main"
          class="
            flex-1
            w-64
            px-2
            py-4
            space-y-2
            overflow-y-hidden
            hover:overflow-y-auto
            bg-bg
          "
        >
          <div
            class="
              flex-shrink-0
              inline-block
              text-lg
              font-bold
              tracking-widest
              text-fg text-left
              p-2
            "
          >
            <!-- PORTFOLIO version {{ version }} -->
          </div>
          <!-- Portfolio Command links -->
          <div>
            <a
              href="#"
              @click="
                $event.preventDefault();
                portfolioCommandsOpen = !portfolioCommandsOpen;
              "
              class="
                flex
                items-center
                p-2
                text-fg
                font-bold
                transition-colors
                rounded-md
                uppercase
                antialiased
              "
              role="button"
              aria-haspopup="true"
              :aria-expanded="
                portfolioCommandsOpen || portfolioCommandsActive
                  ? 'true'
                  : 'false'
              "
            >
              <span
                class="text-lg font-bold tracking-widest text-fg antialiased"
              >
                Commands
              </span>
              <span class="ml-auto" aria-hidden="true">
                <svg
                  class="w-4 h-4 transition-transform transform"
                  :class="{ 'rotate-180': portfolioCommandsOpen }"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </a>
            <div
              role="menu"
              v-if="portfolioCommandsOpen"
              class="mt-2 space-y-2 px-7"
              aria-label="Portfolio Commands"
            >
              <button
                v-for="cmd in menuCommands"
                :key="cmd.command"
                class="
                  flex flex-row
                  items-center
                  h-12
                  px-4
                  rounded-lg
                  text-fg
                  hover:bg-fg
                  hover:text-bg
                  w-full
                  font-bold
                  tracking-wider
                "
                @click="menuCommand(cmd.command)"
              >
                <i :class="cmd.icon" />
                <span class="ml-3 lowercase">{{ cmd.command }}</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Sidebars button -->
      <div
        class="fixed flex items-center space-x-4 top-5 right-10 bg-fg w-full"
      >
        <button
          @click="
            isSidebarOpen = !isSidebarOpen;
            $nextTick(() => {
              $refs.sidebar.focus();
            });
          "
          class="
            p-1
            text-bg
            transition-colors
            duration-200
            rounded-md
            focus:outline-none
            focus:ring
          "
        >
          <span class="sr-only">Toggle Navigation</span>
          <span aria-hidden="true">
            <svg
              v-if="!isSidebarOpen"
              class="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <svg
              v-if="isSidebarOpen"
              class="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </span>
        </button>
        <div
          class="
            antialiased
            bg-fg
            flex flex-1
            grid grid-cols-3
            text-center text-bg
            font-bold
            text-sm
            md:text-lg
          "
        >
          <div>{{ currentDate() }}</div>
          <div>PORTFOLIO</div>
          <div>{{ timeNow }}</div>
        </div>
      </div>

      <!-- Main content -->
      <main class="flex-1">
        <div
          class="
            flex flex-col
            justify-center
            flex-1
            h-full
            min-h-screen
            overflow-x-hidden overflow-y-auto
          "
        >
          <div class="flex flex-1 bg-bg overflow-auto" id="terminal">
            <div class="w-full text-justify" v-on:click="focusTerminal">
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
                class="overflow-hidden text-sm md:text-base max-w-4xl pt-12"
              >
              </vue-command>
            </div>
          </div>
        </div>
      </main>
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
import Projects from "./components/Projects.vue";

export default {
  name: "App",
  components: {
    VueCommand,
  },

  data: () => ({
    autocompletionResolver: () => undefined,
    cursor: 0,
    stdin: "",
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
        skills: ["help"],
        education: ["help"],
        experience: ["help"],
        about: ["help"],
      },
    },
    isLoading: false,
    isSidebarOpen: false,
    // isSidebarOpen: window.innerWidth >= 1024 ? true : false,
    showYear: window.innerWidth >= 1024 ? true : false,
    portfolioCommandsOpen: true,
    portfolioCommandsActive: false,
    generalCommandsOpen: true,
    generalCommandsActive: false,
    miscCommandsOpen: true,
    miscCommandsActive: false,
    menuCommands: [
      { command: "skills", icon: "fas fa-laptop-code" },
      { command: "education", icon: "fas fa-graduation-cap" },
      { command: "experience", icon: "fas fa-briefcase" },
      { command: "about", icon: "fas fa-user" },
      { command: "projects", icon: "fas fa-project-diagram" },
      { command: "documentation", icon: "fas fa-external-link-alt" },
      { command: "resume", icon: "fas fa-file-download" }
    ],
    version: "1.2.0",
  }),
  methods: {
    menuCommand(command) {
      var elementList = document.querySelectorAll(".term-stdin");
      var last = elementList[elementList.length - 1];
      var child = last.children[0];

      child.value = command;

      var event = new Event("input", {
        bubbles: true,
        cancelable: false,
      });

      child.dispatchEvent(event);

      var eventNew = new KeyboardEvent("keyup", {
        key: "Enter",
        bubbles: true,
        cancelable: false,
      });

      child.dispatchEvent(eventNew);
    },
    focusTerminal() {
      this.$refs.terminal.focus();
    },
    currentDate() {
      if (this.showYear) {
        return moment().format("D MMMM YYYY");
      } else {
        return moment().format("D MMMM");
      }
    },
    currentTime() {
      this.timeNow = moment().format("h:mm:ss a");
    },
  },
  mounted() {
    this.currentTime();
    setInterval(this.currentTime, 1000);
  },
  created() {
    var message =
      "PORTFOLIO version " +
      this.version +
      "<br> ©" +
      new Date().getFullYear() +
      " Danielle Spencer<br> " +
      "<br>Hi, I'm Danielle and I'm a Python Developer.<br><br>";

    this.history.push(createStdout(message));

    this.commands.clear = () => {
      this.history = [];
      return createDummyStdout();
    };
    this.commands.resume = () => {
      window.open("/DanielleSpencer.pdf", "_blank");
      return createStdout("CV opened in new tab");
    };
    this.commands.documentation = () => {
      window.open(process.env.VUE_APP_ENDPOINT + "/documentation", "_blank");
      return createStdout("Documentation opened in new tab");
    };
    this.commands.skills = ({ help }) => {
      if (help) {
        return createStdout("View a list of skills with projects");
      }
      return Skills;
    };
    this.commands.education = ({ help }) => {
      if (help) {
        return createStdout(
          "View an educational history, including certifications"
        );
      }
      return Education;
    };
    this.commands.experience = ({ help }) => {
      if (help) {
        return createStdout("Previous and current job experiences");
      }
      return Experience;
    };
    this.commands.help = () => {
      return Help;
    };
    this.commands.about = ({ help }) => {
      if (help) {
        return createStdout("View information and contact information");
      }
      return User;
    };
    this.commands.projects = ({ help }) => {
      if (help) {
        return createStdout("View a list of projects I have written");
      }
      return Projects;
    };

    this.autocompletionResolver = () => {
      // Make sure only programs are autocompleted. See below for version with options
      const command = this.stdin.split(" ");
      if (command.length > 1) {
        return;
      }

      const autocompleteableProgram = command[0];
      // Collect all autocompletion candidates
      let candidates = [];
      const programs = [...Object.keys(this.commands)].sort();
      programs.forEach((program) => {
        if (program.startsWith(autocompleteableProgram)) {
          candidates.push(program);
        }
      });

      // Autocompletion resolved into multiple results
      if (this.stdin !== "" && candidates.length > 1) {
        this.history.push({
          // Build table programmatically
          render: (createElement) => {
            const columns = candidates.length < 5 ? candidates.length : 4;
            const rows =
              candidates.length < 5
                ? 1
                : Math.ceil(candidates.length / columns);

            let index = 0;
            let table = [];
            for (let i = 0; i < rows; i++) {
              let row = [];
              for (let j = 0; j < columns; j++) {
                row.push(createElement("td", candidates[index]));
                index++;
              }

              table.push(createElement("tr", [row]));
            }

            return createElement("table", { style: { width: "100%" } }, [
              table,
            ]);
          },
        });
      }

      // Autocompletion resolved into one result
      if (candidates.length === 1) {
        this.stdin = candidates[0];
      }
    };
  },
};
</script>
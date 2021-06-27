<template>
  <div
    v-if="environment.isExecuting"
    v-on:click="focusTerminal"
  >
    <div class="w-full overflow-hidden">
      <p class="text-center bg-fg text-bg font-bold text-lg mb-2">HELP</p>
      <p class="text-center font-bold">
        ©{{ new Date().getFullYear() }} Danielle Spencer
      </p>

      <p class="text-fg text-justify px-5 py-5">
        My portfolio takes inspiration from retro UNIX and MS-DOS terminals (and
        as such, commands are case sensitive). Try typing in one of the
        following commands to view the related information about me. For
        examplle; you can type in "skills" to view a list of my skills, and how
        comfortable I feel using them.<br />
        Alternatively, if you just want to quickly see my CV, type in "download"
        and a PDF version of my CV will open up in a new tab in your browser.
      </p>

      <textarea
        class="
          resize-none
          cursor-default
          text-fg text-center
          h-5
          overflow-hidden
        "
        ref="terminal"
        @keydown.112="destroy"
        readonly
      >
------- COMMANDS -------</textarea
      >
    </div>

    <div class="flex flex-wrap overflow-hidden py-5 px-5">
      <div class="" id="description">
        <p class="font-bold text-xl">experience</p>
        <p class="mx-10 text-justify">View a history of my jobs</p>
        <p class="font-bold text-xl">skills</p>
        <p class="mx-10 text-justify">View a list of my skills</p>
        <p class="font-bold text-xl">education</p>
        <p class="mx-10 text-justify">View a history of my education</p>
        <p class="font-bold text-xl">users</p>
        <p class="mx-10 text-justify">
          Read more about me, including how to contact me
        </p>
        <p class="font-bold text-xl">download</p>
        <p class="mx-10 text-justify">Download a copy of my CV</p>
        <p class="font-bold text-xl">clear</p>
        <p class="mx-10 text-justify">Clear the terminal screen</p>
      </div>
    </div>

    <!-- <div class="w-full overflow-hidden max-w-screen-lg mx-auto mt-5"> -->
    <div
      class="flex flex-wrap overflow-hidden justify-center bg-fg"
      ref="actions"
    >
      <p class="text-bg text-xl ml-1 mr-6 px-1">
        <button v-on:click="destroy" class="text-bg3 text-xl">[F1]</button>
        CLOSE
      </p>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
// import CloseBtn from "./CloseBtn.vue";

export default {
  name: "Help",
  inject: ["setIsFullscreen", "terminate"],

  components: {
    // CloseBtn
  },
  data: () => ({}),

  methods: {
    focusTerminal() {
      this.$refs.terminal.focus();
    },
    destroy() {
      // On exit, remove the actions from the footer
      var elem = this.$refs.actions;
      elem.parentNode.removeChild(elem);

      // Hide the placeholder to prevent the extended height of the
      // footer
      var placeholder = document.getElementById("placeholder");
      placeholder.style.display = "block";

      this.terminate();
    },
  },
  computed: {},
  created() {
    this.setIsFullscreen(true);
  },

  mounted() {
    this.$refs.terminal.focus();

    // Move the actions to the footer
    document.getElementById("footer").appendChild(this.$refs.actions);
    var placeholder = document.getElementById("placeholder");
    placeholder.style.display = "none";
  },
};
</script>
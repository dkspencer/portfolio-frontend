<template>
  <div
    v-if="environment.isExecuting"
    class="flex flex-wrap overflow-x-hidden overflow-y-auto"
    v-on:click="focusTerminal"
  >
    <!-- Title and description -->
    <div class="w-full overflow-hidden">
      <p class="text-center font-bold text-sm md:text-base">
        ©{{ new Date().getFullYear() }} Danielle Spencer
      </p>

      <p class="text-fg text-justify p-2 text-sm md:text-base">
        My portfolio takes inspiration from retro UNIX and MS-DOS terminals (and
        as such, commands are case sensitive). Try typing in one of the
        following commands to view the related information about me. For
        example; you can type in "skills" to view a list of my skills and how
        comfortable I feel using them.<br />
        Alternatively, if you just want to quickly see my CV, type in "download"
        and a PDF version of my CV will open up in a new tab in your browser.
      </p>

      <textarea
        class="
          resize-none
          cursor-default
          text-fg text-center
          break-words
          text-sm
          md:text-base
          md:h-5
          overflow-hidden
        "
        ref="terminal"
        @keydown.ctrl.88="destroy"
        readonly
      >
------- COMMANDS -------</textarea
      >
    </div>

    <!-- Commands -->
    <div class="w-full overflow-y-auto p-2 text-sm md:text-base">
      <div class="" id="summary">
        <p class="font-bold text-md md:text-xl">experience</p>
        <p class="mx-5 text-sm md:text-base">View a history of my jobs</p>
        <p class="font-bold text-md md:text-xl">skills</p>
        <p class="mx-5 text-sm md:text-base">View a list of my skills</p>
        <p class="font-bold text-md md:text-xl">education</p>
        <p class="mx-5 text-sm md:text-base">View a history of my education</p>
        <p class="font-bold text-md md:text-xl">users</p>
        <p class="mx-5 text-sm md:text-base">
          Read more about me, including how to contact me
        </p>
        <p class="font-bold text-md md:text-xl">download</p>
        <p class="mx-5 text-sm md:text-base">Download a copy of my CV</p>
        <p class="font-bold text-md md:text-xl">clear</p>
        <p class="mx-5 text-sm md:text-base">Clear the terminal screen</p>
        <p class="font-bold text-md md:text-xl">documentation</p>
        <p class="mx-5 text-sm md:text-base">Open the API documentation</p>
      </div>
    </div>

    <!-- Actions -->
    <div
      class="
        flex flex-wrap
        overflow-hidden
        justify-center
        bg-fg
        font-bold
        text-sm
        md:text-xl
      "
      ref="actions"
    >
      <p class="text-bg ml-1 mr-6 px-1 font-bold">
        <button v-on:click="destroy" class="text-bg font-bold">[CTRL+X]</button>
        CLOSE
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Help",
  inject: ["setIsFullscreen", "terminate"],

  components: {},
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

      // Revert title
      var title = document.getElementById("title");
      title.innerText = 'PORTFOLIO';

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

    // Append component name to title
    var title = document.getElementById("title")
    title.innerText = this.$options.name.toUpperCase();
  },
};
</script>
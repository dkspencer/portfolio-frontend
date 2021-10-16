<template>
  <div class="my-2">
    <p class="text-base md:text-lg mt-3 capitalize">portfolio commands:</p>
    <table>
      <tr
        v-for="command in commands"
        :key="command.label"
        class="text-sm md:text-base ml-5"
      >
        <td class="pl-5">
          {{ command.label }}
        </td>
      </tr>
    </table>

    <p class="text-base md:text-lg mt-3 capitalize">general commands:</p>
    <table>
      <tr
        v-for="command in generalCommands"
        :key="command.label"
        class="text-sm md:text-base ml-5"
      >
        <td class="pl-5">
          {{ command.label }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: "Help",
  inject: ["terminate"],

  components: {},
  data: () => ({
    commands: [
      { label: "experience" },
      { label: "skills" },
      { label: "education" },
      { label: "about" },
      { label: "projects" },
      { label: "resume" },
      { label: "documentation" },
    ],
    generalCommands: [
      { label: "clear" }
    ]
  }),

  async mounted() {
    this.terminate();
  },
};
</script>
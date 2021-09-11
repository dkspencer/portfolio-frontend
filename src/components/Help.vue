<template>
  <div class="my-2">
    <p class="text-lg md:text-xl">Portfolio</p>

    <p class="text-base md:text-lg mt-3">
      <span class="capitalize">usage:</span> [command] [--option]
    </p>

    <p class="text-base md:text-lg mt-3 capitalize">commands:</p>
    <div
      v-for="command in commands"
      :key="command.label"
      class="text-base md:text-lg ml-5"
    >
      {{ command.label }}
    </div>

    <p class="text-base md:text-lg mt-3 capitalize">options:</p>
    <table>
      <tr
        v-for="option in options"
        :key="option.label"
        class="text-base md:text-lg ml-5"
      >
        <td class="pl-5">
          {{ option.label }}
        </td>
        <td class="pl-5">
          {{ option.description }}
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
      { label: "resume" },
      { label: "documentation" },
    ],
    options: [
      { label: "--help", description: "Show this screen" }
    ],
  }),

  async mounted() {
    this.terminate();
  },
};
</script>
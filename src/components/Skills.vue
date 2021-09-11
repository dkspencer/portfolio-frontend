<template>
  <div class="my-2 max-w-4xl">
    <span v-if="isLoading && !isError">Loading ...</span>
    <span v-if="isError">There was an error when trying to contact API</span>

    <table class="mb-2" v-if="!isLoading && !isError">
      <thead class="text-fg text-sm md:text-base border-b border-dashed border-fg">
        <tr>
          <th class="text-left px-2 uppercase hidden lg:table-cell">id</th>
          <th class="text-left px-2 uppercase">name</th>
          <th class="text-left px-2 uppercase">confidence</th>
          <th class="text-left px-2 uppercase hidden lg:table-cell">project title</th>
          <th class="text-left px-2 uppercase hidden md:table-cell">project url</th>
        </tr>
      </thead>
      <tbody class="text-sm md:text-base">
        <tr
          v-for="e in data"
          :key="e.id"
        >
          <td class="text-left px-2 hidden lg:table-cell">{{ e.id }}</td>
          <td class="text-left px-2">{{ e.name }}</td>
          <td class="text-left px-2 md:pr-0 lg:text-left">
            <span v-for="index in e.confidence * 2" :key="index" class="text-fg text-lg" id="progress">|</span>
            <span id="missingprogress" v-for="index in countRemainingProgress(e.confidence) * 2" :key="index + 'a'" class="text-white text-lg">|</span>
            <span id="progressouter" class="text-white text-lg">|</span>
          </td>
          <td v-if="e.example" class="text-left px-2 hidden lg:table-cell">{{ e.example.description }}</td>
          <td v-else class="text-left px-2 hidden md:table-cell"></td>
          <td v-if="e.example" class="text-left px-2 hidden md:table-cell">
            <a :href="e.example.url" class="underline tracking-wide hidden md:table-cell" target="_blank">
              {{ e.example.url }}
            </a>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!isLoading && !isError">
      Showing {{ this.total }} result<span v-if="this.total > 1">s</span>
    </p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  inject: ['terminate'],

  data: () => ({
    isError: false,
    isLoading: true,
    api: false,
    endpoint: process.env.VUE_APP_ENDPOINT,
    user: false,
    apikey: process.env.VUE_APP_APIKEY,
    nextPageEndpoint: "",
    total: 0,
    data: []
  }),

  async mounted () {
    this.connect();
  },

  methods: {
    setIsError (isError) {
      this.isError = isError
    },
    connect(endpoint = "skill") {
      this.api = axios.create({
        baseURL: this.endpoint,
        headers: { Authorization: "Token " + this.apikey },
      });

      this.api
        .get(endpoint)
        .then((response) => {

          this.data = this.data.concat(response.data.results)

          if (!this.total) {
            this.total = response.data.count;
          }

          // Recursively retrieve all results
          this.nextPageEndpoint = response.data.next;
          if (this.nextPageEndpoint) {
            var endpoint = "skill?" + this.nextPageEndpoint.split("?")[1];
            this.connect(endpoint);
          }

          this.isLoading = false
        })
        .catch(() => {
          this.setIsError(true)
        })
        .finally(() => {
          this.isLoading = false
          window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
          this.terminate();
          return
        })
    },
    countRemainingProgress(progress) {
      var remaining = 10 - progress
      return remaining
    }
  },
}
</script>

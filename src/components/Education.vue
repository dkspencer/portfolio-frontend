<template>
  <div class="my-2 max-w-4xl">
    <span v-if="isLoading && !isError">Loading ...</span>
    <span v-if="isError">There was an error when trying to contact API</span>

    <table v-if="!isLoading && !isError">
      <thead class="text-fg text-sm md:text-base border-b border-dashed border-fg">
        <tr>
          <th class="text-left px-2 uppercase hidden md:table-cell">id</th>
          <th class="text-left px-2 uppercase">title</th>
          <th class="text-left px-2 uppercase hidden lg:table-cell">institute</th>
          <th class="text-left px-2 uppercase hidden md:table-cell">country</th>
          <th class="text-left px-2 uppercase hidden lg:table-cell">start date</th>
          <th class="text-left px-2 uppercase">end date</th>
        </tr>
      </thead>
      <tbody class="text-sm md:text-base">
        <tr
          v-for="e in data"
          :key="e.id"
        >
            <td class="text-right px-2 hidden md:table-cell">{{ e.id }}</td>
            <td class="text-left px-2">{{ e.title }}</td>
            <td class="text-left px-2 hidden lg:table-cell">{{ e.institute }}</td>
            <td class="text-left px-2 hidden md:table-cell">{{ e.country }}</td>
            <td class="text-left px-2 hidden lg:table-cell">{{ e.start_date }}</td>
            <td class="text-left px-2">{{ e.end_date }}</td>
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
    connect(endpoint = "education") {
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
            var endpoint = "education?" + this.nextPageEndpoint.split("?")[1];
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
    }
  },
  computed: {
  },
}
</script>

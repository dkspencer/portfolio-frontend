<template>
  <div class="my-2 max-w-4xl">
    <span v-if="isLoading && !isError">Loading ...</span>
    <span v-if="isError">There was an error when trying to contact API</span>

    <p v-if="!isLoading && !isError" class="text-justify px-2 lg:px-4">
      {{ data.profile.summary }}
    </p>

    <table v-if="!isLoading && !isError">
      <tr>
        <td>
          <pre class="hidden lg:block text-xxs p-2 lg:p-4">
            dddddddd
            d::::::d
            d::::::d
            d::::::d
            d:::::d 
    ddddddddd:::::d 
  dd::::::::::::::d 
 d::::::::::::::::d 
d:::::::ddddd:::::d 
d::::::d    d:::::d 
d:::::d     d:::::d 
d:::::d     d:::::d 
d:::::d     d:::::d 
d::::::ddddd::::::dd
 d:::::::::::::::::d
  d:::::::::ddd::::d
   ddddddddd   ddddd
          </pre>
        </td>
        <td class="p-2 lg:p-4">
          <tr class="lowercase text-lg">
            {{
              data.profile.first_name
            }}@portfolio
          </tr>
          <tr>
            <td class="text-white text-opacity-50">Name</td>
            <td>{{ data.profile.first_name }} {{ data.profile.last_name }}</td>
          </tr>
          <tr>
            <td class="text-white text-opacity-50">Age</td>
            <td>{{ calculateAge(data.profile.date_of_birth) }}</td>
          </tr>
          <tr>
            <td class="text-white text-opacity-50">City</td>
            <td>{{ data.profile.city }}</td>
          </tr>
          <tr>
            <td class="text-white text-opacity-50">Country</td>
            <td>{{ data.profile.country }}</td>
          </tr>
          <tr>
            <td class="text-white text-opacity-50">E-mail</td>
            <td>
              <a :href="'mailto:' + data.profile.email_address">{{
                data.profile.email_address
              }}</a>
            </td>
          </tr>
          <tr>
            <td class="text-white text-opacity-50">Phone</td>
            <td>{{ data.profile.phone_number }}</td>
          </tr>

          <template v-for="link in data.links">
            <tr :key="link.name">
              <td class="text-white text-opacity-50">{{ link.name }}</td>
              <td>
                <a
                  :href="link.url"
                  class="underline tracking-wide text-sm md:text-base"
                  target="_blank"
                  :key="link.name"
                  >{{ link.url }}
                </a>
              </td>
            </tr>
          </template>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  inject: ["terminate"],

  data: () => ({
    isError: false,
    isLoading: true,
    api: false,
    endpoint: process.env.VUE_APP_ENDPOINT,
    user: false,
    apikey: process.env.VUE_APP_APIKEY,
    nextPageEndpoint: "",
    total: 0,
    data: [],
  }),

  async mounted() {
    this.connect();
  },

  methods: {
    setIsError(isError) {
      this.isError = isError;
    },
    connect(endpoint = "user") {
      this.api = axios.create({
        baseURL: this.endpoint,
        headers: { Authorization: "Token " + this.apikey },
      });

      this.api
        .get(endpoint)
        .then((response) => {
          this.data = response.data.results[0];

          if (!this.total) {
            this.total = response.data.count;
          }

          // Recursively retrieve all results
          this.nextPageEndpoint = response.data.next;
          if (this.nextPageEndpoint) {
            var endpoint = "user?" + this.nextPageEndpoint.split("?")[1];
            this.connect(endpoint);
          }

          this.isLoading = false;
        })
        .catch(() => {
          this.setIsError(true);
        })
        .finally(() => {
          this.isLoading = false;
          window.scrollTo(
            0,
            document.body.scrollHeight || document.documentElement.scrollHeight
          );
          this.terminate();
          return;
        });
    },
    calculateAge(dateOfBirth) {
      var today = new Date();
      var birthDate = new Date(dateOfBirth);

      var age = today.getFullYear() - birthDate.getFullYear();

      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
  },
  computed: {},
};
</script>

<template>
  <div
    v-if="environment.isExecuting"
    @keyup="nextItem($event)"
    class="flex flex-wrap"
    v-on:click="focusTerminal"
  >
    <!-- Introduction -->
    <div class="w-full overflow-hidden">
      <textarea
        class="
          resize-none
          cursor-default
          text-fg text-center
          h-5
          overflow-hidden
        "
        ref="terminal"
        @keydown.ctrl.88="destroy"
        readonly
        @keyup.39="nextPage"
        @keyup.37="prevPage"
      >
Use the arrow keys or the buttons on the bottom to navigate the table</textarea
      >
    </div>

    <!-- Data table -->
    <div class="w-full overflow-hidden">
      <table ref="table-fixed" class="table-fixed w-full mt-2">
        <thead class="bg-fg text-bg">
          <tr>
            <th class="text-center">ID</th>
            <th class="text-left">FIRST NAME</th>
            <th class="text-left">LAST NAME</th>
            <th class="text-left">AGE</th>
            <th class="text-left">CITY</th>
            <th class="text-left">COUNTRY</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(e, index) in data"
            :key="e.id"
            :class="{ 'active-item': selectedRow === index }"
            v-on:click="selectRow(e, index)"
          >
            <td class="text-center">{{ e.id }}</td>
            <td class="text-left">{{ e.profile.first_name }}</td>
            <td class="text-left">{{ e.profile.last_name }}</td>
            <td class="text-left">
              {{ calculateAge(e.profile.date_of_birth) }}
            </td>
            <td class="text-left">{{ e.profile.city }}</td>
            <td class="text-left">{{ e.profile.country }}</td>
          </tr>
          <tr v-for="index in padRows" :key="index + '1'">
            <td>
              <p class="invisible">{{ index }}</p>
            </td>
          </tr>
        </tbody>
        <tfoot class="mb-5 pr-2 text-right bg-fg text-bg font-bold">
          <tr>
            <td class="text-left pl-2">TOTAL: {{ this.total }}</td>
            <td colspan="5">
              SHOWING PAGE {{ currentPage }} OF {{ calculateShowing }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Summary -->
    <div v-if="showProfile" class="flex flex-wrap overflow-hidden">
      <div class="w-1/4 overflow-hidden sm:w-1/4 md:w-1/4 lg:w-1/4 xl:w-1/4">
        <img
          src="https://avatars1.githubusercontent.com/u/32540965?s=460&v=4"
          alt="An awesome picture of me"
          class="object-contain flex border-2 border-fg my-2"
        />
      </div>

      <div
        class="
          w-3/4
          sm:w-3/4
          md:w-3/4
          lg:w-3/4
          xl:w-3/4
          pl-2
        "
        id="summary"
      >
        <p class="font-bold text-xl">EMAIL ADDRESS</p>
        <p class="mx-10 text-justify">
          {{ this.example.profile.email_address }}
        </p>
        <p class="font-bold text-xl">PHONE NUMBER</p>
        <p class="mx-10 text-justify">
          {{ this.example.profile.phone_number }}
        </p>
        <p class="font-bold text-xl">SUMMARY</p>
        <p class="mx-10 text-justify">
          {{ this.example.profile.summary }}
        </p>
        <template v-for="link in this.example.link">
          <p class="font-bold text-xl" :key="link.name">{{ link.name }}</p>
          <a
            :href="link.url"
            class="mx-10 underline tracking-wide"
            target="_blank"
            :key="link.url"
            >{{ link.url }}</a
          >
        </template>
      </div>
    </div>

    <!-- Actions -->
    <div
      class="flex flex-wrap overflow-hidden justify-center bg-fg"
      ref="actions"
    >
      <p class="text-bg text-xl ml-1 mr-6 px-1">
        <button v-on:click="destroy" class="text-bg2 text-xl">[CTRL+X]</button>
        CLOSE
      </p>
      <p class="text-bg text-xl ml-1 mr-6 px-1">
        <button v-on:click="prevRow" class="text-bg2 text-xl">[↑]</button>
        <button v-on:click="nextRow" class="text-bg2 text-xl">[↓]</button>
        SCROLL
      </p>
      <p class="text-bg text-xl ml-1 mr-6 px-1">
        <button v-on:click="prevPage" class="text-bg2 text-xl">[←]</button>
        PREVIOUS
      </p>
      <p class="text-bg text-xl ml-1 mr-6 px-1">
        <button v-on:click="nextPage" class="text-bg2 text-xl">[→]</button>
        NEXT
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Users",
  inject: ["setIsFullscreen", "terminate"],

  components: {
  },
  data: () => ({
    api: false,
    endpoint: "http://localhost:8081",
    user: false,
    apikey: process.env.VUE_APP_APIKEY,
    data: [],
    selectedRow: 0,
    nextPageEndpoint: "",
    previousPageEndpoint: "",
    total: 0,
    maxRows: 10,
    currentPage: 1,
    rows: 10,
    showProfile: false,
    example: {}
  }),

  methods: {
    connect(endpoint = "user") {
      this.api = axios.create({
        baseURL: this.endpoint,
        headers: { Authorization: "Token " + this.apikey },
      });

      this.api
        .get(endpoint)
        .then((response) => {
          this.data = response.data.results;

          if (!this.total) {
            this.total = response.data.count;
          }

          this.maxRows = +this.data.length - 1;

          this.nextPageEndpoint = response.data.next;
          this.previousPageEndpoint = response.data.previous;

          this.example = this.data[0];

          this.showProfile = true;
        })
        .catch((error) => {
          if (error && error.response && error.response.status == 401) {
            alert("Invalid API Key");
          } else {
            alert("There was an error while connecting to the API");
          }
        });
    },

    selectRow(e, index) {
      this.selectedRow = index;
      this.example = e;
    },

    nextRow() {
      if (this.selectedRow < this.maxRows) {
        this.selectedRow++;
        this.example = this.data[this.selectedRow];
      }
    },
    
    prevRow() {
      if (this.selectedRow > 0) {
        this.selectedRow--;
        this.example = this.data[this.selectedRow];
      }
    },

    nextItem(e) {
      if (e.keyCode == 38 && this.selectedRow > 0) {
        this.prevRow();
      } else if (e.keyCode == 40 && this.selectedRow < this.maxRows) {
        this.nextRow();
      }
    },

    nextPage() {
      if (this.nextPageEndpoint) {
        var endpoint = "user?" + this.nextPageEndpoint.split("?")[1];
        this.connect(endpoint);
        this.selectedRow = 0;
      }
    },
    
    prevPage() {
      if (this.previousPageEndpoint) {
        var endpoint = "user?" + this.previousPageEndpoint.split("?")[1];
        this.connect(endpoint);
        this.selectedRow = 0;
      }
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

    formatKey(key) {
      return key.replace("_", " ").toUpperCase();
    },

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
  computed: {
    calculateShowing() {
      var totalPages = this.total / 10;
      return Math.ceil(totalPages);
    },
    padRows() {
      return this.rows - this.data.length;
    },
  },
  created() {
    this.setIsFullscreen(true);
  },

  mounted() {
    this.$refs.terminal.focus();
    this.connect();

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
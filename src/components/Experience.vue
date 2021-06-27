<template>
  <div
    v-if="environment.isExecuting"
    @keyup="nextItem($event)"
    @keydown.39="nextRow"
    class="flex flex-wrap overflow-x-hidden"
    v-on:click="focusTerminal"
  >
    <div class="w-full overflow-hidden">
      <p class="text-center bg-fg text-bg font-bold text-lg mb-2">EXPERIENCE</p>
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
        @keyup.39="nextPage"
        @keyup.37="prevPage"
      >
Use the arrow keys or the buttons on the bottom to navigate the table</textarea
      >
    </div>

    <div class="w-full overflow-hidden">
      <table ref="table-fixed" class="table-fixed w-full mt-2">
        <thead class="bg-fg text-bg">
          <tr>
            <th class="w-1/4 text-center">ID</th>
            <th class="w-1/2 text-left">TITLE</th>
            <th class="w-1/4 text-left">COMPANY</th>
            <th class="w-1/4 text-left">COUNTRY</th>
            <th class="w-1/4 text-left">START DATE</th>
            <th class="w-1/4 text-left">END DATE</th>
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
            <td class="text-left">{{ e.title }}</td>
            <td class="text-left">{{ e.company }}</td>
            <td class="text-left">{{ e.country }}</td>
            <td class="text-left">{{ e.start_date }}</td>
            <td class="text-left" v-if="e.end_date">{{ e.end_date }}</td>
            <td class="text-left" v-else>PRESENT</td>
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

    <div class="w-full overflow-y-auto h-64 pb-5 my-5" id="description">
      <!-- {{ this.example }} -->
      <template v-if="this.example">
        <p v-if="this.example" class="font-bold text-xl">SUMMARY</p>
        <p v-if="this.example" class="mx-10 text-justify">
          {{ this.example }}
        </p>
      </template>
      <template v-else>
        <p>No example</p>
      </template>
    </div>

    <div
      class="flex flex-wrap overflow-hidden justify-center bg-fg"
      ref="actions"
    >
      <p class="text-bg text-xl ml-1 mr-6 px-1">
        <button v-on:click="destroy" class="text-bg3 text-xl">[F1]</button>
        CLOSE
      </p>
      <p class="text-bg text-xl ml-1 mr-6 px-1">
        <button v-on:click="prevRow" class="text-bg3 text-xl">[↑]</button>
        <button v-on:click="nextRow" class="text-bg3 text-xl">[↓]</button>
        SCROLL
      </p>
      <p class="text-bg text-xl ml-1 mr-6 px-1">
        <button v-on:click="prevPage" class="text-bg3 text-xl">[←]</button>
        PREVIOUS
      </p>
      <p class="text-bg text-xl ml-1 mr-6 px-1">
        <button v-on:click="nextPage" class="text-bg3 text-xl">[→]</button>
        NEXT
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Experience",
  inject: ["setIsFullscreen", "terminate"],

  components: {},
  data: () => ({
    api: false,
    endpoint: "http://localhost:8081",
    user: false,
    apikey: "8b0973a152c2b5a2caf146f34222d42c3955234d",
    data: [],
    selectedRow: 0,
    nextPageEndpoint: "",
    previousPageEndpoint: "",
    total: 0,
    maxRows: 0,
    currentPage: 1,
    rows: 10,
    example: {},
  }),

  methods: {
    connect(endpoint = "experience") {
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
      console.log("index", index);
      console.log("example", e);
      this.selectedRow = index;
      this.example = e.summary;
    },

    nextRow() {
      if (this.selectedRow < this.maxRows) {
        this.selectedRow++;
        this.example = this.data[this.selectedRow].summary;
      }
    },

    prevRow() {
      if (this.selectedRow > 0) {
        this.selectedRow--;
        this.example = this.data[this.selectedRow].summary;
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
        var endpoint = "experience?" + this.nextPageEndpoint.split("?")[1];
        this.connect(endpoint);
        this.selectedRow = 0;
      }
    },

    prevPage() {
      if (this.previousPageEndpoint) {
        var endpoint = "experience?" + this.previousPageEndpoint.split("?")[1];
        this.connect(endpoint);
        this.selectedRow = 0;
      }
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
  },
};
</script>
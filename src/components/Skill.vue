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
          break-words
          text-sm
          md:text-base
          md:h-5
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
      <table ref="table-fixed" class="table-fixed min-w-full mt-2">
        <thead class="bg-fg text-bg text-sm md:text-base">
          <tr>
            <th class="text-center hidden md:table-cell">ID</th>
            <th class="text-left">NAME</th>
            <th class="text-right px-2">CONFIDENCE</th>
          </tr>
        </thead>
        <tbody  class="text-sm md:text-base">
          <tr
            v-for="(e, index) in data"
            :key="e.id"
            :class="{ 'active-item': selectedRow === index }"
            v-on:click="selectRow(e, index)"
          >
            <td class="text-center hidden md:table-cell">{{ e.id }}</td>
            <td class="text-left">{{ e.name }}</td>
            <td class="text-right px-2">
              <progress
                :value="e.confidence"
                max="10"
                class="align-middle"
              ></progress>
            </td>
          </tr>
          <tr v-for="index in padRows" :key="'A' + index">
            <td>
              <p class="invisible">{{ index }}</p>
            </td>
          </tr>
        </tbody>
        <tfoot class="mb-5 pr-2 text-right bg-fg text-bg font-bold text-sm md:text-base">
          <tr>
            <td class="text-left pl-2">TOTAL: {{ this.total }}</td>
            <td colspan="2" class="pr-2">
              SHOWING PAGE {{ currentPage }} OF {{ calculateShowing }}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- Summary -->
    <div class="flex flex-wrap overflow-hidden" id="summary">
      <template v-if="this.example">
        <div v-if="this.icon" class="w-1/4 overflow-hidden">
          <i :class="this.icon" class="object-contain flex my-2 fa-10x justify-center"></i>
        </div>

        <div :class="{ 'w-3/4 pl-2': this.icon}">
          <p class="font-bold text-base md:text-xl">SUMMARY</p>
          <p class="ml-5 mr-1 md:mx-10 text-justify text-sm md:text-base">
            {{ this.example.summary }}
          </p>

          <p class="font-bold text-base md:text-xl">URL</p>
          <a
            :href="this.example.url"
            class="ml-5 mr-1 md:mx-10 underline tracking-wide text-sm md:text-base"
            target="_blank"
            >{{ this.example.url }}</a
          >
        </div>
      </template>
      <template v-else>
        <p>No example</p>
      </template>
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
      <p class="text-bg ml-1 mr-6 px-1">
        <button v-on:click="destroy" class="text-bg font-bold">[CTRL+X]</button>
        CLOSE
      </p>
      <p class="text-bg ml-1 mr-6 px-1">
        <button v-on:click="prevRow" class="text-bg font-bold">[↑]</button>
        <button v-on:click="nextRow" class="text-bg font-bold">[↓]</button>
        SCROLL
      </p>
      <p class="text-bg ml-1 mr-6 px-1">
        <button v-on:click="prevPage" class="text-bg font-bold">[←]</button>
        PREVIOUS
      </p>
      <p class="text-bg ml-1 mr-6 px-1">
        <button v-on:click="nextPage" class="text-bg font-bold">[→]</button>
        NEXT
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Skills",
  inject: ["setIsFullscreen", "terminate"],

  components: {},
  data: () => ({
    api: false,
    endpoint: process.env.VUE_APP_ENDPOINT,
    user: false,
    apikey: process.env.VUE_APP_APIKEY,
    data: [],
    selectedRow: 0,
    nextPageEndpoint: "",
    previousPageEndpoint: "",
    total: 0,
    maxRows: 0,
    currentPage: 1,
    rows: 10,
    example: {},
    icon: false,
  }),

  methods: {
    connect(endpoint = "skill") {
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

          this.example = this.data[0].example;
          this.icon = this.data[0].icon;
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
      this.example = e.example;
      this.icon = e.icon;
    },

    nextRow() {
      if (this.selectedRow < this.maxRows) {
        this.selectedRow++;
        this.example = this.data[this.selectedRow].example;
        this.icon = this.data[this.selectedRow].icon
      }
    },

    prevRow() {
      if (this.selectedRow > 0) {
        this.selectedRow--;
        this.example = this.data[this.selectedRow].example;
        this.icon = this.data[this.selectedRow].icon
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
        var endpoint = "skill?" + this.nextPageEndpoint.split("?")[1];
        this.connect(endpoint);
        this.selectedRow = 0;
      }
    },
    
    prevPage() {
      if (this.previousPageEndpoint) {
        var endpoint = "skill?" + this.previousPageEndpoint.split("?")[1];
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
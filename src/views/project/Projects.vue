<template>
  <div class="page-container">
    <router-link to="/projects/create" class="button is-primary">
      <span>สร้างโปรเจค</span>
      <span class="icon is-small">
        <i class="fas fa-plus"></i>
      </span>
    </router-link>
    <div class="columns filter-wrapper">
      <div class="column">
        <div class="field">
          <div class="control">
            <div class="select is-fullwidth">
              <select>
                <option>Select dropdown</option>
                <option>With options</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <div class="control">
            <div class="select is-fullwidth">
              <select>
                <option>Select dropdown</option>
                <option>With options</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <div class="control">
            <div class="select is-fullwidth">
              <select>
                <option>Select dropdown</option>
                <option>With options</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="table">
      <div class="columns thead is-multiline">
        <div class="column is-4">โปรเจค</div>
        <div class="column is-2">ลูกค้า</div>
        <div class="column is-2">สถานะ</div>
        <div class="column">เริ่ม</div>
        <div class="column">จบ</div>
        <div class="column"></div>
      </div>
      <div class="columns is-multiline" v-for="project in projects">
        <div class="column is-4">
          <a :href="'/projects/board/' + project.id">{{ project.name }}</a>
          </div>
        <div class="column is-2">{{ project.client }}</div>
        <div class="column is-2">
          <span class="tag is-warning">Warning</span>
        </div>
        <div class="column">{{ $format.date(project.start) }}</div>
        <div class="column">{{ $format.date(project.end) }}</div>
        <div class="column has-text-right">
          <button class="table-button fas fa-ellipsis-v"></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      projects: []
    };
  },
  methods: {
    get() {
      this.projects = this.$getData("projects");
    }
  },
  created() {
    this.$root.page = "dashboard";
    this.$root.pageTitle = "โปรเจค";
    this.get();
  }
};
</script>

<style lang="sass">  
.page-container
   padding: 0 2.75rem
.page-title
   font-size: 1.75rem
   color: #00dbb1
</style>
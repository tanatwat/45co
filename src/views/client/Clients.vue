<template>
  <div class="page-container">
    <router-link to="/clients/create" class="button is-primary">
      <span>เพิ่มลูกค้า</span>
      <span class="icon is-small">
        <i class="fas fa-plus"></i>
      </span>
    </router-link>
    <div class="table">
      <div class="columns thead is-multiline">
        <div class="column is-4">NAME</div>
        <div class="column"></div>
      </div>
      <div class="columns is-multiline" v-for="(client, index) in clients">
        <div class="column">
          <a @click.prevent="toggleList(index)">{{ client.name }}</a>
          <transition name="fade">
                    <div v-show="current == index">
            {{ client.address }}
          </div>
          </transition>
        </div>
        <div class="column has-text-right is-relative">
          <button class="table-button fas fa-pen"></button>
          <button class="table-button fas fa-trash"></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      clients: null,
      current: null
    }
  },
  methods: {
    get() {
      this.clients = this.$getData('clients')
    },
    toggleList(index) {
      if(this.current == index) {
        this.current = null
      } else {
        this.current = index
      }
    }
  },
  created() {
    this.$root.page = "dashboard";
    this.$root.pageTitle = "ลูกค้าของคุณ";
    this.get()
  }
};
</script>

<style lang="sass">
.table-dropdown
  position: absolute
  right: 0
  margin-top: 10px
  background: #fff
  min-width: 140px
  text-align: left
  display: flex
  flex-direction: column
  border: 1px solid #eee
  border-radius: 8px
  box-shadow: 0px 0px 20px -10px #777
  a
    padding: 0 1rem
    margin-bottom: .75rem
    color: #777
    &:first-child
      margin-top: .75rem
    &:hover
      color: #00dbb1
</style>
<template>
  <div id="app">
   
      <div class="load-overlay" v-show="$root.loading">
        <div class="lds-css ng-scope">
          <div style="width:100%;height:100%" class="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

    <router-view></router-view>
  </div>
</template>

<style lang="sass">
$primary: #00dbb1
$primary-invert: #fff
$input-radius: 5px
$input-border-color: #ddd
$input-hover-border-color: $primary
$input-focus-border-color: $primary
$input-arrow: $primary
$label-color: #777


.select select,
.input
  border-width: 1px !important

@import "./sass/_files"
@import "bulma"

$animationDuration: 0.5s; // specify animation duration. Default value: 1s
@import "vue2-animate/src/sass/vue2-animate.scss"

.router-link-exact-active
  color: $primary !important

.nav, .nav-create
  display: flex
  align-items: center
  width: 100%
  height: 70px
  background: transparent
  position: fixed
  // box-shadow: 0px 1px 15px 0px #ddd

.nav
  left: 250px

.side-nav
  position: fixed
  display: flex
  flex-direction: column
  padding-top: 100px
  padding-left: 1.75rem
  width: 250px
  background: #162637
  height: 100%
  font-size: 1.1rem
  a
    color: #fff
    margin-bottom: 10px
    &:hover
      color: $primary

.page-wrapper
  padding-top: 100px
  padding-left: 250px
  &.create-page
    padding-left: 0
</style>

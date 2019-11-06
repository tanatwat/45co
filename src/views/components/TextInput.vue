<template>
  <div class="field">
    <label class="label" v-show="label">{{ label }}</label>
    <div class="control">
      <input
      :required="required"
      :value="value"
      :class="[{'is-danger' : errors.first(name)} , inputClass]"
      :data-vv-as="validateAs" 
      :type="type"
      v-validate="validate"
      :name="name"
      :placeholder="placeholder"
      @input="$emit('input', $event.target.value)"/>
    </div>
    <transition name="fade">
      <p class="error-msg has-text-danger" v-show="errors.first(name)">{{ errors.first(name) }}</p>
    </transition>
    
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: null
    },
    value: {
      type: String,
      default: null
    },
    required: {
      type: Boolean,
      default: false
    },
    validate: {
      type: String,
      default: null
    },
    validateAs: {
      type: String,
      default: null
    },
    inputClass: {
      default: 'input'
    }
  }
}
</script>

<style lang="sass">
.error-msg
  margin-top: 1rem
  &::before
    font-family: 'Font Awesome 5 Free'
    font-weight: 600
    content: '\f06a'
    margin-right: 8px
</style>

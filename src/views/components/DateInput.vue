<template>
  <datepicker
    :placeholder="placeholder"
    @input="selected($event)"
    :language="th"
    input-class="input date-input"
    :clear-button="true"
    :disabled-dates="disabledDates"
    ref="dateInput"
  ></datepicker>
</template>
<script>
import Datepicker from "vuejs-datepicker";
export default {
  components: { Datepicker },
  props: {
    placeholder: {
      default: null
    },
    disabledDates: {
      default: () => {
        return {
          to: null
        }
      }
    }
  },
  methods: {
    selected(event) {
      this.$emit('input', event)
    },
    reset() {
      this.$refs.dateInput.selectedDate = null
    }
  },
};
</script>
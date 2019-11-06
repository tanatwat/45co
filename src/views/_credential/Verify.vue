<template>
  <div class="form-panel has-text-centered" style="margin-top:100px">
    <h2 class="title has-text-primary">โปรดเช็คอีเมลของคุณ</h2>
    <p>เราได้ส่งอีเมลเพื่อทำการยืนยันการสมัครสมาชิกของคุณ</p>
    <p>คุณสามารถยืนยันอีเมลได้โดยการคลิกลิ้งค์ที่อยู่ในอีเมลที่เราส่งให้คุณ</p>
    <p
      class="has-text-danger"
      style="margin-top: 0.75rem"
    >*ในบางครั้งอีเมลอาจไปถึงช้า โปรดรอ 5 นาที ก่อนกดส่งอีเมลอีกครั้งค่ะ</p>
    <button
      class="button is-medium is-primary"
      :class="{'is-loading' : sending}"
      :disabled="finished"
      style="margin-top: 1.75rem"
      @click="sendEmail"
    >ส่งอีเมลให้ฉันอีกครั้ง</button>
    <p style="margin-top:1.75rem"><a @click.prevent="signout">ล็อกเอาท์</a></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sending: false,
      finished: false
    };
  },
  methods: {
    sendEmail() {
      if (!this.$auth.currentUser.emailVerified) {
        this.sending = true;
        let self = this;
        this.$auth.currentUser
          .sendEmailVerification()
          .then(function() {
            // Email sent.
            self.sending = false;
            self.finished = true;
          })
          .catch(function(error) {
            // An error happened.
            self.sending = false;
            self.finished = true;
            alert("เกิดข้อผิดพลาดโปรดลองใหม่อีกครั้งหลังจากผ่านไป 5 นาที");
          });
      } else {
        alert("คุณได้ยืนยันอีเมลแล้ว คุณสามารถลงชื่อเข้าใช้ได้เลย");
      }
    },
    signout() {
      if (confirm("ล็อกเอาท์?")) {
        this.$auth.signOut().then(() => {
          this.$router.replace("/login");
        })
      }
    }
  }
};
</script>
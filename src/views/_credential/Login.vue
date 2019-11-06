<template>
  <div class="form-panel" style="margin-top: 100px">
    <transition name="fade">
      <form class @submit.prevent="login()" v-show="form == 'login'">
        <h3 class="form-title">ลงชื่อเข้าใช้</h3>
        <div class="form-wrapper">
          <form-input
            :required="true"
            name="project"
            placeholder="อีเมล"
            validate="required"
            validate-as="อีเมล"
            v-model="email"
            input-class="line-input"
          ></form-input>
        </div>
        <div class="form-wrapper">
          <form-input
            :required="true"
            name="project"
            placeholder="รหัสผ่าน"
            validate="required"
            validate-as="รหัสผ่าน"
            v-model="password"
            input-class="line-input"
            type="password"
          ></form-input>
        </div>
        <div class="field" style="margin-top: 1.75rem">
          <div class="control">
            <button type="submit" class="button is-medium is-primary is-fullwidth">ลงชื่อเข้าใช้</button>
          </div>
        </div>
        <div class="login-divider">
          <p>ยังไม่สมัครสมาชิก?</p>
        </div>
        <div class="field">
          <div class="control">
            <button
              type="button"
              class="button is-medium is-primary is-outlined is-fullwidth"
              @click="form = 'register'"
            >สมัครสมาชิก</button>
          </div>
        </div>
      </form>
    </transition>
    <transition name="fade">
      <form @submit.prevent="register()" v-show="form == 'register'">
        <h3 class="form-title">สมัครสมาชิก</h3>
        <div class="form-wrapper">
          <form-input
            :required="false"
            name="name"
            placeholder="ชื่อของคุณ หรือ บริษัท"
            validate="required"
            validate-as="ชื่อ"
            v-model="name"
            input-class="line-input"
          ></form-input>
        </div>
        <div class="form-wrapper">
          <form-input
            :required="false"
            name="email"
            placeholder="อีเมล"
            validate="required"
            validate-as="อีเมล"
            v-model="email"
            input-class="line-input"
          ></form-input>
        </div>
        <div class="form-wrapper">
          <form-input
            :required="false"
            name="password"
            placeholder="รหัสผ่าน"
            validate="required"
            validate-as="รหัสผ่าน"
            v-model="password"
            input-class="line-input"
            type="password"
          ></form-input>
        </div>
        <div class="field" style="margin-top: 1.75rem">
          <div class="control">
            <button class="button is-medium is-primary is-fullwidth">สมัครสมาชิก</button>
          </div>
        </div>
        <div class="login-divider">
          <p>มีบัญชีอยู่แล้ว?</p>
        </div>
        <div class="field">
          <div class="control">
            <button
              type="button"
              class="button is-medium is-primary is-outlined is-fullwidth"
              @click="form = 'login'"
            >ลงชื่อเข้าใช้</button>
          </div>
        </div>
      </form>
    </transition>
      <div class="load-overlay" v-show="load">
        <div class="lds-css ng-scope">
          <div style="width:100%;height:100%" class="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: null,
      password: null,
      name: null,
      form: "login",
      load: false
    };
  },
  methods: {
    register() {
      var self = this;
      this.$auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then((response) => {
          self.$db.collection("users")
            .doc(response.user.uid)
            .set({
              email: response.user.email,
              thumbnail: response.user.photoURL,
              name: self.name
            });
          self.$auth.currentUser.sendEmailVerification()
          self.login();
        })
        .catch(function(error) {
          var errorCode = error.code;
          if (errorCode == "auth/weak-password") {
            // password to weak. Minimal 6 characters
          }
          if (errorCode == "auth/email-already-in-use") {
            // Return a email already in use error
            alert("มีอีเมลนี้ในระบบแล้ว");
          }
        });
    },
    login() {
      var self = this;
      this.load = true
      this.$auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then((user) => {
          window.document.location.replace('/')
        })
        .catch(function(error) {
          self.load = false
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode == "auth/wrong-password") {
            self.password = null
            alert('รหัสผ่านไม่ถูกต้อง')
          }
          if (errorCode == "auth/user-not-found") {
            self.password = null
            alert('ไม่มีอีเมลนี้ในระบบ')
          }
        });
    }
  },
  created() {
    this.$root.page = "create";
  }
};
</script>

<style lang="sass">
.login-divider
  margin: 1.5rem 0
  text-align: center
  color: #999
  p
    margin: 0
</style>
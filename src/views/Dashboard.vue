<template>
  <div>
    <nav class="nav" v-show="$root.page !== 'create'">
      <div class="page-container">
        <p class="page-title">{{ $root.pageTitle }}</p>
      </div>
    </nav>
    <nav class="nav-create" v-show="$root.page == 'create'">
      <div class="container">
        <a @click.prevent="goBack()">BACK</a>
      </div>
    </nav>
    <div class="side-nav" v-show="$root.page !== 'create'">
      <router-link to="/">โต๊ะทำงาน</router-link>
      <router-link to="/clients">ลูกค้า</router-link>
      <router-link to="/projects">โปรเจค</router-link>
      <router-link to="/">ใบเสนอราคา</router-link>
      <a @click.prevent="signout()">ลงชื่อออก</a>
    </div>
    <div class="page-wrapper" :class="{'create-page' : $root.page == 'create'}">

        <router-view />
   
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    signout() {
      if(confirm('ล็อกเอาท์?')) {
        this.$auth.signOut().then(() => {
          this.$router.replace("/login");
        })
      }
    },
    checkUser() {
      if (localStorage.getItem("user") === null) {
        const uid = this.$auth.currentUser.uid
        var set = this.$db.collection('users').doc(uid).get().then((doc) => {
          localStorage.setItem("user", JSON.stringify(doc.data()));
        })
      }
      
    }
  },
    created() {
    this.$root.page = "dashboard";
    this.checkUser()
  }
};
</script>
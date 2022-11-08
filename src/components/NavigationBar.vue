<template>
  <nav class='navbar navbar-expand-lg navbar-dark bg-dark'>
    <div class='container'>
      <div class='navbar-brand'>
        <img
          src='@/assets/images/bootstrap-logo.svg'
          alt=''
          width='30'
          height='24'
          class='d-inline-block align-text-top'
        />
        ゲームセンター
      </div>
      <button
        class='navbar-toggler'
        type='button'
        data-bs-toggle='collapse'
        data-bs-target='#navbarText'
        aria-controls='navbarText'
        aria-expanded='false'
        aria-label='Toggle navigation'
      >
        <span class='navbar-toggler-icon'></span>
      </button>
      <div class='collapse navbar-collapse' id='navbarText'>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar'
}
</script>

<script setup>

</script>

<style scoped>
.user-info {
  margin-right: 5rem;
}

</style>

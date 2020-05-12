<template>
  <tr >
    <td class="text-center">
        <router-link :to="{ name: entry.ctype, params: { id: entry.eid } }" tag="a" class="btn btn-info" exact>{{ entry.title}}</router-link>              
    </td>
    <td v-if="entry.ctype==='page' || entry.ctype==='product'" class="text-center">
        {{ entry.websiteSection}}
    </td>
    <td v-if="entry.ctype==='page' || entry.ctype==='product' || entry.ctype==='asset'" class="text-center">
        {{ entry.websiteKey}}
    </td>        
  </tr>
</template>

<script>
  export default {  
    name:'TableRow',
    props: ['entry'],
    methods: {},
    components: {}
}
</script>

<style scoped>
</style>   


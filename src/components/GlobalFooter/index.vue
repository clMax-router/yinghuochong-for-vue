<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="" target="_blank">JG</a>
      <a href="" target="_blank">摸鱼小队</a>
      <a href="" target="_blank">@CL</a>
    </template>
    <template v-slot:copyright>
      <a href="" target="_blank">萤火小程序后台</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
